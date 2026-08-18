// run-schema.js
// Ejecuta el archivo schema.sql contra la base de datos indicada.
// Uso: node run-schema.js "postgresql://usuario:password@host/nombre_db"

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const connectionString = process.argv[2];

if (!connectionString) {
  console.error("❌ Falta la connection string.");
  console.error('Uso: node run-schema.js "postgresql://usuario:password@host/db"');
  process.exit(1);
}

const schemaPath = path.join(__dirname, "schema.sql");
const sql = fs.readFileSync(schemaPath, "utf8");

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Render requiere SSL
});

async function main() {
  try {
    await client.connect();
    console.log("✅ Conectado a la base de datos.");
    await client.query(sql);
    console.log("✅ schema.sql ejecutado correctamente.");
  } catch (err) {
    console.error("❌ Error ejecutando schema.sql:");
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();