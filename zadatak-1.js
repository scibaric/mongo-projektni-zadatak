const csv = require('csv-parser');
const fs = require('fs');
// const MongoClient = require('mongodb');
// const mongoose = require('mongoose');

// const uri = "mongodb://127.0.0.1:27017/projekt";
// const client = new MongoClient(uri);

// mongoose.connect('mongodb://localhost/projekt', {useNewUrlParser: true, useUnifiedTopology: true});

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
  // we're connected!
// });
// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// }

// async function run() {
  // try {
      // Connect to the MongoDB cluster
      // await client.connect();
      // Make the appropriate DB calls
      // await  listDatabases(client);
//   } catch (e) {
//       console.error(e);
//   } finally {
//       await client.close();
//   }
// }


// run().catch(console.error);

var counter = 1;
fs.createReadStream('cpy.csv')
fs.createReadStream('water-treatment.csv')
 .pipe(csv())
 .on('data', (row) => {
      for (var propt in row) {
        if (row[propt] === '?')
          row[propt] = '-1';
      }
      console.log(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });