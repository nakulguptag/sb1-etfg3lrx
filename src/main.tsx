import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { NotificationProvider } from './context/NotificationContext';

// ✅ Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      (registration) => {
        console.log('✅ Service Worker registered: ', registration.scope);
      },
      (error) => {
        console.error('❌ Service Worker registration failed: ', error);
      }
    );
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </React.StrictMode>
);
