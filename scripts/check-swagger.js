process.env.MONGODB_URI ??= 'mongodb://127.0.0.1:27017/cse341-books-db';

const { swaggerSpec } = await import('../app.js');

const requiredPaths = [
  '/books',
  '/books/{id}',
  '/authors',
  '/authors/{id}'
];

for (const path of requiredPaths) {
  if (!swaggerSpec.paths[path]) {
    throw new Error(`Missing Swagger path: ${path}`);
  }
}

console.log(`Swagger smoke check passed with ${Object.keys(swaggerSpec.paths).length} documented paths.`);
