import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  passcode: String,
  createdAt: { type: Date, default: Date.now },
  openedAt: { type: Date },
  creatorToken: String,
  receiverOpenedAt: { type: Date },
  openHistory: [{
    timestamp: Date,
    isCreator: Boolean
  }]
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
    const { creatorToken } = req.query;
    const letter = await Letter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }
    
    const isCreator = letter.creatorToken && letter.creatorToken === creatorToken;
    const responseData = letter.toObject();
    
    // Remove sensitive data if not creator
    if (!isCreator) {
      delete responseData.creatorToken;
      delete responseData.receiverOpenedAt;
      delete responseData.openHistory;
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching letter:', error);
    res.status(500).json({ error: 'Failed to fetch letter' });
  }
});

app.put('/api/letters/:id', async (req, res) => {
  try {
    const { creatorToken } = req.body;
    const letter = await Letter.findById(req.params.id);
    if (!letter) return res.status(404).json({ error: 'Letter not found' });
    
    // Optional: verify creatorToken here to prevent unauthorized edits
    if (letter.creatorToken && letter.creatorToken !== creatorToken) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedLetter = await Letter.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({ id: updatedLetter._id });
  } catch (error) {
    console.error('Error updating letter:', error);
    res.status(500).json({ error: 'Failed to update letter' });
  }
});

app.patch('/api/letters/:id/open', async (req, res) => {
  try {
    const { creatorToken } = req.body || {};
    const letter = await Letter.findById(req.params.id);
    
    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }
    
    letter.openedAt = new Date();
    const isCreatorOpen = (letter.creatorToken && creatorToken === letter.creatorToken) || false;
    
    // If someone else opened it, record it as receiver opened
    if (!isCreatorOpen) {
      letter.receiverOpenedAt = new Date();
    }
    
    letter.openHistory.push({
      timestamp: new Date(),
      isCreator: isCreatorOpen
    });
    
    // Keep only last 5
    if (letter.openHistory.length > 5) {
      letter.openHistory = letter.openHistory.slice(-5);
    }
    
    await letter.save();
    
    const responseData = { openedAt: letter.openedAt };
    if (isCreatorOpen) {
      responseData.receiverOpenedAt = letter.receiverOpenedAt;
      responseData.openHistory = letter.openHistory;
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Error updating letter:', error);
    res.status(500).json({ error: 'Failed to update letter' });
  }
});

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
