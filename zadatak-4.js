const { MongoClient } = require("mongodb");

const headers = ['Q-E', 'ZN-E', 'PH-E', 'DBO-E', 'DQO-E', 'SS-E', 'SSV-E', 
'SED-E', 'COND-E', 'PH-P', 'DBO-P', 'SS-P', 'SSV-P', 'SED-P', 'COND-P', 'PH-D', 
'DBO-D', 'DQO-D', 'SS-D', 'SSV-D', 'SED-D', 'COND-D', 'PH-S', 'DBO-S', 'DQO-S', 
'SS-S', 'SSV-S', 'SED-S', 'COND-S', 'RD-DBO-P', 'RD-SS-P', 'RD-SED-P', 'RD-DBO-S', 
'RD-DQO-S', 'RD-DBO-G', 'RD-DQO-G', 'RD-SS-G', 'RD-SED-G']

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
        console.log(smallerThanAvg);
        await connection.db("projekt").collection("statistika1_water_treatment").insertMany([smallerThanAvg]);
        await connection.db("projekt").collection("statistika2_water_treatment").insertMany([biggerThanAvg]);
        console.log(biggerThanAvg);
        console.log("kraj");
	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

run().catch(console.error);