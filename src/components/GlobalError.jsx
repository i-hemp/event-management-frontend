import React from 'react';
import { useError } from '../context/ErrorContext';

const GlobalError = () => {
  const { error } = useError();

  if (!error) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#ef4444', // Red-500
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease-out',
      maxWidth: '80%',
      fontWeight: '500'
    }}>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      {error}
    </div>
  );
};

export default GlobalError;
