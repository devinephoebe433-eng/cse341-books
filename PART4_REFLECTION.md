# Part 4 — Reflection

## What changed

This assignment produced a complete books web service backed by MongoDB Atlas. The project now has a defined database connection, repeatable seed data, two read-only API endpoints, startup validation, and documented deployment settings. The API returns predictable JSON responses for successful requests, missing books, and unexpected server failures.

## What I learned

The planning process made the implementation easier because each issue had one focused deliverable and a concrete test plan. The database connection had to be completed before route work could be tested, and the simpler collection route provided a useful foundation for the id-based route.

I also learned that successful DNS resolution in a command-line tool does not always mean that Node.js will resolve MongoDB SRV records through the same resolver. Configuring reliable DNS servers in the application removed that environment-specific connection failure. Another important lesson was that the server must not report that it is running until the database connection has been verified.

## Testing and quality

The application passed lint validation. The seed script inserted three valid documents. Local testing confirmed that `GET /books` returns an array with status `200`. The id route was implemented to return status `200` for an existing book, status `404` with `{ "message": "Book not found" }` for an unknown id, and status `500` with `{ "message": "Internal server error" }` for unexpected failures.

## Remaining deployment action

The code is deployment-ready, but the final public URL must be recorded after creating the Render service and adding the production `MONGODB_URI` environment variable. MongoDB Atlas Network Access must also permit the deployment environment. These are external account steps and cannot be verified from the repository alone.
