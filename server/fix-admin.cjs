const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const connectionString = process.argv[2];

async function main() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    const hash = bcrypt.hashSync("40237852", 10);
    await client.connect();
    const res = await client.query("UPDATE users SET password = $1 WHERE email = 'admin@wms.com' RETURNING email;", [hash]);
    console.log("Filas actualizadas:", res.rowCount);
    await client.end();
}

main().catch(err => console.error("ERROR:", err.message));
