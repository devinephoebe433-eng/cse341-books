import { connectToDatabase, DATABASE_NAME } from './db.js';

const seedBooks = [
  {
    id: 'b1',
    author: 'Maya Rivera',
    title: 'Patterns of Light',
    publicationDate: '2021-08-17'
  },
  {
    id: 'b2',
    author: 'Jonas Reed',
    title: 'The Quiet Algorithm',
    publicationDate: '2022-03-11'
  },
  {
    id: 'b3',
    author: 'Amina Okafor',
    title: 'Gardens of Tomorrow',
    publicationDate: '2023-06-29'
  }
];

const database = await connectToDatabase();
const books = database.collection('books');

await books.deleteMany({});
await books.insertMany(seedBooks);

console.log(`Seeded ${seedBooks.length} books in ${DATABASE_NAME}.books`);
process.exit(0);
