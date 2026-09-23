# CSE 341 Books and Authors API

A Node.js and Express web service backed by MongoDB Atlas. The Week 02 implementation manages related `books` and `authors` collections and documents the API with Swagger.

## Local setup in VS Code

Open the repository folder in VS Code, then open **Terminal > New Terminal**. Run:

```bash
npm install
cp .env.example .env
```

Edit `.env` and replace the placeholder MongoDB connection string with your MongoDB Atlas connection string. The `.env` file is ignored by Git and must not be committed.

Seed the local database:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

Open [http://localhost:8080/api-docs](http://localhost:8080/api-docs) to test the routes in Swagger. The server connects to MongoDB before it begins listening.

## Environment variables

| Variable | Required | Purpose |
|---|---:|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string. |
| `PORT` | No | Port number. Defaults to `8080` locally and uses Render's port in production. |
| `PUBLIC_BASE_URL` | No | Base URL displayed by Swagger. Set this to the Render URL after deployment. |

## API routes

The API provides CRUD routes for both resources:

- `GET`, `POST` `/books`
- `GET`, `PUT`, `DELETE` `/books/:id`
- `GET`, `POST` `/authors`
- `GET`, `PUT`, `DELETE` `/authors/:id`
- `GET` `/api-docs`

Books reference authors through `authorId`. A book cannot use a missing author, and an author cannot be deleted while a book references that author.

Example command-line checks:

```bash
curl http://localhost:8080/books
curl http://localhost:8080/authors/a1
curl -i http://localhost:8080/books/missing
```

## Verification

Run the project checks before committing or opening a pull request:

```bash
npm run lint
npm run check:swagger
npm test
```

## Render deployment

Create a Render Web Service connected to this GitHub repository. Use the following settings:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variable:** `MONGODB_URI` set to the MongoDB Atlas connection string
- **Environment variable:** `PUBLIC_BASE_URL` set to the final Render service URL
- **Environment variable:** `PORT` may be omitted because Render supplies it automatically

MongoDB Atlas Network Access must allow the Render deployment to connect. After deployment, verify `https://YOUR-RENDER-URL/api-docs` and record the public URL for Canvas.

## Assignment evidence

- Part 1 specification: [`docs/PART1_SPECIFICATION.md`](docs/PART1_SPECIFICATION.md)
- Part 2 plan and test plans: [`docs/PART2_PLAN.md`](docs/PART2_PLAN.md)
- Part 3 implementation notes: [`docs/PART3_IMPLEMENTATION.md`](docs/PART3_IMPLEMENTATION.md)
- Part 4 reflection: [`docs/PART4_REFLECTION.md`](docs/PART4_REFLECTION.md)
