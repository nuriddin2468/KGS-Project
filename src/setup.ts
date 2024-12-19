import db from "./db";


// По хорошему нужно вытащить это все в миграцию и сиды
export default (async () => {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS users(
            id serial UNIQUE PRIMARY KEY,
            balance numeric NOT NULL
        )`
        );
        // может пораждать пользователей, но для simplicity оставил так
        await db.query('INSERT INTO users (id, balance) VALUES (1, 1000)');
    } catch {
        console.log('Table already created with user');
    }
});