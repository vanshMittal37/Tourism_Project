import React, { createContext, useContext, useState, useEffect } from 'react';

const DatabaseContext = createContext();

// Mock Initial Data helper
const getInitialData = (key, fallback) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

// Seed Mock Data if empty
const seedData = () => {
  // 1. Initial Users
  const defaultUsers = [
    {
      id: "u-admin",
      name: "Sarah Jenkins",
      email: "admin@travel.com",
      phone: "+1 555-0199",
      password: "admin123",
      role: "Admin"
    },
    {
      id: "u-exec",
      name: "Marcus Aurelius",
      email: "executive@travel.com",
      phone: "+1 555-0144",
      password: "exec123",
      role: "CRM Executive"
    },
    {
      id: "u-cust",
      name: "John Doe",
      email: "customer@travel.com",
      phone: "+1 555-0123",
      password: "cust123",
      role: "Customer",
      passportDetails: {
        passportNumber: "A12345678",
        nationality: "United States",
        issueDate: "2022-04-12",
        expiryDate: "2032-04-11"
      },
      address: {
        street: "128 Elm Street",
        city: "Boston",
        state: "MA",
        country: "USA",
        zip: "02108"
      }
    },
    {
      id: "u-cust2",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 9876543210",
      password: "password123",
      role: "Customer",
      passportDetails: {
        passportNumber: "Z9876543",
        nationality: "India",
        issueDate: "2020-01-15",
        expiryDate: "2030-01-14"
      },
      address: {
        street: "Sector 15, Vashi",
        city: "Navi Mumbai",
        state: "Maharashtra",
        country: "India",
        zip: "400703"
      }
    }
  ];

  if (!localStorage.getItem('visa_users')) {
    localStorage.setItem('visa_users', JSON.stringify(defaultUsers));
  }

  // 2. Initial Visa Applications
  const defaultApplications = [
    {
      id: "app-1",
      userId: "u-cust",
      applicantName: "John Doe",
      passportNumber: "A12345678",
      visaType: "Tourist Visa",
      destinationCountry: "Switzerland",
      status: "In Review",
      assignedExecutive: "u-exec",
      timeline: [
        { status: "Pending", remarks: "Application initiated by customer.", date: "2026-06-20T10:30:00.000Z" },
        { status: "In Review", remarks: "Application assigned to Marcus Aurelius. Under vetting.", date: "2026-06-21T14:15:00.000Z" }
      ],
      documents: [
        { id: "doc-1-1", documentType: "Passport", fileName: "passport_john_doe.jpg", fileUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80", uploadDate: "2026-06-20T10:32:00.000Z", isVerified: true },
        { id: "doc-1-2", documentType: "Photograph", fileName: "photo_john.jpg", fileUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", uploadDate: "2026-06-20T10:32:00.000Z", isVerified: true },
        { id: "doc-1-3", documentType: "Bank Statement", fileName: "bank_statement_jun.pdf", fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=300&q=80", uploadDate: "2026-06-20T10:35:00.000Z", isVerified: false }
      ],
      notes: [
        { author: "Marcus Aurelius", content: "Customer uploaded Passport and Photograph. Reviewing financial proofs.", date: "2026-06-21T14:20:00.000Z" }
      ],
      createdAt: "2026-06-20T10:30:00.000Z"
    },
    {
      id: "app-2",
      userId: "u-cust2",
      applicantName: "Priya Sharma",
      passportNumber: "Z9876543",
      visaType: "Student Visa",
      destinationCountry: "Germany",
      status: "Approved",
      assignedExecutive: "u-exec",
      timeline: [
        { status: "Pending", remarks: "Application submitted.", date: "2026-06-10T09:00:00.000Z" },
        { status: "Documents Pending", remarks: "Requested university acceptance offer letter.", date: "2026-06-11T11:00:00.000Z" },
        { status: "In Review", remarks: "Document uploaded, resuming review.", date: "2026-06-12T15:30:00.000Z" },
        { status: "Approved", remarks: "Visa approved! Document kit sent.", date: "2026-06-15T12:00:00.000Z" }
      ],
      documents: [
        { id: "doc-2-1", documentType: "Passport", fileName: "priya_passport.pdf", fileUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80", uploadDate: "2026-06-10T09:05:00.000Z", isVerified: true },
        { id: "doc-2-2", documentType: "Offer Letter", fileName: "german_uni_admission.pdf", fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=300&q=80", uploadDate: "2026-06-12T15:20:00.000Z", isVerified: true }
      ],
      notes: [
        { author: "Marcus Aurelius", content: "German academic block account verified. High chance of approval.", date: "2026-06-14T10:00:00.000Z" }
      ],
      createdAt: "2026-06-10T09:00:00.000Z"
    }
  ];

  if (!localStorage.getItem('visa_applications')) {
    localStorage.setItem('visa_applications', JSON.stringify(defaultApplications));
  }

  // 3. Initial Leads
  const defaultLeads = [
    {
      id: "lead-1",
      name: "David Miller",
      email: "david.miller@gmail.com",
      phone: "+1 555-9821",
      priority: "High",
      status: "Interested",
      assignedExecutive: "u-exec",
      source: "Website Enquiry",
      notes: "Wants to travel to Japan for a cherry blossom tourist package. Budget is flexible.",
      followUps: [
        { reminderDate: "2026-06-29", notes: "Call to discuss visa requirement details for Japan.", callHistory: "Spoke on phone, is very eager.", dateCreated: "2026-06-27T08:00:00.000Z" }
      ],
      createdAt: "2026-06-26T11:20:00.000Z"
    },
    {
      id: "lead-2",
      name: "Emily Watson",
      email: "emily.watson@yahoo.com",
      phone: "+1 555-8732",
      priority: "Medium",
      status: "New",
      assignedExecutive: "u-exec",
      source: "Social Media",
      notes: "Enquired about business visa services for France.",
      followUps: [],
      createdAt: "2026-06-28T05:40:00.000Z"
    },
    {
      id: "lead-3",
      name: "Rajesh Kumar",
      email: "rajesh.k@gmail.com",
      phone: "+91 9988776655",
      priority: "Low",
      status: "Contacted",
      assignedExecutive: null,
      source: "Phone Call",
      notes: "Inquired about student visa options for Canada.",
      followUps: [
        { reminderDate: "2026-07-02", notes: "Follow up once he arranges his IELTS scorecard.", callHistory: "Arranging documents.", dateCreated: "2026-06-25T14:00:00.000Z" }
      ],
      createdAt: "2026-06-24T10:15:00.000Z"
    }
  ];

  if (!localStorage.getItem('visa_leads')) {
    localStorage.setItem('visa_leads', JSON.stringify(defaultLeads));
  }

  // 4. Initial Enquiries
  const defaultEnquiries = [
    {
      id: "enq-1",
      name: "Aisha Rahaman",
      email: "aisha.r@gmail.com",
      phone: "+971 50 123 4567",
      message: "Hello, I want to book a holiday package to Maldives for my family of four. Need custom itineraries.",
      source: "Website",
      status: "New",
      createdAt: "2026-06-27T18:30:00.000Z"
    },
    {
      id: "enq-2",
      name: "Thomas Mueller",
      email: "thomas.m@outlook.com",
      phone: "+49 176 998877",
      message: "Interested in work visa consultancy for tech companies in India.",
      source: "Website",
      status: "Contacted",
      createdAt: "2026-06-25T11:10:00.000Z"
    }
  ];

  if (!localStorage.getItem('visa_enquiries')) {
    localStorage.setItem('visa_enquiries', JSON.stringify(defaultEnquiries));
  }

  // 5. Initial Tasks
  const defaultTasks = [
    {
      id: "task-1",
      title: "Review John Doe's Bank Statement",
      description: "Verify if the bank balance matches the tourist visa funding threshold ($5000+).",
      assignedTo: "u-exec",
      dueDate: "2026-06-29",
      status: "Pending",
      priority: "High",
      createdAt: "2026-06-28T09:00:00.000Z"
    },
    {
      id: "task-2",
      title: "Draft Europe Winter Packages",
      description: "Design promotional itineraries for Switzerland, Austria, and France.",
      assignedTo: "u-exec",
      dueDate: "2026-07-05",
      status: "In Progress",
      priority: "Medium",
      createdAt: "2026-06-27T10:00:00.000Z"
    }
  ];

  if (!localStorage.getItem('visa_tasks')) {
    localStorage.setItem('visa_tasks', JSON.stringify(defaultTasks));
  }
};

export const DatabaseProvider = ({ children }) => {
  // Load initial seeds
  seedData();

  // Core States
  const [currentUser, setCurrentUser] = useState(() => getInitialData('visa_current_user', null));
  const [users, setUsers] = useState(() => getInitialData('visa_users', []));
  const [applications, setApplications] = useState(() => getInitialData('visa_applications', []));
  const [leads, setLeads] = useState(() => getInitialData('visa_leads', []));
  const [enquiries, setEnquiries] = useState(() => getInitialData('visa_enquiries', []));
  const [tasks, setTasks] = useState(() => getInitialData('visa_tasks', []));
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem('visa_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('visa_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('visa_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('visa_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('visa_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('visa_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Toast Helper
  const addToast = (type, message) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Auth Operations
  const login = (email, password) => {
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      addToast('success', `Welcome back, ${matchedUser.name}!`);
      return { success: true, user: matchedUser };
    } else {
      addToast('error', 'Invalid email or password.');
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const register = (name, email, phone, password, role = 'Customer') => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      addToast('error', 'Email is already registered.');
      return { success: false, message: 'Email is already registered.' };
    }

    const newUser = {
      id: 'u-' + Math.random().toString(36).substring(7),
      name,
      email,
      phone,
      password,
      role,
      passportDetails: { passportNumber: '', nationality: '', issueDate: '', expiryDate: '' },
      address: { street: '', city: '', state: '', country: '', zip: '' }
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    addToast('success', 'Registration successful!');
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('info', 'Logged out successfully.');
  };

  const updateProfile = (profileData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profileData };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    addToast('success', 'Profile updated successfully.');
  };

  // Visa Application Operations
  const applyVisa = (applicantName, passportNumber, visaType, destinationCountry) => {
    if (!currentUser) return;
    const newApp = {
      id: 'app-' + Math.random().toString(36).substring(7),
      userId: currentUser.id,
      applicantName,
      passportNumber,
      visaType,
      destinationCountry,
      status: 'Pending',
      assignedExecutive: null,
      timeline: [
        { status: 'Pending', remarks: 'Application initiated by customer.', date: new Date().toISOString() }
      ],
      documents: [],
      notes: [],
      createdAt: new Date().toISOString()
    };

    setApplications(prev => [newApp, ...prev]);
    
    // Add Notification to CRM list
    addNotification('u-exec', `New visa application submitted by ${applicantName} for ${destinationCountry}.`);
    addToast('success', 'Visa Application submitted successfully!');
    return newApp;
  };

  const updateVisaStatus = (appId, status, remarks) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const updatedTimeline = [...app.timeline, {
          status,
          remarks: remarks || `Status changed to ${status}`,
          date: new Date().toISOString()
        }];
        
        // Notify user
        addNotification(app.userId, `Your visa application status is updated to: ${status}.`);
        addToast('success', `Application status changed to ${status}`);
        
        return { ...app, status, timeline: updatedTimeline };
      }
      return app;
    }));
  };

  const assignVisaExecutive = (appId, execId) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const execName = users.find(u => u.id === execId)?.name || 'Executive';
        const updatedTimeline = [...app.timeline, {
          status: app.status,
          remarks: `Application assigned to CRM Executive: ${execName}`,
          date: new Date().toISOString()
        }];
        addToast('success', `Assigned to ${execName}`);
        return { ...app, assignedExecutive: execId, timeline: updatedTimeline };
      }
      return app;
    }));
  };

  const uploadDocument = (appId, documentType, fileName, fileUrl) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const newDoc = {
          id: 'doc-' + Math.random().toString(36).substring(7),
          documentType,
          fileName,
          fileUrl,
          uploadDate: new Date().toISOString(),
          isVerified: false
        };
        const updatedDocs = [...app.documents, newDoc];
        const updatedTimeline = [...app.timeline, {
          status: app.status,
          remarks: `Document [${documentType}] uploaded: ${fileName}`,
          date: new Date().toISOString()
        }];
        addToast('success', `Uploaded ${documentType} successfully.`);
        return { ...app, documents: updatedDocs, timeline: updatedTimeline };
      }
      return app;
    }));
  };

  const deleteDocument = (appId, docId) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const docName = app.documents.find(d => d.id === docId)?.documentType || 'Document';
        const updatedDocs = app.documents.filter(d => d.id !== docId);
        const updatedTimeline = [...app.timeline, {
          status: app.status,
          remarks: `Document [${docName}] deleted.`,
          date: new Date().toISOString()
        }];
        addToast('info', `Removed ${docName}.`);
        return { ...app, documents: updatedDocs, timeline: updatedTimeline };
      }
      return app;
    }));
  };

  const verifyDocument = (appId, docId, isVerified) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const updatedDocs = app.documents.map(doc => {
          if (doc.id === docId) {
            return { ...doc, isVerified };
          }
          return doc;
        });
        
        const docName = app.documents.find(d => d.id === docId)?.documentType || 'Document';
        addToast('success', `Marked ${docName} as ${isVerified ? 'Verified' : 'Unverified'}`);
        return { ...app, documents: updatedDocs };
      }
      return app;
    }));
  };

  const addVisaNote = (appId, content) => {
    if (!currentUser) return;
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const newNote = {
          author: currentUser.name,
          content,
          date: new Date().toISOString()
        };
        addToast('success', 'Note added.');
        return { ...app, notes: [...app.notes, newNote] };
      }
      return app;
    }));
  };

  // Lead Operations (CRM)
  const addLead = (leadData) => {
    const newLead = {
      id: 'lead-' + Math.random().toString(36).substring(7),
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      priority: leadData.priority || 'Medium',
      status: leadData.status || 'New',
      assignedExecutive: leadData.assignedExecutive || null,
      source: leadData.source || 'Website Enquiry',
      notes: leadData.notes || '',
      followUps: [],
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
    addToast('success', 'CRM Lead added successfully.');
    return newLead;
  };

  const updateLead = (leadId, leadData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        addToast('success', 'Lead info updated.');
        return { ...lead, ...leadData };
      }
      return lead;
    }));
  };

  const deleteLead = (leadId) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    addToast('info', 'Lead removed.');
  };

  const addFollowUp = (leadId, followUpData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newFollowUp = {
          reminderDate: followUpData.reminderDate,
          notes: followUpData.notes,
          callHistory: followUpData.callHistory || '',
          dateCreated: new Date().toISOString()
        };
        addToast('success', 'Follow-up logged.');
        return { ...lead, followUps: [newFollowUp, ...lead.followUps] };
      }
      return lead;
    }));
  };

  // Enquiries Operations (Landing page)
  const submitEnquiry = (enquiryData) => {
    const newEnq = {
      id: 'enq-' + Math.random().toString(36).substring(7),
      name: enquiryData.name,
      email: enquiryData.email,
      phone: enquiryData.phone,
      message: enquiryData.message,
      source: enquiryData.source || 'Website',
      status: 'New',
      createdAt: new Date().toISOString()
    };
    setEnquiries(prev => [newEnq, ...prev]);
    addToast('success', 'Thank you! Your enquiry has been received.');
    return newEnq;
  };

  const resolveEnquiry = (enqId, status) => {
    setEnquiries(prev => prev.map(enq => {
      if (enq.id === enqId) {
        addToast('success', `Enquiry marked as ${status}`);
        return { ...enq, status };
      }
      return enq;
    }));
  };

  // Tasks Operations
  const addTask = (taskData) => {
    const newTask = {
      id: 'task-' + Math.random().toString(36).substring(7),
      title: taskData.title,
      description: taskData.description || '',
      assignedTo: taskData.assignedTo || 'u-exec',
      dueDate: taskData.dueDate,
      status: 'Pending',
      priority: taskData.priority || 'Medium',
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    addToast('success', 'Task assigned.');
    return newTask;
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        addToast('success', `Task marked as ${status}`);
        return { ...task, status };
      }
      return task;
    }));
  };

  // Internal Notifications helper
  const addNotification = (userId, message) => {
    const newNotif = {
      id: 'notif-' + Math.random().toString(36).substring(7),
      userId,
      message,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  };

  // Switch role directly (convenience helper for the prototype reviewer)
  const switchDemoRole = (roleName) => {
    const matchedUser = users.find(u => u.role === roleName);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      addToast('info', `Switched to Demo Role: ${roleName}`);
    } else {
      // If user does not exist, create a mock one
      const email = roleName.toLowerCase().replace(' ', '') + '@travel.com';
      const name = roleName + ' Demo';
      register(name, email, '+1 555-9999', 'password123', roleName);
    }
  };

  return (
    <DatabaseContext.Provider value={{
      currentUser,
      users,
      applications,
      leads,
      enquiries,
      tasks,
      notifications,
      toasts,
      login,
      register,
      logout,
      updateProfile,
      applyVisa,
      updateVisaStatus,
      assignVisaExecutive,
      uploadDocument,
      deleteDocument,
      verifyDocument,
      addVisaNote,
      addLead,
      updateLead,
      deleteLead,
      addFollowUp,
      submitEnquiry,
      resolveEnquiry,
      addTask,
      updateTaskStatus,
      switchDemoRole,
      addToast,
      markNotificationsRead
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
