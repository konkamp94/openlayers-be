const fs = require('fs');
const csvParser = require('csv-parser');
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'openlayers',
  user: 'postgres',
  password: 'postgres',
});
client.connect();

const insertPredefinedLocations = async (location) => {
  const query = `
    INSERT INTO predefined_location(name, coordinates)
    VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326));
  `;
  console.log(location);
  await client.query(query, [location.name, location.lng, location.lat]);
};

const parseCsvAndSaveLocation = () => {
  const result = [];

  fs.createReadStream('./locations.csv')
    .pipe(csvParser())
    .on('data', (data) => {
      result.push({
        name: data.name,
        lng: parseFloat(data.x),
        lat: parseFloat(data.y),
      });
    })
    .on('end', async () => {
      for (let i = 0; i < result.length; i++) {
        await insertPredefinedLocations(result[i]);
      }
      console.log('Predefined Locations Data inserted successfully');
      await client.end();
    });
};

parseCsvAndSaveLocation();
