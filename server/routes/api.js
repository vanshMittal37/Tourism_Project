import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, VisaApplication, Lead, Task, Enquiry } from '../models/Schemas.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tourism_secret_key';

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ---

// Register
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'Customer'
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        passportDetails: user.passportDetails,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get/Update profile
router.put('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, passportDetails, address } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (passportDetails) user.passportDetails = { ...user.passportDetails, ...passportDetails };
    if (address) user.address = { ...user.address, ...address };

    await user.save();
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        passportDetails: user.passportDetails,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get staff list (Executives/Admins) for assignment
router.get('/auth/staff', authenticateToken, async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['CRM Executive', 'Admin'] } }).select('name role email');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- VISA APPLICATIONS ---

// Apply for Visa
router.post('/visa/apply', authenticateToken, async (req, res) => {
  try {
    const { applicantName, passportNumber, visaType, destinationCountry } = req.body;
    const newApp = new VisaApplication({
      userId: req.user.id,
      applicantName,
      passportNumber,
      visaType,
      destinationCountry,
      timeline: [{ status: 'Pending', remarks: 'Application submitted successfully.' }]
    });
    await newApp.save();
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all applications (Admin/CRM view)
router.get('/visa/list', authenticateToken, async (req, res) => {
  try {
    const apps = await VisaApplication.find().populate('userId', 'name email phone').populate('assignedExecutive', 'name email');
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer applications
router.get('/visa/my-applications', authenticateToken, async (req, res) => {
  try {
    const apps = await VisaApplication.find({ userId: req.user.id }).populate('assignedExecutive', 'name email');
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Application (Status/Timeline/Executive Assignment)
router.put('/visa/:id', authenticateToken, async (req, res) => {
  try {
    const { status, remarks, assignedExecutive } = req.body;
    const app = await VisaApplication.findById(req.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    if (assignedExecutive !== undefined) app.assignedExecutive = assignedExecutive;
    if (status) {
      app.status = status;
      app.timeline.push({ status, remarks: remarks || `Status updated to ${status}` });
    }

    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload document
router.post('/visa/:id/document', authenticateToken, async (req, res) => {
  try {
    const { documentType, fileName, fileUrl } = req.body;
    const app = await VisaApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.documents.push({ documentType, fileName, fileUrl });
    app.timeline.push({ status: app.status, remarks: `Document ${documentType} uploaded.` });
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify document
router.put('/visa/:id/document/:docId', authenticateToken, async (req, res) => {
  try {
    const { isVerified } = req.body;
    const app = await VisaApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const doc = app.documents.id(req.params.docId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    doc.isVerified = isVerified;
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete document
router.delete('/visa/:id/document/:docId', authenticateToken, async (req, res) => {
  try {
    const app = await VisaApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.documents.pull({ _id: req.params.docId });
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Note
router.post('/visa/:id/notes', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const app = await VisaApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const author = await User.findById(req.user.id);
    app.notes.push({ author: author.name, content });
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- CRM LEADS ---

// Get all leads
router.get('/leads', authenticateToken, async (req, res) => {
  try {
    const leads = await Lead.find().populate('assignedExecutive', 'name email');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add lead
router.post('/leads', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, priority, status, assignedExecutive, source, notes } = req.body;
    const newLead = new Lead({
      name, email, phone, priority, status, assignedExecutive, source, notes
    });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lead
router.put('/leads/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, priority, status, assignedExecutive, source, notes } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (name) lead.name = name;
    if (email) lead.email = email;
    if (phone) lead.phone = phone;
    if (priority) lead.priority = priority;
    if (status) lead.status = status;
    if (assignedExecutive !== undefined) lead.assignedExecutive = assignedExecutive;
    if (source) lead.source = source;
    if (notes !== undefined) lead.notes = notes;

    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add lead follow-up
router.post('/leads/:id/followup', authenticateToken, async (req, res) => {
  try {
    const { reminderDate, notes, callHistory } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.followUps.push({ reminderDate, notes, callHistory });
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete lead
router.delete('/leads/:id', authenticateToken, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- ENQUIRIES ---

// Submit website enquiry
router.post('/enquiries', async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body;
    const newEnq = new Enquiry({ name, email, phone, message, source });
    await newEnq.save();
    res.status(201).json(newEnq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all enquiries
router.get('/enquiries', authenticateToken, async (req, res) => {
  try {
    const enqs = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update enquiry status
router.put('/enquiries/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const enq = await Enquiry.findById(req.params.id);
    if (!enq) return res.status(404).json({ message: 'Enquiry not found' });

    enq.status = status;
    await enq.save();
    res.json(enq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- TASKS ---

// Get all tasks
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add task
router.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority, status } = req.body;
    const newTask = new Task({ title, description, assignedTo, dueDate, priority, status });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task status
router.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
