import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Favorites from './pages/Favorites';
import Reservations from './pages/Reservations';
import UserManagement from './pages/UserManagement';
import AddBook from './pages/AddBook';

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <Books />;
      case 'favorites':
        return currentUser.role === 'admin' ? <Dashboard/> :<Favorites setCurrentView={setCurrentView}/>;
      case 'reservations':
        return <Reservations setContentView={setCurrentView}/>;
      case 'users':
        return currentUser.role === 'admin' ? <UserManagement /> : <Dashboard />;
      case 'add-book':
        return currentUser.role === 'admin' ? <AddBook /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <main className="transition-colors duration-200">
        {renderCurrentView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;