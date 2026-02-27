import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Menu, X, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/', label: 'Trang chủ' },
  { path: '/luat-bien', label: 'Luật biển' },
  { path: '/ban-do', label: 'Bản đồ' },
  { path: '/lich-su', label: 'Lịch sử' },
  { path: '/dong-thoi-gian', label: 'Timeline' },
  { path: '/kiem-tra', label: 'Trắc nghiệm' },
  { path: '/thong-ke', label: 'Thống kê' },
  { path: '/tin-tuc', label: 'Tin tức' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-700 p-2 rounded-xl text-white shadow-lg">
              <Anchor size={28} />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tighter text-blue-900 dark:text-white block leading-none">OceanMind</span>
              <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">Luật biển Việt Nam</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase tracking-wide">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-all pb-1 border-b-2 ${
                  location.pathname === item.path
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
