import express from 'express';
import { getDatabase } from './db.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Server is running' });
});

app.get('/books', async (req, res) => {
  try {
    const books = await getDatabase()
      .collection('books')
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve books:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/trails', async (req, res) => {
  try {
    const trails = await getDatabase()
      .collection('trails')
      .find({})
      .toArray();

    return res.status(200).json(trails);
  } catch (error) {
    console.error('Failed to retrieve trails:', error.message);
    return res.status(500).json({ message: 'Failed to retrieve trails' });
  }
});

export default app;
