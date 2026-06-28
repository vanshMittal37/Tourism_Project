import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { 
  ShieldAlert, Users, FileText, CheckSquare, BarChart3, Settings, LogOut, CheckCircle, Clock, 
  Menu, X, Search, Filter, Edit, Eye, ShieldCheck, Download, AlertTriangle, AlertCircle, MessageSquare, Plus
} from 'lucide-react';

export const AdminDashboard = ({ setView }) => {
  const { 
    currentUser, logout, users, applications, assignVisaExecutive, 
    updateVisaStatus, verifyDocument, addVisaNote, register
  } = useDatabase();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('');
  
  // Modals & Action States
  const [statusForm, setStatusForm] = useState({ status: 'Pending', remarks: '' });
  const [assignExecId, setAssignExecId] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', password: 'password123', role: 'CRM Executive' });

  // Filters for Customers table
  const [customerSearch, setCustomerSearch] = useState('');
  
  // Filters for Applications table
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('');

  // Statistics calculations
  const customers = users.filter(u => u.role === 'Customer');
  const staff = users.filter(u => u.role === 'CRM Executive' || u.role === 'Admin');
  const totalAppsCount = applications.length;
  const approvedAppsCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedAppsCount = applications.filter(a => a.status === 'Rejected').length;
  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;
  const inReviewAppsCount = applications.filter(a => ['Documents Pending', 'In Review'].includes(a.status)).length;

  const selectedApp = applications.find(a => a.id === selectedAppId);

  // Setup default application for tracking panel
  React.useEffect(() => {
    if (applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0].id);
    }
  }, [applications, selectedAppId]);

  // Filters
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  const filteredApplications = applications.filter(a => {
    const matchesSearch = a.applicantName.toLowerCase().includes(appSearch.toLowerCase()) || 
                          a.passportNumber.toLowerCase().includes(appSearch.toLowerCase()) ||
                          a.destinationCountry.toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appStatusFilter === '' || a.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Extract all documents uploaded across all applications
  const allDocuments = [];
  applications.forEach(app => {
    app.documents.forEach(doc => {
      allDocuments.push({
        ...doc,
        appId: app.id,
        applicantName: app.applicantName,
        destinationCountry: app.destinationCountry
      });
    });
  });

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppId || !statusForm.status) return;
    updateVisaStatus(selectedAppId, statusForm.status, statusForm.remarks);
    setStatusForm({ status: 'Pending', remarks: '' });
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppId || !assignExecId) return;
    assignVisaExecutive(selectedAppId, assignExecId);
    setAssignExecId('');
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppId || !noteContent) return;
    addVisaNote(selectedAppId, noteContent);
    setNoteContent('');
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.phone) return;
    register(newStaff.name, newStaff.email, newStaff.phone, newStaff.password, newStaff.role);
    setShowAddStaffModal(false);
    setNewStaff({ name: '', email: '', phone: '', password: 'password123', role: 'CRM Executive' });
  };

  return (
    <div className="app-container">
      
      {/* Mobile Top Bar */}
      <header className="mobile-header">
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)' }}>VeloceTravel Admin</span>
        <div style={{ width: '24px' }}></div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo-text">
            <ShieldAlert size={20} style={{ color: 'var(--secondary-color)' }} />
            <span>Admin Console</span>
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
            <a className={`sidebar-link ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => { setActiveTab('customers'); setSidebarOpen(false); }}>
              <Users size={18} />
              Customers
            </a>
          </li>
          <li>
            <a className={`sidebar-link ${activeTab === 'visa-applications' ? 'active' : ''}`} onClick={() => { setActiveTab('visa-applications'); setSidebarOpen(false); }}>
              <FileText size={18} />
              Visa Applications
            </a>
          </li>
          <li>
            <a className={`sidebar-link ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => { setActiveTab('documents'); setSidebarOpen(false); }}>
              <CheckSquare size={18} />
              Audit Documents
            </a>
          </li>
          <li>
            <a className={`sidebar-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}>
              <BarChart3 size={18} />
              Reports & Analytics
            </a>
          </li>
          <li>
            <a className={`sidebar-link ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => { setActiveTab('staff'); setSidebarOpen(false); }}>
              <Users size={18} />
              Staff Management
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

      {/* Main content workspace */}
      <main className="main-content">
        
        {/* Welcome Banner */}
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>Admin Workspace: Sarah Jenkins</h1>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>Full operations override, status auditing and performance analytics</p>
          </div>
          {activeTab === 'staff' && (
            <button className="btn btn-primary" onClick={() => setShowAddStaffModal(true)}>
              <Plus size={16} />
              Add Staff Member
            </button>
          )}
        </div>

        {/* 1. STATS OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stat grids */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              <div className="glass-card stat-card" style={{ padding: '20px' }}>
                <div className="stat-icon" style={{ width: '45px', height: '45px', background: '#3b82f6' }}><Users size={20} /></div>
                <div className="stat-info"><h3>Customers</h3><p>{customers.length}</p></div>
              </div>
              <div className="glass-card stat-card" style={{ padding: '20px' }}>
                <div className="stat-icon" style={{ width: '45px', height: '45px', background: '#10b981' }}><FileText size={20} /></div>
                <div className="stat-info"><h3>Applications</h3><p>{totalAppsCount}</p></div>
              </div>
              <div className="glass-card stat-card" style={{ padding: '20px' }}>
                <div className="stat-icon" style={{ width: '45px', height: '45px', background: '#ec4899' }}><CheckCircle size={20} /></div>
                <div className="stat-info"><h3>Approved</h3><p>{approvedAppsCount}</p></div>
              </div>
              <div className="glass-card stat-card" style={{ padding: '20px' }}>
                <div className="stat-icon" style={{ width: '45px', height: '45px', background: '#ef4444' }}><AlertTriangle size={20} /></div>
                <div className="stat-info"><h3>Rejected</h3><p>{rejectedAppsCount}</p></div>
              </div>
              <div className="glass-card stat-card" style={{ padding: '20px' }}>
                <div className="stat-icon" style={{ width: '45px', height: '45px', background: '#f59e0b' }}><Clock size={20} /></div>
                <div className="stat-info"><h3>Pending</h3><p>{pendingAppsCount}</p></div>
              </div>
              <div className="glass-card stat-card" style={{ padding: '20px' }}>
                <div className="stat-icon" style={{ width: '45px', height: '45px', background: '#8b5cf6' }}><AlertCircle size={20} /></div>
                <div className="stat-info"><h3>In Review</h3><p>{inReviewAppsCount}</p></div>
              </div>
            </div>

            {/* Quick Actions and Review Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', marginTop: '30px' }}>
              
              {/* Applications requiring immediate attention */}
              <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
                <h3 style={{ marginBottom: '20px' }}>Urgent Visa Applications</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Documents</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map(app => (
                        <tr key={app.id}>
                          <td>
                            <strong>{app.applicantName}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>{app.destinationCountry} • Passport: {app.passportNumber}</div>
                          </td>
                          <td><span style={{ fontSize: '0.85rem' }}>{app.visaType}</span></td>
                          <td><span className={`badge badge-${app.status.toLowerCase().replace(' ', '-')}`}>{app.status}</span></td>
                          <td>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{app.documents.length} uploaded</span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                              onClick={() => { setSelectedAppId(app.id); setActiveTab('visa-applications'); }}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Document Verifications list */}
              <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
                <h3 style={{ marginBottom: '20px' }}>Pending Document Verifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {allDocuments.filter(d => !d.isVerified).slice(0, 4).map(doc => (
                    <div key={doc.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{doc.documentType}</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '2px' }}>{doc.applicantName} • {doc.destinationCountry}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '6px 8px' }}>
                          <Eye size={12} />
                        </a>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          onClick={() => verifyDocument(doc.appId, doc.id, true)}
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  ))}
                  {allDocuments.filter(d => !d.isVerified).length === 0 && (
                    <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '20px' }}>All uploaded documents have been verified!</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '38px', height: '40px' }}
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Passport Details</th>
                    <th>City/Country</th>
                    <th>Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(cust => (
                    <tr key={cust.id}>
                      <td><strong>{cust.name}</strong></td>
                      <td>{cust.email}</td>
                      <td>{cust.phone}</td>
                      <td>
                        {cust.passportDetails?.passportNumber ? (
                          <span style={{ fontSize: '0.85rem' }}>{cust.passportDetails.passportNumber} ({cust.passportDetails.nationality})</span>
                        ) : (
                          <span style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.8rem' }}>Not Added</span>
                        )}
                      </td>
                      <td>
                        {cust.address?.city ? (
                          <span style={{ fontSize: '0.85rem' }}>{cust.address.city}, {cust.address.country}</span>
                        ) : (
                          <span style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.8rem' }}>Not Added</span>
                        )}
                      </td>
                      <td><span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>June 2026</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. VISA APPLICATIONS TAB */}
        {activeTab === 'visa-applications' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
            
            {/* Left Box: Listing */}
            <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search applications..." 
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                />
                <select className="form-input" value={appStatusFilter} onChange={(e) => setAppStatusFilter(e.target.value)} style={{ width: '150px' }}>
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Documents Pending">Docs Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredApplications.map(app => (
                  <div 
                    key={app.id} 
                    style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      background: selectedAppId === app.id ? 'var(--primary-light)' : '#f8fafc',
                      border: selectedAppId === app.id ? '1px solid var(--primary-color)' : '1px solid #f1f5f9',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedAppId(app.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{app.applicantName}</h4>
                      <span className={`badge badge-${app.status.toLowerCase().replace(' ', '-')}`}>{app.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '8px' }}>
                      <span>Destination: <strong>{app.destinationCountry}</strong> ({app.visaType})</span>
                      <span>Passport: {app.passportNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Box: Control panel */}
            <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
              {selectedApp ? (
                <div>
                  <h3 style={{ marginBottom: '15px' }}>Override Control: {selectedApp.applicantName}</h3>
                  
                  {/* Status update form */}
                  <form onSubmit={handleStatusSubmit} style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>1. Update Visa Status</h4>
                    <div className="form-group">
                      <select 
                        className="form-input" 
                        value={statusForm.status} 
                        onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                        style={{ height: '38px', padding: '0 10px' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Documents Pending">Documents Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Add remarks or instructions..." 
                        value={statusForm.remarks}
                        onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '6px 15px', fontSize: '0.85rem' }}>Update Status</button>
                  </form>

                  {/* Assign executive form */}
                  <form onSubmit={handleAssignSubmit} style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>2. Assign CRM Executive</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <select 
                        className="form-input" 
                        value={assignExecId} 
                        onChange={(e) => setAssignExecId(e.target.value)}
                        style={{ flex: 1 }}
                        required
                      >
                        <option value="">Choose Executive...</option>
                        {staff.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                        ))}
                      </select>
                      <button type="submit" className="btn btn-secondary" style={{ padding: '0 15px', fontSize: '0.85rem' }}>Assign</button>
                    </div>
                  </form>

                  {/* Add workflow note */}
                  <form onSubmit={handleNoteSubmit} style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>3. Add Office Workflow Note</h4>
                    <div className="form-group">
                      <textarea 
                        className="form-input" 
                        rows="2" 
                        placeholder="Internal notes visible to CRM staff..."
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-outline" style={{ padding: '6px 15px', fontSize: '0.85rem' }}>Log Note</button>
                  </form>

                  {/* Timeline track */}
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Active History Timeline</h4>
                    <div className="timeline-container" style={{ fontSize: '0.85rem' }}>
                      {selectedApp.timeline.map((event, idx) => (
                        <div key={idx} className="timeline-item">
                          <div className={`timeline-dot ${event.status.replace(' ', '-')}`} />
                          <div className="timeline-meta">{new Date(event.date).toLocaleDateString()}</div>
                          <div className="timeline-title">{event.status}</div>
                          <div className="timeline-desc">{event.remarks}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px' }}>Select an application from the left list to override.</p>
              )}
            </div>

          </div>
        )}

        {/* 4. AUDIT DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
            <h3 style={{ marginBottom: '20px' }}>Central Document Auditing Hub</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Destination</th>
                    <th>Document Type</th>
                    <th>File Name</th>
                    <th>Date Uploaded</th>
                    <th>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {allDocuments.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>No documents uploaded yet.</td>
                    </tr>
                  ) : (
                    allDocuments.map(doc => (
                      <tr key={doc.id}>
                        <td><strong>{doc.applicantName}</strong></td>
                        <td>{doc.destinationCountry}</td>
                        <td><span style={{ fontWeight: 500 }}>{doc.documentType}</span></td>
                        <td>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontSize: '0.85rem' }}>
                            {doc.fileName}
                          </a>
                        </td>
                        <td><span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(doc.uploadDate).toLocaleDateString()}</span></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className={`badge badge-${doc.isVerified ? 'approved' : 'pending'}`}>
                              {doc.isVerified ? 'Verified' : 'Pending'}
                            </span>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => verifyDocument(doc.appId, doc.id, !doc.isVerified)}
                            >
                              Toggle Verification
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

        {/* 5. REPORTS & ANALYTICS TAB */}
        {activeTab === 'reports' && (
          <div>
            {/* SVG Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '30px' }}>
              
              {/* Line Chart: Monthly Applications volume */}
              <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
                <h3 style={{ marginBottom: '15px' }}>Monthly Application Volumes</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginBottom: '20px' }}>Track volumes of submissions over the past 6 months</p>
                <div style={{ height: '240px', position: 'relative' }}>
                  <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%' }}>
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />
                    
                    {/* Graph Path */}
                    <path 
                      d="M 60,140 Q 140,80 220,110 T 380,40 T 460,70" 
                      fill="none" 
                      stroke="url(#gradient-blue)" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                    />
                    
                    {/* Fills underneath */}
                    <path 
                      d="M 60,140 Q 140,80 220,110 T 380,40 T 460,70 L 460,170 L 60,170 Z" 
                      fill="url(#gradient-area-blue)" 
                      opacity="0.15" 
                    />

                    {/* Plot Points */}
                    <circle cx="60" cy="140" r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                    <circle cx="140" cy="95" r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                    <circle cx="220" cy="110" r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                    <circle cx="300" cy="70" r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                    <circle cx="380" cy="40" r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                    <circle cx="460" cy="70" r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />

                    {/* Labels */}
                    <text x="60" y="190" textAnchor="middle" fontSize="10" fill="#94a3b8">Jan</text>
                    <text x="140" y="190" textAnchor="middle" fontSize="10" fill="#94a3b8">Feb</text>
                    <text x="220" y="190" textAnchor="middle" fontSize="10" fill="#94a3b8">Mar</text>
                    <text x="300" y="190" textAnchor="middle" fontSize="10" fill="#94a3b8">Apr</text>
                    <text x="380" y="190" textAnchor="middle" fontSize="10" fill="#94a3b8">May</text>
                    <text x="460" y="190" textAnchor="middle" fontSize="10" fill="#94a3b8">Jun</text>

                    <text x="25" y="23" textAnchor="end" fontSize="10" fill="#94a3b8">150</text>
                    <text x="25" y="63" textAnchor="end" fontSize="10" fill="#94a3b8">100</text>
                    <text x="25" y="103" textAnchor="end" fontSize="10" fill="#94a3b8">50</text>
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="gradient-blue" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                      <linearGradient id="gradient-area-blue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Bar Chart: Visa success rate by Category */}
              <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
                <h3 style={{ marginBottom: '15px' }}>Visa Category Success Ratios</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginBottom: '20px' }}>Approval rate averages by visa classification types</p>
                <div style={{ height: '240px' }}>
                  <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%' }}>
                    {/* grid lines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="160" x2="480" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />

                    {/* Bars */}
                    {/* Tourist: 98% */}
                    <rect x="70" y="24" width="40" height="136" rx="4" fill="url(#gradient-teal)" />
                    {/* Student: 95% */}
                    <rect x="170" y="30" width="40" height="130" rx="4" fill="url(#gradient-teal)" />
                    {/* Business: 88% */}
                    <rect x="270" y="44" width="40" height="116" rx="4" fill="url(#gradient-teal)" />
                    {/* Work: 80% */}
                    <rect x="370" y="60" width="40" height="100" rx="4" fill="url(#gradient-teal)" />

                    {/* Labels */}
                    <text x="90" y="180" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="500">Tourist</text>
                    <text x="190" y="180" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="500">Student</text>
                    <text x="290" y="180" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="500">Business</text>
                    <text x="390" y="180" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="500">Work</text>

                    {/* Ratios text */}
                    <text x="90" y="18" textAnchor="middle" fontSize="10" fill="var(--secondary-color)" fontWeight="600">98%</text>
                    <text x="190" y="24" textAnchor="middle" fontSize="10" fill="var(--secondary-color)" fontWeight="600">95%</text>
                    <text x="290" y="38" textAnchor="middle" fontSize="10" fill="var(--secondary-color)" fontWeight="600">88%</text>
                    <text x="390" y="54" textAnchor="middle" fontSize="10" fill="var(--secondary-color)" fontWeight="600">80%</text>

                    <text x="25" y="23" textAnchor="end" fontSize="10" fill="#94a3b8">100%</text>
                    <text x="25" y="90" textAnchor="end" fontSize="10" fill="#94a3b8">50%</text>

                    <defs>
                      <linearGradient id="gradient-teal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d9488" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

            </div>

            {/* Bottom summary stats */}
            <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
              <h3 style={{ marginBottom: '15px' }}>Corporate Sales & Revenue Stream</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '20px' }}>Real-time invoice collections breakdown by department</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>Tourist Package Revenue</span>
                  <h4 style={{ fontSize: '1.5rem', marginTop: '6px', color: 'var(--primary-color)' }}>$32,450</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-approved)' }}>▲ 12.4% vs last month</span>
                </div>
                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>Visa Consultancy Fees</span>
                  <h4 style={{ fontSize: '1.5rem', marginTop: '6px', color: 'var(--secondary-color)' }}>$14,800</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-approved)' }}>▲ 8.1% vs last month</span>
                </div>
                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>Corporate B2B Retainers</span>
                  <h4 style={{ fontSize: '1.5rem', marginTop: '6px', color: '#8b5cf6' }}>$25,000</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>▬ Stable</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. STAFF MANAGEMENT TAB */}
        {activeTab === 'staff' && (
          <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
            <h3 style={{ marginBottom: '20px' }}>CRM & Administration Staff Directory</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Role Designation</th>
                    <th>Action Override</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map(member => (
                    <tr key={member.id}>
                      <td><strong>{member.name}</strong></td>
                      <td>{member.email}</td>
                      <td>{member.phone || '+1 555-0000'}</td>
                      <td>
                        <span className={`badge ${member.role === 'Admin' ? 'badge-approved' : 'badge-review'}`}>
                          {member.role}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--color-rejected)' }}
                          onClick={() => alert("Staff management controls: Modify status deactivated for safety in demo.")}
                        >
                          Revoke Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* STAFF CREATION MODAL */}
      {showAddStaffModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowAddStaffModal(false)}>×</button>
            <h3>Register New Staff Member</h3>
            <form onSubmit={handleAddStaffSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Default Password</label>
                  <input type="text" className="form-input" value={newStaff.password} onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Role Designation</label>
                <select className="form-input" value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}>
                  <option value="CRM Executive">CRM Executive (Sales / Leads)</option>
                  <option value="Admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddStaffModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Staff Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
