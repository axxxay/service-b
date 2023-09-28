const express = require("express");
// const cors = require('cors');
const sqlite3 = require("sqlite3")
const {open} = require("sqlite")
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
// app.use(cors());

const dbPath = path.join(__dirname, "UserDetails.db");

let db = null;

const InitializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(5000, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        })
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
}
InitializeDBAndServer();

app.post("/store-in-db", async (request, response) => {
    const {email, age, location, username} = request.body;
    const id = uuidv4();
    
    const statement = await db.prepare(`INSERT INTO user(id, username, email, age, location) VALUES(?, ?, ?, ?, ?);`)
    await statement.run(id, username, email, age, location)
    await statement.finalize();
    // await db.run(`INSERT INTO user(id, username, email, age, location) VALUES('${id}', '${username}', '${email}', ${age}, '${location}');`)
    response.send({id});
});