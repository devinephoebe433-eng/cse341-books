import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { getDatabase } from './db.js';

const app = express();

app.use(express.json());

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CSE 341 Books and Authors API',
    version: '2.0.0',
    description: 'CRUD API for books and their related authors.'
  },
  servers: [
    {
      url: process.env.PUBLIC_BASE_URL || 'http://localhost:8080',
      description: 'Current server'
    }
  ],
  components: {
    schemas: {
      Author: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'string', example: 'a1' },
          name: { type: 'string', example: 'Maya Rivera' },
          biography: { type: 'string', example: 'A writer of speculative fiction.' },
          birthDate: { type: 'string', format: 'date', example: '1985-04-12' }
        }
      },
      Book: {
        type: 'object',
        required: ['id', 'title', 'authorId', 'publicationDate'],
        properties: {
          id: { type: 'string', example: 'b1' },
          title: { type: 'string', example: 'Patterns of Light' },
          authorId: { type: 'string', example: 'a1', description: 'References authors.id.' },
          publicationDate: { type: 'string', format: 'date', example: '2021-08-17' },
          genre: { type: 'string', example: 'Science fiction' }
        }
      },
      Error: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Resource not found' } }
      }
    }
  }
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: ['./app.js']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const collectionName = (resource) => {
  return getDatabase().collection(resource);
};

const requiredFieldsMissing = (body, fields) => {
  return fields.some((field) => {
    return typeof body[field] !== 'string' || body[field].trim() === '';
  });
};

const withoutMongoId = (document) => {
  const { _id, ...safeDocument } = document;
  return safeDocument;
};

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Books and Authors API is running' });
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: List all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Database error
 *   post:
 *     summary: Create a book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Referenced author not found
 *       409:
 *         description: Book id already exists
 */
app.route('/books')
  .get(async (req, res) => {
    try {
      const books = await collectionName('books').find({}).sort({ id: 1 }).toArray();
      return res.status(200).json(books.map(withoutMongoId));
    } catch (error) {
      console.error('Failed to retrieve books:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  })
  .post(async (req, res) => {
    const { id, title, authorId, publicationDate, genre = '' } = req.body;
    if (requiredFieldsMissing(req.body, ['id', 'title', 'authorId', 'publicationDate'])) {
      return res.status(400).json({ message: 'id, title, authorId, and publicationDate are required' });
    }

    try {
      const author = await collectionName('authors').findOne({ id: authorId });
      if (!author) {
        return res.status(404).json({ message: 'Referenced author not found' });
      }

      const existingBook = await collectionName('books').findOne({ id });
      if (existingBook) {
        return res.status(409).json({ message: 'A book with that id already exists' });
      }

      const book = { id, title, authorId, publicationDate, genre };
      await collectionName('books').insertOne(book);
      return res.status(201).json(book);
    } catch (error) {
      console.error('Failed to create book:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get one book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The requested book
 *       404:
 *         description: Book not found
 *   put:
 *     summary: Replace a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Book' }
 *     responses:
 *       200: { description: Book updated }
 *       400: { description: Invalid request }
 *       404: { description: Book or author not found }
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Book deleted }
 *       404: { description: Book not found }
 */
app.route('/books/:id')
  .get(async (req, res) => {
    try {
      const book = await collectionName('books').findOne({ id: req.params.id });
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      return res.status(200).json(withoutMongoId(book));
    } catch (error) {
      console.error('Failed to retrieve book:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  })
  .put(async (req, res) => {
    const { title, authorId, publicationDate, genre = '' } = req.body;
    if (requiredFieldsMissing(req.body, ['title', 'authorId', 'publicationDate'])) {
      return res.status(400).json({ message: 'title, authorId, and publicationDate are required' });
    }

    try {
      const author = await collectionName('authors').findOne({ id: authorId });
      if (!author) {
        return res.status(404).json({ message: 'Referenced author not found' });
      }

      const result = await collectionName('books').findOneAndUpdate(
        { id: req.params.id },
        { $set: { title, authorId, publicationDate, genre } },
        { returnDocument: 'after' }
      );
      if (!result) {
        return res.status(404).json({ message: 'Book not found' });
      }
      return res.status(200).json(withoutMongoId(result));
    } catch (error) {
      console.error('Failed to update book:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await collectionName('books').deleteOne({ id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Book not found' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error('Failed to delete book:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: List all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: A list of authors
 *   post:
 *     summary: Create an author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Author' }
 *     responses:
 *       201: { description: Author created }
 *       400: { description: Invalid request }
 *       409: { description: Author id already exists }
 */
app.route('/authors')
  .get(async (req, res) => {
    try {
      const authors = await collectionName('authors').find({}).sort({ id: 1 }).toArray();
      return res.status(200).json(authors.map(withoutMongoId));
    } catch (error) {
      console.error('Failed to retrieve authors:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  })
  .post(async (req, res) => {
    const { id, name, biography = '', birthDate = '' } = req.body;
    if (requiredFieldsMissing(req.body, ['id', 'name'])) {
      return res.status(400).json({ message: 'id and name are required' });
    }

    try {
      const existingAuthor = await collectionName('authors').findOne({ id });
      if (existingAuthor) {
        return res.status(409).json({ message: 'An author with that id already exists' });
      }

      const author = { id, name, biography, birthDate };
      await collectionName('authors').insertOne(author);
      return res.status(201).json(author);
    } catch (error) {
      console.error('Failed to create author:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get one author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The requested author }
 *       404: { description: Author not found }
 *   put:
 *     summary: Replace an author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Author' }
 *     responses:
 *       200: { description: Author updated }
 *       400: { description: Invalid request }
 *       404: { description: Author not found }
 *   delete:
 *     summary: Delete an author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Author deleted }
 *       404: { description: Author not found }
 */
app.route('/authors/:id')
  .get(async (req, res) => {
    try {
      const author = await collectionName('authors').findOne({ id: req.params.id });
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
      return res.status(200).json(withoutMongoId(author));
    } catch (error) {
      console.error('Failed to retrieve author:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  })
  .put(async (req, res) => {
    const { name, biography = '', birthDate = '' } = req.body;
    if (requiredFieldsMissing(req.body, ['name'])) {
      return res.status(400).json({ message: 'name is required' });
    }

    try {
      const result = await collectionName('authors').findOneAndUpdate(
        { id: req.params.id },
        { $set: { name, biography, birthDate } },
        { returnDocument: 'after' }
      );
      if (!result) {
        return res.status(404).json({ message: 'Author not found' });
      }
      return res.status(200).json(withoutMongoId(result));
    } catch (error) {
      console.error('Failed to update author:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  })
  .delete(async (req, res) => {
    try {
      const author = await collectionName('authors').findOne({ id: req.params.id });
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }

      const booksUsingAuthor = await collectionName('books').countDocuments({ authorId: req.params.id });
      if (booksUsingAuthor > 0) {
        return res.status(409).json({ message: 'Cannot delete an author referenced by books' });
      }

      await collectionName('authors').deleteOne({ id: req.params.id });
      return res.status(204).send();
    } catch (error) {
      console.error('Failed to delete author:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

export default app;
export { swaggerSpec };
