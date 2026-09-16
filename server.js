import app from './app.js';
import { connectToDatabase, DATABASE_NAME } from './db.js';

const PORT = process.env.PORT || 8080;

try {
  await connectToDatabase();
  console.log(`Connected to MongoDB database: ${DATABASE_NAME}`);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error('MongoDB connection error:', error.message);
  process.exit(1);
}
