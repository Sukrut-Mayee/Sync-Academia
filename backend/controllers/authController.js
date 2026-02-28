const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Seed Database (Existing)
exports.seedDatabase = async (req, res) => {
  try {
    const users = [
      { uid: 'student_001', email: 'student@test.com', role: 'Student', name: 'Alex Student', batch: 'Class 12-A', status: 'Available' },
      { uid: 'teacher_001', email: 'teacher@test.com', role: 'Teacher', name: 'Prof. Newton', subjects: ['Physics', 'Math'], pendingApprovals: [] },
      { uid: 'admin_001', email: 'admin@test.com', role: 'Admin', name: 'Principal Skinner', schoolId: 'VESIT_01' }
    ];
    const batch = db.batch();
    users.forEach(user => {
      const userRef = db.collection('users').doc(user.email);
      batch.set(userRef, user);
    });
    await batch.commit();
    res.json({ message: "✅ Database seeded!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get Status (Existing)
exports.getUserStatus = async (req, res) => {
  const { email } = req.params;
  try {
    const userDoc = await db.collection('users').doc(email).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
    const userData = userDoc.data();
    res.json({ status: userData.status, statusReason: userData.statusReason });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Update Status (NEW - This fixes your issue)
exports.updateUserStatus = async (req, res) => {
  const { email, status } = req.body;
  try {
    await db.collection('users').doc(email).update({
      status: status,
      statusReason: status === 'Available' ? '' : 'User set status manually'
    });
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};