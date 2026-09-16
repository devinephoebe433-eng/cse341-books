import express from "express";
import { MongoClient } from "mongodb";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(mongoUri);

app.use(express.json());

async function startServer() {
  try {
    await client.connect();

    const database = client.db("cse341-books-db");
    await database.command({ ping: 1 });

    console.log("Connected to MongoDB database: cse341-books-db");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

startServer();
