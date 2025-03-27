import React, { useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { ToastContext } from 'context/ToastContext';

type Toast = {
    open: boolean;
    severity: AlertColor;
    message: string;
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<Toast>({
      message: '',
      severity: 'info',
      open: false,
    });
  
    const showToast = (message: string, severity: AlertColor = 'info') => {
      setToast({ message, severity, open: true });
    };
  
    const handleClose = () => {
      setToast((prev) => ({ ...prev, open: false }));
    };
  
    return (
      <ToastContext.Provider value={{ showToast }}>
        {children}
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={toast.severity}>
            {toast.message}
          </Alert>
        </Snackbar>
      </ToastContext.Provider>
    );
  };