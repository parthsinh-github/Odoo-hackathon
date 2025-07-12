import React, { createContext, useContext } from 'react';

const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const API_URL = 'http://localhost:5000/api';

  return (
    <ApiContext.Provider value={{ API_URL }}>
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export { ApiProvider, useApi };
