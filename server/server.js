// Import the express express module and create the instance
const express = require("express");
const app = express();

// Enable the Cross-Origin Resource Sharing
const cors = require("cors");

// Import env variables from config
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

app.use(cors());
// Parse incoming JSON requests
app.use(express.json());
app.use(require("./routes/record"));

// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {

  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
   });

  console.log(`Server is running on port: ${port}`);
});