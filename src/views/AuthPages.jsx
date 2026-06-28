import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Plane, Mail, Lock, Phone, User, Eye, EyeOff } from 'lucide-react';

export const AuthPages = ({ initialTab = 'login', setView }) => {
  const { login, register } = useDatabase();
  const [tab, setTab] = useState(initialTab);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('Customer'); // Customer by default
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      // Redirect based on role
      if (res.user.role === 'Admin') setView('admin-dashboard');
      else if (res.user.role === 'CRM Executive') setView('crm-dashboard');
      else setView('customer-dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!regName || !regEmail || !regPhone || !regPassword || !regConfirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    
    if (regPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    const res = register(regName, regEmail, regPhone, regPassword, regRole);
    if (res.success) {
      // Redirect based on role
      if (res.user.role === 'Admin') setView('admin-dashboard');
      else if (res.user.role === 'CRM Executive') setView('crm-dashboard');
      else setView('customer-dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(circle at 10% 20%, rgba(224, 242, 254, 0.4) 0%, rgba(243, 244, 246, 0.8) 90%), url("https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1600&q=80") no-repeat center center/cover',
      position: 'relative'
    }}>
      
      {/* Back to Home Link */}
      <button 
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          background: 'white',
          border: '1px solid #cbd5e1',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}
        onClick={() => setView('landing')}
      >
        <Plane size={14} style={{ transform: 'rotate(-45deg)' }} />
        Back to Website
      </button>

      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '40px', background: 'rgba(255, 255, 255, 0.85)' }}>
        
        {/* Logo and Greeting */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--primary-color)',
            color: 'white',
            marginBottom: '15px'
          }}>
            <Plane size={24} style={{ transform: 'rotate(45deg)' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '5px' }}>
            {tab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
            {tab === 'login' ? 'Manage your visa applications and schedules' : 'Join us for streamlined travel approvals'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '25px' }}>
          <button 
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid var(--primary-color)' : '2px solid transparent',
              fontWeight: 600,
              color: tab === 'login' ? 'var(--primary-color)' : 'var(--text-medium)',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all var(--transition-fast)'
            }}
            onClick={() => { setTab('login'); setErrorMsg(''); }}
          >
            Sign In
          </button>
          <button 
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid var(--primary-color)' : '2px solid transparent',
              fontWeight: 600,
              color: tab === 'register' ? 'var(--primary-color)' : 'var(--text-medium)',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all var(--transition-fast)'
            }}
            onClick={() => { setTab('register'); setErrorMsg(''); }}
          >
            Register
          </button>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '20px',
            border: '1px solid #fca5a5'
          }}>
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '45px' }}
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }} onClick={() => alert('Forgot Password placeholder')}>Forgot Password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input" 
                  style={{ paddingLeft: '45px', paddingRight: '45px' }}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Sign In
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '45px' }}
                  placeholder="e.g. John Doe"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '45px' }}
                  placeholder="john@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="tel" 
                  className="form-input" 
                  style={{ paddingLeft: '45px' }}
                  placeholder="+1 555-0123"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Desired User Role (Demo Choice)</label>
              <select 
                className="form-input" 
                value={regRole} 
                onChange={(e) => setRegRole(e.target.value)}
                style={{ appearance: 'auto', background: 'white' }}
              >
                <option value="Customer">Customer (Apply Visas, Upload Docs)</option>
                <option value="CRM Executive">CRM Executive (Manage Leads, Follow-ups)</option>
                <option value="Admin">Administrator (Approve, Reports, Config)</option>
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Create Account
            </button>
          </form>
        )}

        {/* Quick Helper Credentials in Login Tab */}
        {tab === 'login' && (
          <div style={{
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            color: 'var(--text-medium)',
            textAlign: 'left'
          }}>
            <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dark)' }}>Demo Accounts:</strong>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>👤 <strong>Customer:</strong> <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>customer@travel.com</code> / <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>cust123</code></li>
              <li>💼 <strong>CRM Exec:</strong> <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>executive@travel.com</code> / <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>exec123</code></li>
              <li>🛡️ <strong>Admin:</strong> <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>admin@travel.com</code> / <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>admin123</code></li>
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthPages;
