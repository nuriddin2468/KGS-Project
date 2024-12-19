import { Client } from "pg";
import config from "./config";

const client =  new Client({
    connectionString: `postgres://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}/${config.POSTGRES_DB}`
});

client.connect();

export default client;