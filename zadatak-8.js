const { MongoClient } = require("mongodb");

async function run() {

    const uri = "mongodb://127.0.0.1:27017";
	const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

	try {
		// Connect to the MongoDB cluster
		var connection = await client.connect();

 		await connection.db("projekt").collection("water_treatment").createIndex({ "Q_E": -1, "SED_D": 1, "COND_S": -1});

        const data = await connection.db("projekt").collection("water_treatment").
		find({
				'Q_E': { '$lt' : 40000 },
				'SED_D': { '$gt' : 0.3 },
				'COND_S': { '$lt' : 2600 }
		})
		.sort({
			"Q_E": -1, "SED_D": 1, "COND_S": -1
		}).toArray();
        console.log(data);
    } catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

run().catch(console.error);