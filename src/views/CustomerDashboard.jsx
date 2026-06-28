import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { 
  LayoutDashboard, User as UserIcon, FileText, Upload, Bell, Settings, LogOut, 
  Menu, X, CheckCircle, Clock, AlertCircle, File, Eye, Trash2, Plus, Calendar, MapPin
} from 'lucide-react';

export const CustomerDashboard = ({ setView }) => {
  const { 
    currentUser, logout, updateProfile, applyVisa, 
    applications, uploadDocument, deleteDocument, notifications, markNotificationsRead
  } = useDatabase();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modals / Form States
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [newApp, setNewApp] = useState({ applicantName: '', passportNumber: '', visaType: 'Tourist Visa', destinationCountry: '' });
  
  // Profile Form States
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [passportDetails, setPassportDetails] = useState({
    passportNumber: currentUser?.passportDetails?.passportNumber || '',
    nationality: currentUser?.passportDetails?.nationality || '',
    issueDate: currentUser?.passportDetails?.issueDate || '',
    expiryDate: currentUser?.passportDetails?.expiryDate || ''
  });
  const [address, setAddress] = useState({
    street: currentUser?.address?.street || '',
    city: currentUser?.address?.city || '',
    state: currentUser?.address?.state || '',
    country: currentUser?.address?.country || '',
    zip: currentUser?.address?.zip || ''
  });

  // Doc Upload States
  const [selectedAppId, setSelectedAppId] = useState('');
  const [docType, setDocType] = useState('Passport');

  // Filter applications owned by current customer
  const myApps = applications.filter(app => app.userId === currentUser?.id);

  // Setup default app selection for upload tab
  React.useEffect(() => {
    if (myApps.length > 0 && !selectedAppId) {
      setSelectedAppId(myApps[0].id);
    }
  }, [myApps, selectedAppId]);

  // Statistics
  const activeCount = myApps.filter(app => ['Pending', 'Documents Pending', 'In Review'].includes(app.status)).length;
  const approvedCount = myApps.filter(app => app.status === 'Approved').length;
  
  // Find pending docs count
  const selectedAppForDocs = myApps.find(a => a.id === selectedAppId);
  const pendingDocsCount = selectedAppForDocs ? 8 - selectedAppForDocs.documents.length : 0; // assume 8 required documents

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      phone: profilePhone,
      passportDetails,
      address
    });
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!newApp.applicantName || !newApp.passportNumber || !newApp.destinationCountry) return;
    const app = applyVisa(newApp.applicantName, newApp.passportNumber, newApp.visaType, newApp.destinationCountry);
    setShowApplyModal(false);
    setNewApp({ applicantName: '', passportNumber: '', visaType: 'Tourist Visa', destinationCountry: '' });
    setSelectedAppId(app.id); // focus on this new app
    setActiveTab('visa-applications');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedAppId) return;

    // Limit file sizes for localStorage prototype stability
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit for this prototype demo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      uploadDocument(selectedAppId, docType, file.name, reader.result);
    };
    reader.readAsDataURL(file);
    // clear input
    e.target.value = null;
  };

  return (
    <div className="app-container">
      
      {/* Mobile Top Bar */}
      <header className="mobile-header">
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)' }}>VeloceTravel Portal</span>
        <div style={{ width: '24px' }}></div>
      </header>

      {/* Sidebar navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo-text">
            <Clock size={20} style={{ color: 'var(--secondary-color)' }} />
            <span>Customer Portal</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: sidebarOpen ? 'block' : 'none' }} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <a 
              className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
            >
              <UserIcon size={18} />
              My Profile
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-link ${activeTab === 'visa-applications' ? 'active' : ''}`}
              onClick={() => { setActiveTab('visa-applications'); setSidebarOpen(false); }}
            >
              <FileText size={18} />
              Visa Applications
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-link ${activeTab === 'upload-documents' ? 'active' : ''}`}
              onClick={() => { setActiveTab('upload-documents'); setSidebarOpen(false); }}
            >
              <Upload size={18} />
              Upload Documents
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-link ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => { 
                setActiveTab('notifications'); 
                setSidebarOpen(false); 
                markNotificationsRead();
              }}
            >
              <Bell size={18} />
              Notifications
              {notifications.filter(n => n.userId === currentUser.id && !n.read).length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--color-rejected)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '50%' }}>
                  {notifications.filter(n => n.userId === currentUser.id && !n.read).length}
                </span>
              )}
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

      {/* Main Dashboard Panel */}
      <main className="main-content">
        
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>Hello, {currentUser?.name}</h1>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>Track and manage your visa applications effortlessly</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
            <Plus size={16} />
            Apply New Visa
          </button>
        </div>

        {/* 1. MAIN WIDGETS TAB */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Widgets Cards */}
            <div className="dashboard-grid">
              
              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  <FileText size={24} />
                </div>
                <div className="stat-info">
                  <h3>Active Applications</h3>
                  <p>{activeCount}</p>
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #047857)' }}>
                  <CheckCircle size={24} />
                </div>
                <div className="stat-info">
                  <h3>Approved Visas</h3>
                  <p>{approvedCount}</p>
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)' }}>
                  <Upload size={24} />
                </div>
                <div className="stat-info">
                  <h3>Documents Pending</h3>
                  <p>{myApps.length > 0 ? (selectedAppForDocs ? Math.max(0, 8 - selectedAppForDocs.documents.length) : 'Select application') : 0}</p>
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #5b21b6)' }}>
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <h3>Recent Updates</h3>
                  <p>{myApps.length > 0 ? myApps[0].status : 'None'}</p>
                </div>
              </div>

            </div>

            {/* Quick Status and Timeline View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginTop: '30px' }}>
              
              {/* Applications Overview */}
              <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
                <h3 style={{ marginBottom: '20px' }}>My Active Applications</h3>
                {myApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
                    <AlertCircle size={40} style={{ marginBottom: '10px' }} />
                    <p>No active visa applications found.</p>
                    <button className="btn btn-outline" style={{ marginTop: '15px' }} onClick={() => setShowApplyModal(true)}>Apply Now</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {myApps.map((app) => (
                      <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{app.visaType}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '2px' }}>✈ {app.destinationCountry} • Passport: {app.passportNumber}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span className={`badge badge-${app.status.toLowerCase().replace(' ', '-')}`}>
                            {app.status}
                          </span>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => { setSelectedAppId(app.id); setActiveTab('visa-applications'); }}
                          >
                            Track
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Checklist quick view */}
              <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
                <h3 style={{ marginBottom: '20px' }}>Document Checklist</h3>
                {myApps.length === 0 ? (
                  <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>Submit an application to see document requirements.</p>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                      <select 
                        className="form-input" 
                        value={selectedAppId} 
                        onChange={(e) => setSelectedAppId(e.target.value)}
                        style={{ padding: '8px 12px' }}
                      >
                        {myApps.map(app => (
                          <option key={app.id} value={app.id}>{app.destinationCountry} ({app.visaType})</option>
                        ))}
                      </select>
                    </div>

                    {selectedAppForDocs && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {['Passport', 'Photograph', 'Aadhaar', 'PAN', 'Bank Statement', 'Income Proof', 'Offer Letter', 'Visa Documents'].map((reqDoc, idx) => {
                          const doc = selectedAppForDocs.documents.find(d => d.documentType === reqDoc);
                          return (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                              <span style={{ color: doc ? 'var(--text-dark)' : 'var(--text-medium)', fontWeight: doc ? 500 : 400 }}>{reqDoc}</span>
                              {doc ? (
                                <span style={{ color: 'var(--color-approved)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  ✓ Uploaded {doc.isVerified && '(Verified)'}
                                </span>
                              ) : (
                                <button 
                                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                  onClick={() => { setDocType(reqDoc); setActiveTab('upload-documents'); }}
                                >
                                  + Upload
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 2. VISA APPLICATIONS TAB */}
        {activeTab === 'visa-applications' && (
          <div>
            {myApps.length === 0 ? (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', background: 'white' }}>
                <AlertCircle size={40} style={{ color: 'var(--text-light)', marginBottom: '10px' }} />
                <h3 style={{ marginBottom: '10px' }}>No Applications Yet</h3>
                <p style={{ color: 'var(--text-medium)', marginBottom: '20px' }}>You haven't submitted any visa applications yet. Ready to start?</p>
                <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>Apply Now</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                
                {/* Left Side: Apps List */}
                <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
                  <h3 style={{ marginBottom: '15px' }}>Submitted Applications</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {myApps.map(app => (
                      <div 
                        key={app.id} 
                        style={{ 
                          padding: '16px', 
                          borderRadius: '12px', 
                          background: selectedAppId === app.id ? 'var(--primary-light)' : '#f8fafc',
                          border: selectedAppId === app.id ? '1px solid var(--primary-color)' : '1px solid #f1f5f9',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                        onClick={() => setSelectedAppId(app.id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{app.visaType}</h4>
                          <span className={`badge badge-${app.status.toLowerCase().replace(' ', '-')}`}>{app.status}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '8px' }}>
                          Destination: <strong>{app.destinationCountry}</strong>
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                          <span>Passport: {app.passportNumber}</span>
                          <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Timeline & Track */}
                <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
                  {selectedAppForDocs ? (
                    <div>
                      <h3 style={{ marginBottom: '20px' }}>Tracking: {selectedAppForDocs.destinationCountry}</h3>
                      <div style={{ marginBottom: '25px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>Current Status:</span>
                        <h4 style={{ fontSize: '1.25rem', marginTop: '4px', color: 'var(--primary-color)' }}>{selectedAppForDocs.status}</h4>
                      </div>

                      <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Application Timeline</h4>
                      
                      <div className="timeline-container">
                        {selectedAppForDocs.timeline.map((event, idx) => (
                          <div key={idx} className="timeline-item">
                            <div className={`timeline-dot ${event.status.replace(' ', '-')}`} />
                            <div className="timeline-meta">{new Date(event.date).toLocaleString()}</div>
                            <div className="timeline-title">{event.status}</div>
                            <div className="timeline-desc">{event.remarks}</div>
                          </div>
                        ))}
                      </div>

                      {/* Notes Box */}
                      {selectedAppForDocs.notes.length > 0 && (
                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                          <h4 style={{ marginBottom: '10px', fontSize: '0.95rem' }}>Executive Update Notes</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {selectedAppForDocs.notes.map((note, index) => (
                              <div key={index} style={{ padding: '12px', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-medium)', marginBottom: '4px' }}>
                                  <strong>{note.author}</strong>
                                  <span>{new Date(note.date).toLocaleDateString()}</span>
                                </div>
                                <p style={{ color: 'var(--text-dark)' }}>{note.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px' }}>Select an application to see tracking details.</p>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* 3. UPLOAD DOCUMENTS TAB */}
        {activeTab === 'upload-documents' && (
          <div>
            {myApps.length === 0 ? (
              <p style={{ color: 'var(--text-medium)' }}>Please submit a visa application before uploading documents.</p>
            ) : (
              <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
                <h3 style={{ marginBottom: '20px' }}>Upload Required Documents</h3>
                
                <div className="form-grid" style={{ marginBottom: '25px' }}>
                  <div className="form-group">
                    <label className="form-label">Select Visa Application</label>
                    <select 
                      className="form-input" 
                      value={selectedAppId} 
                      onChange={(e) => setSelectedAppId(e.target.value)}
                    >
                      {myApps.map(app => (
                        <option key={app.id} value={app.id}>{app.destinationCountry} ({app.visaType})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Document Type</label>
                    <select 
                      className="form-input" 
                      value={docType} 
                      onChange={(e) => setDocType(e.target.value)}
                    >
                      <option value="Passport">Passport (Front & Back Pages)</option>
                      <option value="Photograph">Passport-Sized Photograph</option>
                      <option value="Aadhaar">Aadhaar Card (National ID)</option>
                      <option value="PAN">PAN Card (Tax ID)</option>
                      <option value="Bank Statement">Last 3 Months Bank Statement</option>
                      <option value="Income Proof">Income Tax Returns (ITR)</option>
                      <option value="Offer Letter">Academic Offer / Corporate Invitation Letter</option>
                      <option value="Visa Documents">Other Supporting Travel Documents</option>
                    </select>
                  </div>
                </div>

                {/* Upload zone */}
                <div style={{ position: 'relative' }}>
                  <input 
                    type="file" 
                    id="file-upload-input" 
                    style={{ display: 'none' }} 
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload-input" className="file-upload-zone" style={{ display: 'block' }}>
                    <Upload size={32} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>Click to select files</h4>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Supports JPEG, PNG and PDF formats up to 2MB</p>
                  </label>
                </div>

                {/* Preview Grid */}
                {selectedAppForDocs && selectedAppForDocs.documents.length > 0 && (
                  <div style={{ marginTop: '30px' }}>
                    <h4 style={{ marginBottom: '15px' }}>Uploaded Files for this Application</h4>
                    <div className="upload-previews-grid">
                      {selectedAppForDocs.documents.map(doc => (
                        <div key={doc.id} className="glass-card upload-preview-card" style={{ background: '#f8fafc' }}>
                          <div className="preview-thumbnail">
                            {doc.fileUrl.startsWith('data:image/') || doc.fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                              <img src={doc.fileUrl} alt={doc.documentType} />
                            ) : (
                              <File size={36} style={{ color: 'var(--text-light)' }} />
                            )}
                          </div>
                          <div style={{ fontSize: '0.85rem' }}>
                            <strong style={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={doc.fileName}>{doc.fileName}</strong>
                            <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem', marginTop: '2px' }}>{doc.documentType}</span>
                            <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                              <span className={`badge badge-${doc.isVerified ? 'approved' : 'pending'}`} style={{ fontSize: '0.65rem' }}>
                                {doc.isVerified ? 'Verified' : 'Pending Verification'}
                              </span>
                              <button 
                                style={{ background: 'none', border: 'none', color: 'var(--color-rejected)', cursor: 'pointer' }}
                                onClick={() => deleteDocument(selectedAppId, doc.id)}
                                title="Delete document"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
            <h3 style={{ marginBottom: '20px' }}>My Account Profile Details</h3>
            <form onSubmit={handleProfileUpdate}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} required />
                </div>
              </div>

              <h4 style={{ marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', fontSize: '1rem', color: 'var(--primary-color)' }}>Passport Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <div className="form-group">
                  <label className="form-label">Passport Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. A12345678"
                    value={passportDetails.passportNumber} 
                    onChange={(e) => setPassportDetails({ ...passportDetails, passportNumber: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nationality</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. American"
                    value={passportDetails.nationality} 
                    onChange={(e) => setPassportDetails({ ...passportDetails, nationality: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={passportDetails.issueDate} 
                    onChange={(e) => setPassportDetails({ ...passportDetails, issueDate: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={passportDetails.expiryDate} 
                    onChange={(e) => setPassportDetails({ ...passportDetails, expiryDate: e.target.value })} 
                  />
                </div>
              </div>

              <h4 style={{ marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', fontSize: '1rem', color: 'var(--primary-color)' }}>Residential Address</h4>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 100 Main St"
                  value={address.street} 
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" className="form-input" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">State / Region</label>
                  <input type="text" className="form-input" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input type="text" className="form-input" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP / Postal Code</label>
                  <input type="text" className="form-input" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">Save Profile Changes</button>
            </form>
          </div>
        )}

        {/* 5. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
            <h3 style={{ marginBottom: '20px' }}>Alerts & Notifications Inbox</h3>
            {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '30px' }}>Your notification folder is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.filter(n => n.userId === currentUser.id).map(notif => (
                  <div key={notif.id} style={{ padding: '16px', borderRadius: '8px', background: notif.read ? '#f8fafc' : 'var(--primary-light)', borderLeft: '4px solid var(--primary-color)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: notif.read ? 400 : 600 }}>{notif.message}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginTop: '6px' }}>{new Date(notif.date).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* APPLY NEW VISA MODAL */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowApplyModal(false)}>×</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Apply For Visa Clearance</h3>
            <form onSubmit={handleApplySubmit}>
              
              <div className="form-group">
                <label className="form-label">Applicant Name (matching passport)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newApp.applicantName} 
                  onChange={(e) => setNewApp({ ...newApp, applicantName: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passport Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newApp.passportNumber} 
                  onChange={(e) => setNewApp({ ...newApp, passportNumber: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Visa Category</label>
                  <select 
                    className="form-input" 
                    value={newApp.visaType} 
                    onChange={(e) => setNewApp({ ...newApp, visaType: e.target.value })}
                  >
                    <option value="Tourist Visa">Tourist Visa</option>
                    <option value="Student Visa">Student Visa</option>
                    <option value="Work Visa">Work Visa</option>
                    <option value="Business Visa">Business Visa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Destination Country</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Germany, Japan"
                    value={newApp.destinationCountry} 
                    onChange={(e) => setNewApp({ ...newApp, destinationCountry: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboard;
