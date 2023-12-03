const express = require("express");
const axios = require("axios")
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
// This section will help you get a list of all the records.
recordRoutes.route("/record").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb("clients");
    const result = await db_connect.collection("records").find({}).toArray();
    res.json(result);
  } catch (err) {
    throw err;
  }
});
 
// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("records").findOne(myquery);
    res.json(result);
  } catch (err) {
    throw err;
  }
});
 
// This section will help you create a new record.
recordRoutes.route("/record/add").post(authorize('admin'),authenticateToken, async function (req, res) {
  try {
    const db_connect = await dbo.getDb();

    const authToken = req.headers.authorization;

    const myobj = {
      name: req.body.name,
      email: req.body.email,
      website: req.body.website,
      businessID: req.body.businessID
    };

    // If businessID is inserted, make external API call
    if (myobj.businessID != null && authToken) {
      const externalApiUrl = `http://avoindata.prh.fi/opendata/tr/v1/${myobj.businessID}`;
      const externalApiResponse = await axios.get(externalApiUrl, {
        headers: {
          Authorization: authToken
        }
      });

      // Debugging
      console.log('External API Response:', externalApiResponse.data);

    // Check if the expected structure exists in the API response
    if (externalApiResponse.data.results && externalApiResponse.data.results[0]) {
      const clientAddress = externalApiResponse.data.results[0].addresses[0].street || '';

      myobj.clientAddress = clientAddress;
    } else {
      console.error('Unexpected response structure from the external API.');
    }
  }
    
    const result = await db_connect.collection("records").insertOne(myobj);
    console.log("1 document created");
    res.json(result);
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).send('Internal Server Error');
  }
});
 
// This section will help you update a record by id.
recordRoutes.route("/record/:id").patch(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const newvalues = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        website: req.body.website,
        businessID: req.body.businessID
      },
    };
    const result = await db_connect.collection("records").updateOne(myquery, newvalues);
    console.log("1 document updated");
    res.json(result);
  } catch (err) {
    throw err;
  }
});
 
// This section will help you delete a record
recordRoutes.route("/record/:id").delete(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("records").deleteOne(myquery);
    console.log("1 document deleted");
    res.json(result);
  } catch (err) {
    throw err;
  }
});

 
module.exports = recordRoutes;