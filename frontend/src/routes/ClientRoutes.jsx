import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientLayout from '../layout/ClientLayout';

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
  {/* Add more nested client routes here */}
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
