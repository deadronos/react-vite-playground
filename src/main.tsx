import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// HTML must provide a div with id 'root'
const container = document.getElementById('root');
const root = createRoot(container!);

// Wrap in StrictMode for highlighting potential problems

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


