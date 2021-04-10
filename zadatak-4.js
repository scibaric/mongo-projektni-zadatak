const { MongoClient } = require("mongodb");

const headers = ['Q_E', 'ZN_E', 'PH_E', 'DBO_E', 'DQO_E', 'SS_E', 'SSV_E', 
'SED_E', 'COND_E', 'PH_P', 'DBO_P', 'SS_P', 'SSV_P', 'SED_P', 'COND_P', 'PH_D', 
'DBO_D', 'DQO_D', 'SS_D', 'SSV_D', 'SED_D', 'COND_D', 'PH_S', 'DBO_S', 'DQO_S', 
'SS_S', 'SSV_S', 'SED_S', 'COND_S', 'RD_DBO_P', 'RD_SS_P', 'RD_SED_P', 'RD_DBO_S', 
'RD_DQO_S', 'RD_DBO_G', 'RD_DQO_G', 'RD_SS_G', 'RD_SED_G']

async function run() {

	const uri = "mongodb://127.0.0.1:27017";
	const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

	try {
		// Connect to the MongoDB cluster
		var connection = await client.connect();

		var data = await connection.db("projekt").collection("water_treatment").find().toArray();
        var averages = await connection.db("projekt").collection("statistika_water_treatment").find().toArray();

		var smallerThanAvg = new Object();
        var biggerThanAvg = new Object();

		for (let index in headers) {
            var header = headers[index];
            smallerThanAvg[header] = [];
            biggerThanAvg[header] = [];
            var avg = averages[0][header].average;
            console.log(data[0][header]);
            for (let i in data) {
                let number = data[i][header]
                if (number === -1)
                    continue;

                if (number <= avg)
                    smallerThanAvg[header].push(number);
                else if (number > avg)
                    biggerThanAvg[header].push(number);
            }
        }
        await connection.db("projekt").collection("statistika1_water_treatment").insertMany([smallerThanAvg]);
        await connection.db("projekt").collection("statistika2_water_treatment").insertMany([biggerThanAvg]);
	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

run().catch(console.error);