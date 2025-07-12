import React from 'react';
import { User, Settings } from 'lucide-react';

const ClientDashboard = () => {
  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <header className="bg-secondary text-white p-4">
        <h1 className="text-xl font-bold">Client Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
            
            {/* Profile Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer w-64 h-64 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-teal rounded-full flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-neutral">Profile</h3>
            </div>

            {/* Settings Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer w-64 h-64 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-neutral">Settings</h3>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark-neutral text-white p-4 mt-8">
        <p className="text-center text-sm">&copy; 2025 Client Dashboard</p>
      </footer>
    </div>
  );
};

export default ClientDashboard;