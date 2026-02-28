const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config();

// ===== Firebase Setup =====
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is missing in environment variables");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ===== Express App =====
const app = express();

// ===== CORS CONFIG (IMPORTANT) =====
const allowedOrigins = [
  "http://localhost:3000",   // Next.js dev
  "http://localhost:3001",   // If using another port
  "https://sync-academia.vercel.app" // Replace later with your real Vercel URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ===== Health Check =====
app.get('/', (req, res) => {
  res.send('SyncAcademia Backend is Running! 🚀');
});

// ===== Test Route =====
app.get('/api/test', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());

    res.json({
      message: "Connection to Firebase Successful",
      userCount: users.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Routes =====
app.use('/api/status', require('./routes/statusRoutes'));
app.use('/api/ai', require('./routes/geminiRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// ===== Conflict Check Route =====
app.post('/api/tasks/check-conflict', async (req, res) => {
  const { batchId, date } = req.body;

  try {
    const tasksRef = db.collection('tasks');
    const snapshot = await tasksRef
      .where('batchId', '==', batchId)
      .where('dueDate', '==', date)
      .get();

    const existingTaskCount = snapshot.size;

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

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});