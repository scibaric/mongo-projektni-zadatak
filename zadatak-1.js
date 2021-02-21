const csv = require('csv-parser');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

function getRows() {
	return new Promise((resolve, reject) => {
		var counter = 0;
		var rows = [];
		fs.createReadStream('cpy.csv')
			// fs.createReadStream('water-treatment.csv')
			.pipe(csv())
			.on('data', (row) => {
				for (var propt in row) {
					if (row[propt] === '?')
						row[propt] = -1;
					else if (propt === 'DT-T')
						continue;
					else
						row[propt] = parseFloat(row[propt]);
				}
				rows[counter++] = row;
			})
			.on('end', () => {
				console.log('CSV file successfully processed');
				resolve(rows);
			})
			.on('error', reject);
	})

}

async function run() {

	const uri = "mongodb://127.0.0.1:27017";
	const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

	var rows = await getRows();

	try {
		// Connect to the MongoDB cluster
		var connection = await client.connect();

		await connection.db("projekt").collection("water_treatment").insertMany(rows);
	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}


run().catch(console.error);