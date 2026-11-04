import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupWebMock } from './services/webMock';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Initialize web mock if running in a standard web browser (e.g. GitHub Pages)
setupWebMock();

// Register PWA Service Worker
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        console.log('Chirmo PWA Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('PWA Service Worker registration skipped:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
