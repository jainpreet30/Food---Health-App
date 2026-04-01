import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Utensils, Activity, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Meals', path: '/meals', icon: Utensils },
    { name: 'Workout', path: '/workout', icon: Activity },
    { name: 'Coach', path: '/coach', icon: Sparkles },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black gradient-text flex items-center gap-2">
          <Activity className="text-primary" />
          AURA HEALTH
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-2 font-medium transition-all hover:text-primary",
                location.pathname === item.path ? "text-primary" : "text-gray-400"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-b border-white/10 p-4 space-y-4 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all",
                location.pathname === item.path ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/5 rounded-xl"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full text-white pt-24 pb-12 px-6">
      <Navbar />
      <main className="max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
