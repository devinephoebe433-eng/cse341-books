# CSE 341 Books API

A Node.js and Express web service backed by MongoDB Atlas for the CSE 341 Web Services assignment.

## Local setup

Install dependencies:

```bash
npm install
```

Create a `.env` file from `.env.example` and provide the MongoDB Atlas connection string. The application uses the `cse341-books-db` database and never commits `.env`.

Seed the required sample documents:

```bash
npm run seed
```

Start the server:

```bash
npm start
```

The server connects to MongoDB before listening on port `8080` by default.

## API endpoints

| Method | Path | Success | Not found | Response |
|---|---|---:|---:|---|
| GET | `/books` | 200 | — | JSON array of books |
| GET | `/books/:id` | 200 | 404 | One book, or `{ "message": "Book not found" }` |

Unexpected database failures return status `500` with `{ "message": "Internal server error" }`.

Example local checks:

```bash
curl http://localhost:8080/books
curl http://localhost:8080/books/b1
curl -i http://localhost:8080/books/missing
```

## Render deployment

Create a Render Web Service connected to this GitHub repository. Use these settings:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variable:** `MONGODB_URI` set to the MongoDB Atlas connection string, including `cse341-books-db` as the database name
- **Environment variable:** `PORT` may be omitted because Render supplies it automatically

Before deploying, add the Render service's outbound IP access as allowed in MongoDB Atlas Network Access, or use the appropriate Atlas network configuration for the service.
