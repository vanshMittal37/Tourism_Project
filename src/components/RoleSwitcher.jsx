import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Shield, User, Award } from 'lucide-react';

export const RoleSwitcher = ({ setView }) => {
  const { currentUser, switchDemoRole } = useDatabase();

  const handleSwitch = (role, view) => {
    switchDemoRole(role);
    setView(view);
  };

  return (
    <div className="role-switcher">
      <span style={{ marginRight: '4px' }}>Switch Role:</span>
      <button 
        className={`role-btn ${currentUser?.role === 'Customer' ? 'active' : ''}`}
        onClick={() => handleSwitch('Customer', 'customer-dashboard')}
        title="Switch to Customer perspective"
      >
        <User size={12} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
        Customer
      </button>
      <button 
        className={`role-btn ${currentUser?.role === 'CRM Executive' ? 'active' : ''}`}
        onClick={() => handleSwitch('CRM Executive', 'crm-dashboard')}
        title="Switch to CRM Executive perspective"
      >
        <Award size={12} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
        CRM Exec
      </button>
      <button 
        className={`role-btn ${currentUser?.role === 'Admin' ? 'active' : ''}`}
        onClick={() => handleSwitch('Admin', 'admin-dashboard')}
        title="Switch to Admin perspective"
      >
        <Shield size={12} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
        Admin
      </button>
    </div>
  );
};

export default RoleSwitcher;
