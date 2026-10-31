import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then listen
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Maison Étoile API Server] running on http://localhost:${PORT}`);
  });
});
