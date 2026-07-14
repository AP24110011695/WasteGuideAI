import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Leaf, Home, Camera, History, LayoutDashboard, MapPin, LogOut, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home, public: true },
    { path: '/scanner', label: 'Scanner', icon: Camera, public: false },
    { path: '/history', label: 'History', icon: History, public: false },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, public: false },
    { path: '/centers', label: 'Collection Centers', icon: MapPin, public: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="bg-emerald-500/20 p-2 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
                <Leaf className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-white font-bold text-xl tracking-wide">WasteGuide<span className="text-emerald-400">AI</span></span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navLinks.map((link) => (
                  (link.public || currentUser) && (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </NavLink>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {currentUser ? (
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 text-slate-300 hover:text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 hover:bg-emerald-400/10 px-3 py-2 rounded-lg text-sm font-medium transition-all">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link to="/signup" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-900/20">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                (link.public || currentUser) && (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </NavLink>
                )
              ))}
              <div className="pt-4 mt-2 border-t border-slate-800">
                {currentUser ? (
                  <button 
                    onClick={() => { handleLogout(); toggleMenu(); }} 
                    className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={toggleMenu} className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <LogIn className="w-5 h-5" />
                      Login
                    </Link>
                    <Link to="/signup" onClick={toggleMenu} className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 transition-colors">
                      <UserPlus className="w-5 h-5" />
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
