# Part 3 — Implement the Plan

## Completed implementation

The application now provides a Books and Authors API backed by MongoDB Atlas. Startup connects to the `cse341-books-db` database and verifies the connection with a ping before Express begins listening. The seed script creates three authors and three books, and each book references an existing author through `authorId`.

The service implements complete CRUD behavior for both collections. It validates required request fields, rejects duplicate application ids, returns 404 responses for missing resources, and returns 409 when an author cannot be deleted because books still reference it. MongoDB's internal `_id` field is excluded from API responses.

Swagger UI is available at `/api-docs`. The OpenAPI document defines the Author and Book schemas and describes every route, request body, and response status. This allows the local and deployed APIs to be tested from one interface.

## Verification performed

The seed script clears and recreates both collections with valid relationship data. ESLint is used as the pre-commit quality check. Local route verification covers list, detail, create, update, delete, validation, missing-resource, duplicate-id, and relationship-protection responses.

## Deployment preparation

The repository includes `render.yaml` and README instructions for a Render Web Service. The required production secrets remain environment variables and are not committed to GitHub. The deployment must provide `MONGODB_URI` and `PUBLIC_BASE_URL`, and MongoDB Atlas Network Access must permit the Render service to connect.
