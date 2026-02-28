const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Check for Conflicts
exports.checkConflict = async (req, res) => {
  try {
    const { batch, date } = req.body;

    if (!batch || !date) {
      return res.status(400).json({ error: "Batch and Date are required" });
    }

    console.log(`Checking conflict for ${batch} on ${date}...`);

    // Query: Count how many tasks this batch already has on this date
    const tasksSnapshot = await db.collection('tasks')
      .where('batch', '==', batch)
      .where('dueDate', '==', date)
      .get();

    const taskCount = tasksSnapshot.size;
    
    // Algorithm: Calculate "Heat" based on count
    let score = 0;
    let status = 'Safe'; // Green

    if (taskCount === 0) {
      score = 10;  // Green (Safe)
    } else if (taskCount === 1) {
      score = 50;  // Orange (Moderate)
      status = 'Moderate';
    } else if (taskCount >= 2) {
      score = 90;  // Red (Critical)
      status = 'Critical';
    }

    res.json({
      score: score,
      status: status,
      existingTasks: taskCount,
      message: taskCount > 0 
        ? `Warning: ${taskCount} tasks already scheduled.` 
        : "No conflicts found."
    });

  } catch (error) {
    console.error("Conflict Check Error:", error);
    res.status(500).json({ error: "Failed to check conflicts" });
  }
};

// 2. Create New Task (To save it to DB so next check sees it)
exports.createTask = async (req, res) => {
  try {
    const { title, batch, dueDate } = req.body;
    
    await db.collection('tasks').add({
      title,
      batch,
      dueDate, // Format: YYYY-MM-DD
      createdAt: new Date().toISOString()
    });

    res.json({ message: "Task created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get All Tasks (For Teacher View)
exports.getTasks = async (req, res) => {
  try {
    const snapshot = await db.collection('tasks').orderBy('createdAt', 'desc').get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};