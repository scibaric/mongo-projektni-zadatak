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

        await connection.db("projekt").collection("water_treatment").find().forEach(
            (doc) => {
                connection.db("projekt").collection("emb_water_treatment").insertOne(doc);
            }
        );

		var freqData = await connection.db("projekt").collection("frekvencija_water_treatment").find().toArray();
		
		await connection.db("projekt").collection("emb_water_treatment").find().forEach(
			(doc) => {
				connection.db("projekt").collection("emb_water_treatment").updateOne(
					{ 
						'_id' : doc._id 
					}, 
					{ 
						'$set': { 
							'freqData': freqData 
						}
					}
				);
			}
		)

    } catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

run().catch(console.error);