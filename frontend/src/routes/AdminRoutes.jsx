import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />} />
      {/* Add more admin-specific routes here */}
    </Routes>
  );
};

export default AdminRoutes;
