const { MongoClient } = require("mongodb");

const headers = ['DT_T', 'Q_E', 'ZN_E', 'PH_E', 'DBO_E', 'DQO_E', 'SS_E', 'SSV_E', 
'SED_E', 'COND_E', 'PH_P', 'DBO_P', 'SS_P', 'SSV_P', 'SED_P', 'COND_P', 'PH_D', 
'DBO_D', 'DQO_D', 'SS_D', 'SSV_D', 'SED_D', 'COND_D', 'PH_S', 'DBO_S', 'DQO_S', 
'SS_S', 'SSV_S', 'SED_S', 'COND_S', 'RD_DBO_P', 'RD_SS_P', 'RD_SED_P', 'RD_DBO_S', 
'RD_DQO_S', 'RD_DBO_G', 'RD_DQO_G', 'RD_SS_G', 'RD_SED_G']

function getQuery(header, field, value) {
    const query = JSON.parse(`[{ "${header}" : { "${field}" : 0 }}, { "$inc": { "${header}.$.${field}": ${value} }}]`);

    return query;
}

async function run() {

    const uri = "mongodb://127.0.0.1:27017";
	const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

	try {
		// Connect to the MongoDB cluster
		var connection = await client.connect();

		const data = await connection.db("projekt").collection("water_treatment").find().toArray();

        var map = new Object();
        for (var i in headers) {
            var header = headers[i];
            var set = new Set();
            map[header] = [];
            for (var j in data) {
                // podatke dodajemo u set kako bi izbjegli duplikate
                set.add(data[j][header]);
            }

            set.forEach(function(obj) {
                var str = String(obj);
                
                // ako u stringu postoji decimalna tocka, zamijeni tocku s donjom crtom kako bi mogli imenovati objekt u mongodb-u
                if (str.includes('.'))
                    str = str.replace('.', "_");

                // svakom elementu u polju pridodajemo frekvenciju ponavljanja 0
                map[header].push({
                    [str]: 0
                });
            })
        }

        await connection.db("projekt").collection("frekvencija_water_treatment").insertMany([map]);

        // update faza
        const freqData = await connection.db("projekt").collection("frekvencija_water_treatment").find().toArray();

        for (var i in headers) {
            var header = headers[i];

            var novamapa = new Map();
            for (var j in data) {
                var val = String(data[j][header])
                if (val.includes("."))
                    val = val.replace(".", "_");

                var arr = freqData[0][header];

                arr.forEach(function(obj) {
                    var fieldName = obj[val];
                    if (fieldName != null) {
                        if (novamapa.has(val)) {
                            var counter = novamapa.get(val);
                            counter++;
                            novamapa.set(val, counter);
                        } else {
                            novamapa.set(val, 1);
                        }
                    }
                })
            }


            for (const [key, value] of novamapa.entries()) {
                var obj = getQuery(header, key, value);
                await connection.db("projekt").collection("frekvencija_water_treatment").updateOne(obj[0], obj[1]);
            }
            
        }
    } catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

run().catch(console.error);

