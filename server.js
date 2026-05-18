import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
// Limit size for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const letterSchema = new mongoose.Schema({
  to: String,
  from: String,
  content: String,
  images: [String],
  ytLink: String,
  createdAt: { type: Date, default: Date.now }
});

const Letter = mongoose.model('Letter', letterSchema);

app.post('/api/letters', async (req, res) => {
  try {
    const letter = new Letter(req.body);
    await letter.save();
    res.status(201).json({ id: letter._id });
  } catch (error) {
    console.error('Error saving letter:', error);
    res.status(500).json({ error: 'Failed to save letter' });
  }
});

app.get('/api/letters/:id', async (req, res) => {
  try {
    const letter = await Letter.findById(req.req.params ? req.params.id : req.path.split('/').pop());
    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }
    res.json(letter);
  } catch (error) {
    console.error('Error fetching letter:', error);
    res.status(500).json({ error: 'Failed to fetch letter' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
