import dns from 'node:dns';
import { MongoClient } from 'mongodb';

dns.setServers(['1.1.1.1', '8.8.8.8']);

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'cse341-books-db';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is missing. Add it to your .env file.');
}

const client = new MongoClient(MONGODB_URI);
let database;

export async function connectToDatabase() {
  if (!database) {
    await client.connect();
    database = client.db(DATABASE_NAME);
    await database.command({ ping: 1 });
  }

  return database;
}

export function getDatabase() {
  if (!database) {
    throw new Error('MongoDB has not been connected yet.');
  }

  return database;
}

export { DATABASE_NAME };
