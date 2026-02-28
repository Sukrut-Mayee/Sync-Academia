const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Request Busy Mode (Unchanged)
exports.requestBusyMode = async (req, res) => {
  const { studentEmail, reason, teacherEmail, supervisorId } = req.body;
  try {
    await db.collection('users').doc(studentEmail).update({
      status: 'Pending Approval',
      statusReason: reason
    });
    
    // Add to teacher's list
    await db.collection('users').doc(teacherEmail).update({
      pendingApprovals: admin.firestore.FieldValue.arrayUnion({
        studentEmail,
        reason,
        studentName: "Alex Student", // In real app, fetch name
        timestamp: new Date().toISOString()
      })
    });
    res.json({ message: "Request sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Approve Request (UPDATED: Removes notification)
exports.approveRequest = async (req, res) => {
  const { teacherEmail, studentEmail } = req.body;
  try {
    // A. Update Student
    await db.collection('users').doc(studentEmail).update({
      status: 'BUSY - VIVA',
      statusColor: 'orange'
    });

    // B. Remove from Teacher's List
    // We need to read the current list, filter it, and save it back
    const teacherRef = db.collection('users').doc(teacherEmail);
    const doc = await teacherRef.get();
    if (doc.exists) {
      const currentList = doc.data().pendingApprovals || [];
      // Remove the request for this specific student
      const newList = currentList.filter(req => req.studentEmail !== studentEmail);
      await teacherRef.update({ pendingApprovals: newList });
    }
    
    res.json({ message: "Approved and removed from list." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Reject Request (NEW)
exports.rejectRequest = async (req, res) => {
  const { teacherEmail, studentEmail } = req.body;
  try {
    // A. Set Student back to Available
    await db.collection('users').doc(studentEmail).update({
      status: 'Available',
      statusColor: 'green'
    });

    // B. Remove from Teacher's List
    const teacherRef = db.collection('users').doc(teacherEmail);
    const doc = await teacherRef.get();
    if (doc.exists) {
      const currentList = doc.data().pendingApprovals || [];
      const newList = currentList.filter(req => req.studentEmail !== studentEmail);
      await teacherRef.update({ pendingApprovals: newList });
    }

    res.json({ message: "Request rejected." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get Notifications
exports.getNotifications = async (req, res) => {
  const { teacherEmail } = req.query;
  try {
    const doc = await db.collection('users').doc(teacherEmail).get();
    if (!doc.exists) return res.json([]);
    res.json(doc.data().pendingApprovals || []); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};