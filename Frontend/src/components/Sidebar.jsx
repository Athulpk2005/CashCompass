import { Link, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdReceiptLong,
  MdShowChart,
  MdFlag,
  MdBarChart,
  MdSettings,
} from 'react-icons/md';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { darkMode } = useTheme();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/' },
    { name: 'Transactions', icon: MdReceiptLong, path: '/transactions' },
    { name: 'Investments', icon: MdShowChart, path: '/investments' },
    { name: 'Goals', icon: MdFlag, path: '/goals' },
    { name: 'Reports', icon: MdBarChart, path: '/reports' },
    { name: 'Settings', icon: MdSettings, path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0a140d] border-r border-slate-200 dark:border-emerald-900/30 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark">
              <MdSettings className="text-xl font-bold" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">CashCompass</h1>
              <p className="text-xs text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider font-semibold">Finance Tracker</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <MdSettings className="text-xl" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-emerald-100/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20'}`}
            >
              <item.icon className="text-xl" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-200 dark:border-emerald-900/30">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm mb-2">Upgrade to Premium</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mb-3">Get advanced analytics and reports</p>
            <button className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
