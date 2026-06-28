import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toasts } = useDatabase();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle;
        if (toast.type === 'error') Icon = AlertTriangle;

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
export default Toast;
