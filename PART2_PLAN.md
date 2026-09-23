# Part 2 — Implementation Plan

The work is divided into small issues so each change can be implemented, reviewed, and tested independently. Each issue should be created in GitHub with the matching test plan.

## Issue 1 — Add the authors collection and relationship seed data

**Goal:** Add the authors data model and update the seed script so each book references an author through `authorId`.

**Implementation:** Add three author documents, replace the denormalized book author name with `authorId`, and clear and reseed both collections.

**Test plan:** Run `npm run seed`. Confirm that `authors` contains three documents, `books` contains three documents, and every `books.authorId` matches an existing `authors.id`.

**Branch:** `feature/authors-data-model`

## Issue 2 — Implement author CRUD routes

**Goal:** Add complete CRUD behavior for `/authors` and `/authors/:id`.

**Implementation:** Add list, detail, create, replace, and delete routes. Validate required fields, reject duplicate ids, return 404 for missing resources, and prevent deletion when books still reference the author.

**Test plan:** Through Swagger, verify 200 for list/detail, 201 for create, 200 for update, 204 for delete, 400 for an invalid body, 404 for an unknown id, 409 for a duplicate id, and 409 when deleting a referenced author.

**Branch:** `feature/authors-crud`

## Issue 3 — Implement complete book CRUD routes

**Goal:** Extend the existing read-only Books API to support create, replace, and delete operations.

**Implementation:** Add validation, duplicate-id protection, author-reference validation, and the status codes in the specification.

**Test plan:** Through Swagger, verify 200 for list/detail, 201 for create, 200 for update, 204 for delete, 400 for an invalid body, 404 for an unknown id or author, and 409 for a duplicate id.

**Branch:** `feature/books-crud`

## Issue 4 — Add Swagger documentation

**Goal:** Make every route testable from `/api-docs`.

**Implementation:** Add `swagger-jsdoc` and `swagger-ui-express`, define the OpenAPI schemas, document all routes, and configure the server URL.

**Test plan:** Start the API with `npm start`, open `http://localhost:8080/api-docs`, confirm that all ten endpoints appear, and execute at least one successful and one error response from Swagger.

**Branch:** `feature/swagger-documentation`

## Issue 5 — Deploy and verify on Render

**Goal:** Deploy the finished API and verify the public service.

**Implementation:** Configure the Render service with `npm install`, `npm start`, `MONGODB_URI`, and `PUBLIC_BASE_URL`. Configure MongoDB Atlas network access for the deployment.

**Test plan:** Open the deployed `/api-docs` page. Execute GET, POST, PUT, and DELETE requests against both resources. Record the deployed URL and evidence in the final reflection.

**Branch:** `feature/render-deployment`

## Git workflow

For each issue, create a branch from `main`, make one focused change, run `npm run lint`, commit the change, push the branch, and open a pull request. The pull request description should include the issue number, summary, and the completed test plan. Merge the pull request only after the tests pass.

## References

[1]: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue "GitHub issue documentation"
[2]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests "GitHub pull request documentation"
