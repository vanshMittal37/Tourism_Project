import React, { useState, useEffect } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import LandingPage from './views/LandingPage';
import AuthPages from './views/AuthPages';
import CustomerDashboard from './views/CustomerDashboard';
import CrmDashboard from './views/CrmDashboard';
import AdminDashboard from './views/AdminDashboard';
import RoleSwitcher from './components/RoleSwitcher';
import Toast from './components/Toast';

const AppContent = () => {
  const { currentUser } = useDatabase();
  const [view, setView] = useState('landing');

  // Sync route view with auth state changes (e.g. login redirection or role switches)
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Admin') setView('admin-dashboard');
      else if (currentUser.role === 'CRM Executive') setView('crm-dashboard');
      else setView('customer-dashboard');
    } else {
      // If logged out and on a dashboard, go back to landing page
      if (['customer-dashboard', 'crm-dashboard', 'admin-dashboard'].includes(view)) {
        setView('landing');
      }
    }
  }, [currentUser]);

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage setView={setView} />;
      case 'login':
        return <AuthPages initialTab="login" setView={setView} />;
      case 'register':
        return <AuthPages initialTab="register" setView={setView} />;
      case 'customer-dashboard':
        return <CustomerDashboard setView={setView} />;
      case 'crm-dashboard':
        return <CrmDashboard setView={setView} />;
      case 'admin-dashboard':
        return <AdminDashboard setView={setView} />;
      default:
        return <LandingPage setView={setView} />;
    }
  };

  return (
    <>
      {/* Toast notifications rendering on top of the layout */}
      <Toast />
      
      {/* Render the active screen view */}
      {renderView()}

      {/* Floating Demo Role Switcher at bottom-right viewport (for reviewer convenience) */}
      <RoleSwitcher setView={setView} />
    </>
  );
};

function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}

export default App;
