const { MongoClient } = require("mongodb");

const headers = ['Q_E', 'ZN_E', 'PH_E', 'DBO_E', 'DQO_E', 'SS_E', 'SSV_E', 
'SED_E', 'COND_E', 'PH_P', 'DBO_P', 'SS_P', 'SSV_P', 'SED_P', 'COND_P', 'PH_D', 
'DBO_D', 'DQO_D', 'SS_D', 'SSV_D', 'SED_D', 'COND_D', 'PH_S', 'DBO_S', 'DQO_S', 
'SS_S', 'SSV_S', 'SED_S', 'COND_S', 'RD_DBO_P', 'RD_SS_P', 'RD_SED_P', 'RD_DBO_S', 
'RD_DQO_S', 'RD_DBO_G', 'RD_DQO_G', 'RD_SS_G', 'RD_SED_G'];

async function run() {

	const uri = "mongodb://127.0.0.1:27017";
	const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

	try {
		// Connect to the MongoDB cluster
		var connection = await client.connect();

		var statData = await connection.db("projekt").collection("statistika_water_treatment").find().toArray();

        var waterTreatmentData = await connection.db("projekt").collection("water_treatment").find().toArray();

		for (var i in waterTreatmentData) {
			var object = new Map();
			var doc = waterTreatmentData[i];
			for (var i in headers) {
				var header = headers[i];
				// koristi se index 0 jer je poznato da kolekcija statistika_water_treatment
				// ima samo jedan element
				var obj = statData[0][header];
				var val = doc[header];
				object.set(header, {val: val, average: obj.average, stdDev: obj.stdDev, noMissing: obj.noMissing });
			}
			
			await connection.db("projekt").collection("emb2_water_treatment").insertOne(object);
		};

    } catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

run().catch(console.error);