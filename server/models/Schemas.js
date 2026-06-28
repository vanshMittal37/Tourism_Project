import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Customer', 'CRM Executive', 'Admin'], default: 'Customer' },
  passportDetails: {
    passportNumber: { type: String, default: '' },
    nationality: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    expiryDate: { type: String, default: '' }
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    zip: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

const VisaApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantName: { type: String, required: true },
  passportNumber: { type: String, required: true },
  visaType: { type: String, enum: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Business Visa'], required: true },
  destinationCountry: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Documents Pending', 'In Review', 'Approved', 'Rejected'], default: 'Pending' },
  assignedExecutive: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  timeline: [{
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    remarks: { type: String, default: '' }
  }],
  documents: [{
    documentType: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // can be a local upload URL or base64
    uploadDate: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false }
  }],
  notes: [{
    author: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['New', 'Contacted', 'Interested', 'Documents Pending', 'Applied', 'Approved', 'Closed'], default: 'New' },
  assignedExecutive: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  source: { type: String, enum: ['Website Enquiry', 'Phone Call', 'Walk-in', 'Social Media'], default: 'Website Enquiry' },
  notes: { type: String, default: '' },
  followUps: [{
    reminderDate: { type: String, required: true },
    notes: { type: String, default: '' },
    callHistory: { type: String, default: '' },
    dateCreated: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now }
});

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  source: { type: String, default: 'Website' },
  status: { type: String, enum: ['New', 'Contacted', 'Resolved'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
export const VisaApplication = mongoose.model('VisaApplication', VisaApplicationSchema);
export const Lead = mongoose.model('Lead', LeadSchema);
export const Task = mongoose.model('Task', TaskSchema);
export const Enquiry = mongoose.model('Enquiry', EnquirySchema);
