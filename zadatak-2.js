const { MongoClient } = require("mongodb");

async function run() {

	const uri = "mongodb://127.0.0.1:27017";
	const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

	try {
		// Connect to the MongoDB cluster
		var connection = await client.connect();

		var data = await connection.db("projekt").collection("water_treatment").find().toArray();

		var headerCounter = 0;
		var map = new Object();
		// find headers of first object, ignore object_id and DT-T
		for (var prop in data[0]) {
			if (headerCounter > 1) {
				var datatype = "$" + prop;

				await connection.db("projekt").collection("water_treatment").aggregate(getQuery(datatype))
					.forEach(function (obj) {
						map[prop] = { average: obj.average, stdDev: obj.stdDev, noMissing: obj.noMissing };
					})
			}

			headerCounter++;
		}

		await connection.db("projekt").collection("statistika_water_treatment").insertMany([map]);
		console.log(map);
	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

function getQuery(data) {
	var query = [
		{
			'$project': {
				'valueToAvg': {
					'$cond': {
						'if': {
							'$eq': [
								data, -1
							]
						},
						'then': null,
						'else': data
					}
				},
				'countNoMissing': {
					'$cond': [
						{
							'$gt': [
								data, -1
							]
						}, 1, 0
					]
				}
			}
		}, {
			'$group': {
				'_id': null,
				'average': {
					'$avg': '$valueToAvg'
				},
				'stdDev': {
					'$stdDevPop': '$valueToAvg'
				},
				'noMissing': {
					'$sum': '$countNoMissing'
				}
			}
		}, {
			'$project': {
				'average': {
					'$round': [
						'$average', 2
					]
				},
				'stdDev': {
					'$round': [
						'$stdDev', 2
					]
				},
				'noMissing': {
					'$sum': '$noMissing'
				}
			}
		}
	];

	return query;
}


run().catch(console.error);