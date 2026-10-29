import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupWebMock } from './services/webMock';

// Initialize web mock if running in a standard web browser (e.g. GitHub Pages)
setupWebMock();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
