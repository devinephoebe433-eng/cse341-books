# Part 4 — Reflection

## What changed

The Week 02 implementation expanded the original read-only Books API into a complete service for two related resources. The project now contains separate `authors` and `books` collections. Each book stores an `authorId` that references an author document. The API supports create, read, update, and delete operations for both resources and exposes Swagger UI at `/api-docs`.

## What I learned

The relationship between two collections must be enforced in application code because MongoDB does not automatically provide a relational foreign-key constraint for this design. The API checks that an author exists before a book is created or updated. It also prevents an author from being deleted while books still reference that author. These checks protect the consistency of the data model.

I also learned that a useful Swagger document is part of the API, not just an optional explanation. Defining schemas and response codes made it possible to test successful requests and error cases from the same interface. The specification and issue plan reduced implementation risk because each change had one focused goal and a concrete test plan.

## Testing and quality

The seed command recreates three authors and three books with valid references. The application uses status `200` for successful reads and updates, `201` for creates, `204` for successful deletes, `400` for invalid request bodies, `404` for missing resources, `409` for duplicate ids or blocked author deletion, and `500` for unexpected database errors. ESLint is the repeatable code-quality check. Swagger provides the evidence interface for local and deployed route testing.

## Remaining deployment action

The code and documentation are ready for Render. The remaining account-level work is to configure the Render service, set `MONGODB_URI` and `PUBLIC_BASE_URL`, allow the deployment to connect through MongoDB Atlas Network Access, and record the deployed `/api-docs` URL. The final Canvas submission should include the GitHub repository, Render URL, walkthrough video, and issue or pull-request evidence requested by the course.

## References

[1]: https://www.mongodb.com/docs/manual/data-modeling/ "MongoDB data modeling documentation"
[2]: https://swagger.io/tools/swagger-ui/ "Swagger UI documentation"
