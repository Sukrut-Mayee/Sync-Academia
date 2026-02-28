const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
// (This allows the backend to talk to the database with full permission)
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies

// --- ROUTES ---

// 1. Health Check Route (To see if server is running)
app.get('/', (req, res) => {
  res.send('SyncAcademia Backend is Running! 🚀');
});

// 2. Test API Route (We will expand this later)
app.get('/api/test', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    res.json({ message: "Connection to Firebase Successful", userCount: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const statusRoutes = require('./routes/statusRoutes');
app.use('/api/status', statusRoutes);

//gemini route 
app.use('/api/ai', require('./routes/geminiRoutes'));
// --- START SERVER ---
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api/tasks', require('./routes/taskRoutes'));

// Route to check for scheduling conflicts
app.post('/api/tasks/check-conflict', async (req, res) => {
  const { batchId, date } = req.body;

  try {
    // Look for existing tasks for this batch on the specific date
    const tasksRef = db.collection('tasks');
    const snapshot = await tasksRef
      .where('batchId', '==', batchId)
      .where('dueDate', '==', date)
      .get();

    const existingTaskCount = snapshot.size;
    
    // Calculate Conflict Score (Simple Hackathon Logic)
    // 0 tasks = 0% (Green), 1 task = 50% (Orange), 2+ tasks = 90% (Red)
    let conflictScore = 0;
    if (existingTaskCount === 1) conflictScore = 50;
    if (existingTaskCount >= 2) conflictScore = 90;

    res.json({
      conflictScore,
      status: conflictScore >= 80 ? 'Critical' : 'Safe',
      message: `Found ${existingTaskCount} existing tasks for this date.`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});