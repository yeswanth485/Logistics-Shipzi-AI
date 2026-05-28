"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#0f172a',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#0f172a',
          },
        },
      }}
    />
  );
}
