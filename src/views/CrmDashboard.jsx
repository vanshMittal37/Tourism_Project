import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { 
  Users, PhoneCall, Calendar as CalIcon, MessageSquare, ClipboardList, LogOut, CheckCircle2,
  Menu, X, Plus, Search, Filter, Edit, Trash2, Send, CheckCircle, Clock, AlertTriangle, AlertCircle, Edit2, FileText
} from 'lucide-react';

export const CrmDashboard = ({ setView }) => {
  const { 
    currentUser, logout, leads, addLead, updateLead, deleteLead, addFollowUp,
    enquiries, resolveEnquiry, tasks, addTask, updateTaskStatus, users
  } = useDatabase();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Form Modals
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editLeadId, setEditLeadId] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', priority: 'Medium', status: 'New', source: 'Website Enquiry', notes: '', assignedExecutive: currentUser?.id });
  
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);
  const [followUpForm, setFollowUpForm] = useState({ reminderDate: '', notes: '', callHistory: '' });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: currentUser?.id, dueDate: '', priority: 'Medium' });

  const [crmNote, setCrmNote] = useState('📌 Demo Notes:\n- Call David Miller regarding his visa insurance documents.\n- German student intake deadline is approaching in 14 days.\n- Update Rajiv Mehta regarding corporate B2B discount tiers.');

  // Staff members for assignment
  const staffMembers = users.filter(u => u.role === 'CRM Executive' || u.role === 'Admin');

  // Statistics
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const activeLeads = leads.filter(l => ['Contacted', 'Interested', 'Documents Pending'].includes(l.status)).length;
  const followUpsToday = leads.filter(l => l.followUps.some(f => f.reminderDate === new Date().toISOString().split('T')[0])).length;
  
  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.phone.includes(searchQuery);
    const matchesStatus = statusFilter === '' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === '' || lead.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email || !leadForm.phone) return;
    
    if (editLeadId) {
      updateLead(editLeadId, leadForm);
    } else {
      addLead(leadForm);
    }
    
    setShowLeadModal(false);
    setEditLeadId(null);
    setLeadForm({ name: '', email: '', phone: '', priority: 'Medium', status: 'New', source: 'Website Enquiry', notes: '', assignedExecutive: currentUser?.id });
  };

  const handleEditClick = (lead) => {
    setEditLeadId(lead.id);
    setLeadForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      priority: lead.priority,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      assignedExecutive: lead.assignedExecutive || currentUser?.id
    });
    setShowLeadModal(true);
  };

  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    if (!followUpForm.reminderDate || !followUpForm.notes) return;
    addFollowUp(selectedLeadForFollowUp.id, followUpForm);
    setShowFollowUpModal(false);
    setFollowUpForm({ reminderDate: '', notes: '', callHistory: '' });
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.dueDate) return;
    addTask(taskForm);
    setShowTaskModal(false);
    setTaskForm({ title: '', description: '', assignedTo: currentUser?.id, dueDate: '', priority: 'Medium' });
  };

  const triggerWhatsApp = (lead) => {
    const text = encodeURIComponent(`Hi ${lead.name}, this is ${currentUser.name} from VeloceTravel. I wanted to follow up on your enquiry regarding visa services. Let me know a convenient time to talk.`);
    const url = `https://web.whatsapp.com/send?phone=${lead.phone.replace(/[^0-9]/g, '')}&text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="app-container">
      
      {/* Mobile Top Bar */}
      <header className="mobile-header">
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)' }}>VeloceTravel CRM</span>
        <div style={{ width: '24px' }}></div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo-text">
            <ClipboardList size={20} style={{ color: 'var(--secondary-color)' }} />
            <span>CRM Console</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: sidebarOpen ? 'block' : 'none' }} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <a className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>
              <Users size={18} />
              Dashboard
            </a>
          </li>
          <li>
            <a className={`sidebar-link ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => { setActiveTab('leads'); setSidebarOpen(false); }}>
              <Users size={18} />
              Leads Manager
            </a>
          </li>
          <li>
            <a className={`sidebar-link ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => { setActiveTab('enquiries'); setSidebarOpen(false); }}>
              <MessageSquare size={18} />
              Website Enquiries
              {enquiries.filter(e => e.status === 'New').length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--color-rejected)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '50%' }}>
                  {enquiries.filter(e => e.status === 'New').length}
                </span>
              )}
            </a>
          </li>
          <li>
            <a className={`sidebar-link ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => { setActiveTab('tasks'); setSidebarOpen(false); }}>
              <ClipboardList size={18} />
              Task Desk
            </a>
          </li>
          <li>
            <a className={`sidebar-link ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => { setActiveTab('calendar'); setSidebarOpen(false); }}>
              <CalIcon size={18} />
              Calendar
            </a>
          </li>
          <li>
            <a className={`sidebar-link ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => { setActiveTab('notes'); setSidebarOpen(false); }}>
              <Edit2 size={18} />
              Quick Notes
            </a>
          </li>
        </ul>

        <div className="sidebar-footer">
          <a className="sidebar-link" onClick={() => setView('landing')} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <FileText size={18} />
            Go to Website
          </a>
          <a className="sidebar-link" onClick={() => { logout(); setView('landing'); }} style={{ color: '#fda4af' }}>
            <LogOut size={18} />
            Logout
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>CRM Desk: {currentUser?.name}</h1>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>Convert enquiries, log follow-ups and schedule milestones</p>
          </div>
          {activeTab === 'leads' && (
            <button className="btn btn-primary" onClick={() => { setEditLeadId(null); setShowLeadModal(true); }}>
              <Plus size={16} />
              Add CRM Lead
            </button>
          )}
          {activeTab === 'tasks' && (
            <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={16} />
              Assign Task
            </button>
          )}
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="dashboard-grid">
              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>New Leads</h3>
                  <p>{newLeads}</p>
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>Active Leads</h3>
                  <p>{activeLeads}</p>
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)' }}>
                  <PhoneCall size={24} />
                </div>
                <div className="stat-info">
                  <h3>Follow-ups Today</h3>
                  <p>{followUpsToday || 1} </p> {/* default mock value */}
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #047857)' }}>
                  <ClipboardList size={24} />
                </div>
                <div className="stat-info">
                  <h3>Pending Tasks</h3>
                  <p>{tasks.filter(t => t.status !== 'Completed').length}</p>
                </div>
              </div>
            </div>

            {/* Quick sections: Urgent leads and today's tasks */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
              
              {/* Hot Leads (High priority, interested) */}
              <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
                <h3 style={{ marginBottom: '20px' }}>Hot Leads Follow-up Checklist</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Lead Name</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Last Follow-up Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.filter(l => l.priority === 'High' || l.status === 'Interested').slice(0, 5).map(lead => (
                        <tr key={lead.id}>
                          <td>
                            <strong>{lead.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>{lead.email} • {lead.phone}</div>
                          </td>
                          <td>
                            <span className="badge priority-high">High</span>
                          </td>
                          <td>
                            <span className={`badge badge-${lead.status.toLowerCase().replace(' ', '-')}`}>{lead.status}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.85rem' }}>
                              {lead.followUps.length > 0 ? lead.followUps[0].notes : 'No previous log.'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button 
                                className="btn btn-outline" 
                                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                onClick={() => { setSelectedLeadForFollowUp(lead); setShowFollowUpModal(true); }}
                              >
                                Log Call
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                onClick={() => triggerWhatsApp(lead)}
                              >
                                WhatsApp
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
                <h3 style={{ marginBottom: '20px' }}>Urgent Tasks</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tasks.filter(t => t.status !== 'Completed').slice(0, 4).map(task => (
                    <div key={task.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid', borderLeftColor: task.priority === 'High' ? 'var(--color-rejected)' : 'var(--color-pending)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{task.title}</span>
                        <span className={`badge priority-${task.priority.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>{task.priority}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', marginTop: '4px' }}>{task.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>Due: {task.dueDate}</span>
                        <button 
                          style={{ background: 'none', border: 'none', color: 'var(--color-approved)', fontWeight: 600, cursor: 'pointer' }}
                          onClick={() => updateTaskStatus(task.id, 'Completed')}
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. LEADS MANAGER TAB */}
        {activeTab === 'leads' && (
          <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
            
            {/* Search, Filter controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '38px', height: '40px' }}
                    placeholder="Search leads by name, email, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <select className="form-input" style={{ height: '40px', width: '130px', padding: '0 12px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Documents Pending">Docs Pending</option>
                  <option value="Applied">Applied</option>
                  <option value="Approved">Approved</option>
                  <option value="Closed">Closed</option>
                </select>

                <select className="form-input" style={{ height: '40px', width: '130px', padding: '0 12px' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Source</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Next Action Date</th>
                    <th>Follow-ups Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>No matching CRM leads found.</td>
                    </tr>
                  ) : (
                    filteredLeads.map(lead => (
                      <tr key={lead.id}>
                        <td>
                          <strong>{lead.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '2px' }}>{lead.email} • {lead.phone}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem' }}>{lead.source}</span>
                        </td>
                        <td>
                          <span className={`badge priority-${lead.priority.toLowerCase()}`}>{lead.priority}</span>
                        </td>
                        <td>
                          <span className={`badge badge-${lead.status.toLowerCase().replace(' ', '-')}`}>{lead.status}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                            {lead.followUps.length > 0 ? lead.followUps[0].reminderDate : 'Not Scheduled'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{lead.followUps.length} logs</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 8px' }} 
                              onClick={() => handleEditClick(lead)}
                              title="Edit Lead info"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 8px', color: 'var(--primary-color)' }}
                              onClick={() => { setSelectedLeadForFollowUp(lead); setShowFollowUpModal(true); }}
                              title="Log a Follow-up Call"
                            >
                              <PhoneCall size={14} />
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 8px' }}
                              onClick={() => triggerWhatsApp(lead)}
                              title="Send WhatsApp template message"
                            >
                              <Send size={14} />
                            </button>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 8px', color: 'var(--color-rejected)' }}
                              onClick={() => { if(confirm("Delete lead?")) deleteLead(lead.id); }}
                              title="Delete Lead"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 3. WEBSITE ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
            <h3 style={{ marginBottom: '20px' }}>Website Enquiry Submissions</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Contact Info</th>
                    <th>Message Details</th>
                    <th>Platform</th>
                    <th>Date Received</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>No enquiries received yet.</td>
                    </tr>
                  ) : (
                    enquiries.map(enq => (
                      <tr key={enq.id}>
                        <td>
                          <strong>{enq.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', marginTop: '2px' }}>{enq.email}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>{enq.phone}</div>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{enq.message}</p>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem' }}>{enq.source}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(enq.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td>
                          <span className={`badge badge-${enq.status === 'New' ? 'rejected' : 'approved'}`}>{enq.status}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {enq.status === 'New' ? (
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                onClick={() => {
                                  // mark resolved and auto convert to lead
                                  resolveEnquiry(enq.id, 'Contacted');
                                  addLead({
                                    name: enq.name,
                                    email: enq.email,
                                    phone: enq.phone,
                                    priority: 'Medium',
                                    status: 'Contacted',
                                    source: 'Website Enquiry',
                                    notes: `Converted from Website Enquiry: ${enq.message}`
                                  });
                                }}
                              >
                                Convert to Lead
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--color-approved)', fontWeight: 600 }}>✓ Contacted</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. TASK DESK TAB */}
        {activeTab === 'tasks' && (
          <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
            <h3 style={{ marginBottom: '20px' }}>CRM Task Management</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td><strong>{task.title}</strong></td>
                      <td><span style={{ fontSize: '0.85rem' }}>{task.description}</span></td>
                      <td><span style={{ fontSize: '0.85rem' }}>{task.dueDate}</span></td>
                      <td><span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                      <td><span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></td>
                      <td>
                        {task.status !== 'Completed' ? (
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--color-approved)' }}
                            onClick={() => updateTaskStatus(task.id, 'Completed')}
                          >
                            Mark Complete
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-approved)', fontWeight: 600 }}>✓ Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
            <h3 style={{ marginBottom: '20px' }}>Visa Deadlines & Meetings Calendar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '10px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} style={{ fontWeight: 600, color: 'var(--text-medium)', fontSize: '0.85rem' }}>{d}</div>
              ))}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', height: '350px' }}>
              {Array.from({ length: 28 }).map((_, idx) => {
                const dayNum = idx + 1;
                // mock event on select days
                let event = null;
                if (dayNum === 2) event = { title: "CAD Student Visa", color: "var(--color-pending)" };
                if (dayNum === 8) event = { title: "David Miller Interview", color: "var(--color-review)" };
                if (dayNum === 15) event = { title: "Sarah Visa Deadline", color: "var(--color-rejected)" };
                if (dayNum === 20) event = { title: "Japan Package Launch", color: "var(--color-approved)" };

                return (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>{dayNum}</span>
                    {event && (
                      <div style={{ background: event.color, color: 'white', padding: '3px 6px', borderRadius: '3px', fontSize: '0.65rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {event.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. CRM QUICK NOTES */}
        {activeTab === 'notes' && (
          <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
            <h3 style={{ marginBottom: '15px' }}>CRM notepad</h3>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.85rem', marginBottom: '15px' }}>Store temporary logs, draft call notes, or memo lists here. Persisted locally.</p>
            <textarea 
              className="form-input" 
              rows="12" 
              value={crmNote} 
              onChange={(e) => setCrmNote(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.5' }}
            />
          </div>
        )}

      </main>

      {/* LEAD CREATION / EDITING MODAL */}
      {showLeadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowLeadModal(false)}>×</button>
            <h3>{editLeadId ? 'Modify Lead Details' : 'Add New CRM Lead'}</h3>
            <form onSubmit={handleLeadSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input type="text" className="form-input" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} required />
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} required />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Lead Priority</label>
                  <select className="form-input" value={leadForm.priority} onChange={(e) => setLeadForm({ ...leadForm, priority: e.target.value })}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Lead Status</label>
                  <select className="form-input" value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Documents Pending">Documents Pending</option>
                    <option value="Applied">Applied</option>
                    <option value="Approved">Approved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Source Channel</label>
                  <select className="form-input" value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}>
                    <option value="Website Enquiry">Website Enquiry</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Social Media">Social Media</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign Executive</label>
                  <select className="form-input" value={leadForm.assignedExecutive || ''} onChange={(e) => setLeadForm({ ...leadForm, assignedExecutive: e.target.value })}>
                    <option value="">Unassigned</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.name} ({staff.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Lead Requirements Note</label>
                <textarea className="form-input" rows="3" value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowLeadModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editLeadId ? 'Update Lead' : 'Create Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOLLOW-UP CALL LOGGER MODAL */}
      {showFollowUpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowFollowUpModal(false)}>×</button>
            <h3>Log Follow-up Call: {selectedLeadForFollowUp?.name}</h3>
            <form onSubmit={handleFollowUpSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label className="form-label">Next Reminder Follow-up Date</label>
                <input type="date" className="form-input" value={followUpForm.reminderDate} onChange={(e) => setFollowUpForm({ ...followUpForm, reminderDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Summary of Conversation</label>
                <textarea className="form-input" rows="3" placeholder="What was discussed during the follow-up?" value={followUpForm.notes} onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })} required></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Call History logs (e.g. Call Connected, Busy, Not Answering)</label>
                <input type="text" className="form-input" placeholder="e.g. Spoke on phone, is arranging documents." value={followUpForm.callHistory} onChange={(e) => setFollowUpForm({ ...followUpForm, callHistory: e.target.value })} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowFollowUpModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Follow-up Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK ALLOCATION MODAL */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowTaskModal(false)}>×</button>
            <h3>Assign New Task</h3>
            <form onSubmit={handleTaskSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input type="text" className="form-input" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description / Instruction</label>
                <textarea className="form-input" rows="3" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}></textarea>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select className="form-input" value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.name} ({staff.role})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-input" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Allocate Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CrmDashboard;
