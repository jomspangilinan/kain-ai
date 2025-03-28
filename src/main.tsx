import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { FoodLogsProvider } from "./context/FoodLogsContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <FoodLogsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FoodLogsProvider>
    </AuthProvider>
  </React.StrictMode>
);