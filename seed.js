import { connectToDatabase, DATABASE_NAME } from './db.js';

const seedAuthors = [
  {
    id: 'a1',
    name: 'Maya Rivera',
    biography: 'A writer of speculative fiction and literary essays.',
    birthDate: '1985-04-12'
  },
  {
    id: 'a2',
    name: 'Jonas Reed',
    biography: 'An author who writes technology-focused mysteries.',
    birthDate: '1979-11-03'
  },
  {
    id: 'a3',
    name: 'Amina Okafor',
    biography: 'A novelist exploring climate, community, and the future.',
    birthDate: '1990-02-21'
  }
];

const seedBooks = [
  {
    id: 'b1',
    title: 'Patterns of Light',
    authorId: 'a1',
    publicationDate: '2021-08-17',
    genre: 'Science fiction'
  },
  {
    id: 'b2',
    title: 'The Quiet Algorithm',
    authorId: 'a2',
    publicationDate: '2022-03-11',
    genre: 'Mystery'
  },
  {
    id: 'b3',
    title: 'Gardens of Tomorrow',
    authorId: 'a3',
    publicationDate: '2023-06-29',
    genre: 'Climate fiction'
  }
];

const database = await connectToDatabase();

await database.collection('authors').deleteMany({});
await database.collection('books').deleteMany({});
await database.collection('authors').insertMany(seedAuthors);
await database.collection('books').insertMany(seedBooks);

console.log(`Seeded ${seedAuthors.length} authors and ${seedBooks.length} books in ${DATABASE_NAME}`);
process.exit(0);
