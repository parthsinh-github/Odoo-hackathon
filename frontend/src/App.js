/**
 * Main React app component with routing for admin, client, signup, and login.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApiProvider } from './contexts/ApiContext';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import AdminRoutes from './routes/AdminRoutes';
import ClientRoutes from './routes/ClientRoutes';

function App() {
  return (
    <ApiProvider>
      <Router>
        <div className="min-h-screen bg-neutral">
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/client/*" element={<ClientRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/" element={<SignUpPage />} />
          </Routes>
        </div>
      </Router>
    </ApiProvider>
  );
}

export default App;