import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { PublicMenu } from './components/PublicMenu';
import { AdminPanel } from './components/AdminPanel';
import { TableView } from './components/TableView';
import { DayEndReport } from './components/DayEndReport';
import { LoginForm } from './components/LoginForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import {  LogOut } from 'lucide-react';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';

function NavBar() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="ml-2 text-xl font-semibold">İSPİROĞLU CAFE DÜNYASI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Menü
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/tables"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Masalar
                </Link>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Yönetici Paneli
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sistemden Çık
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const currentDayEnd = useStore((state) => state.currentDayEnd);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<PublicMenu />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables"
              element={
                <ProtectedRoute>
                  <TableView />
                </ProtectedRoute>
              }
            />
          </Routes>
          {currentDayEnd && <DayEndReport />}
        </main>
      </div>
    </Router>
  );
}

export default App;