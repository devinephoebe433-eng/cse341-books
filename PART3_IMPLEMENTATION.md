# Part 3 — Implement the Plan

## Completed implementation

The application now uses MongoDB Atlas through the official MongoDB Node.js driver. Startup connects to the `cse341-books-db` database and verifies the connection with a ping before Express begins listening. The `seed.js` script creates the `books` collection contents required by the specification.

The database contains three seed documents. Each document has the required string fields `id`, `author`, and `title`, plus an ISO 8601 `publicationDate` string.

The service implements `GET /books` and returns the complete collection as a JSON array with status `200`. It also implements `GET /books/:id`, returning the matching book with status `200`, a safe `404` response when the id does not exist, and a safe `500` response for unexpected failures. MongoDB's internal `_id` field is excluded from API responses.

## Verification performed

The project passes ESLint. The seed command completed successfully with three documents inserted into `cse341-books-db.books`. A local request to `GET /books` returned all three seeded books. The server also successfully connected to MongoDB before listening on port `8080`.

## Deployment preparation

The repository includes `render.yaml` and README instructions for a Render Web Service. The required production secret is represented by the `MONGODB_URI` environment variable and is not committed to GitHub. A public Render URL remains to be recorded after the service is created and tested.
