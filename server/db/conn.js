const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  connectToServer: async function (callback) {
    try {
      await client.connect();
      _db = client.db("employees");
      console.log("Successfully connected to MongoDB.");
      callback(null);
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      callback(err);
    }
  },

  getDb: function () {
    return _db;
  },
};
