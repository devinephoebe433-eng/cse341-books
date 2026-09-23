# Part 1 — Books and Authors Specification

## Purpose

The service provides a REST API for managing books and authors. It stores the two resources in separate MongoDB collections and relates each book to one author through `books.authorId`, which references `authors.id`.

## Data model

### Authors collection

Each author document contains the following fields:

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Application-level unique identifier, such as `a1`. |
| `name` | string | Yes | Author's display name. |
| `biography` | string | No | Short author biography. |
| `birthDate` | string | No | ISO date in `YYYY-MM-DD` format. |

### Books collection

Each book document contains the following fields:

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Application-level unique identifier, such as `b1`. |
| `title` | string | Yes | Book title. |
| `authorId` | string | Yes | Reference to an existing `authors.id`. |
| `publicationDate` | string | Yes | ISO date in `YYYY-MM-DD` format. |
| `genre` | string | No | Book genre. |

A book cannot be created or updated with an unknown `authorId`. An author cannot be deleted while a book still references that author. These rules preserve relationship integrity.

## Routes and responses

| Method | Route | Success | Client error | Server error |
|---|---|---:|---|---:|
| GET | `/books` | 200 with an array | — | 500 |
| GET | `/books/:id` | 200 with one book | 404 if missing | 500 |
| POST | `/books` | 201 with created book | 400 invalid body, 404 missing author, 409 duplicate id | 500 |
| PUT | `/books/:id` | 200 with updated book | 400 invalid body, 404 missing book/author | 500 |
| DELETE | `/books/:id` | 204 with no body | 404 if missing | 500 |
| GET | `/authors` | 200 with an array | — | 500 |
| GET | `/authors/:id` | 200 with one author | 404 if missing | 500 |
| POST | `/authors` | 201 with created author | 400 invalid body, 409 duplicate id | 500 |
| PUT | `/authors/:id` | 200 with updated author | 400 invalid body, 404 if missing | 500 |
| DELETE | `/authors/:id` | 204 with no body | 404 if missing, 409 if referenced by books | 500 |

Error responses use the shape `{ "message": "Human-readable explanation" }`. MongoDB's internal `_id` field is not exposed by the API.

## Documentation and testing

Swagger UI is available at `/api-docs`. It documents every route, request body, response code, and resource schema. The local server uses `http://localhost:8080` as the default Swagger server URL. A deployed Render service can set `PUBLIC_BASE_URL` so that the Swagger “Try it out” requests use the deployed URL.

## Acceptance criteria

The assignment is complete when all routes return the status codes in this specification, the seeded books contain valid author references, Swagger loads at `/api-docs`, the application passes linting, and the deployed Render service can be tested through its public Swagger page.

## References

[1]: https://www.mongodb.com/docs/drivers/node/current/ "MongoDB Node.js Driver documentation"
[2]: https://swagger.io/specification/ "OpenAPI Specification"
[3]: https://expressjs.com/en/guide/routing.html "Express routing guide"
