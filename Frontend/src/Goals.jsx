import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdReceiptLong,
  MdShowChart,
  MdFlag,
  MdBarChart,
  MdSettings,
  MdAdd,
  MdSearch,
  MdNotifications,
  MdAccountBalance,
  MdMenu,
  MdClose,
  MdEdit,
  MdDelete,
  MdMoreVert,
  MdCheckCircle,
  MdTrendingUp,
  MdTrendingDown,
  MdPerson,
  MdArrowUpward,
  MdLogin,
  MdDarkMode,
  MdLightMode,
} from 'react-icons/md';
import { API_URL } from './config/api';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { useCurrency } from './contexts/CurrencyContext';
import NotificationDropdown from './components/NotificationDropdown';

const categoryIcons = {
  'Savings': '💰',
  'Vehicle': '🚗',
  'Travel': '✈️',
  'Housing': '🏠',
  'Education': '🎓',
  'Health': '🏥',
  'Other': '🎯',
};

const allCategories = ['All', 'Savings', 'Vehicle', 'Travel', 'Housing', 'Education', 'Health', 'Other'];

const categoryColors = {
  'Savings': 'bg-emerald-500',
  'Vehicle': 'bg-blue-500',
  'Travel': 'bg-orange-500',
  'Housing': 'bg-purple-500',
  'Education': 'bg-amber-500',
  'Health': 'bg-red-500',
  'Other': 'bg-primary',
};

// Add/Edit Goal Modal Component
const GoalModal = ({ isOpen, onClose, onSubmit, goal = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '',
    deadline: '',
    category: 'Savings',
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        target: goal.target || '',
        current: goal.current || '',
        deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
        category: goal.category || 'Savings',
      });
    } else {
      setFormData({
        name: '',
        target: '',
        current: '',
        deadline: '',
        category: 'Savings',
      });
    }
  }, [goal, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target) return;
    
    const icon = categoryIcons[formData.category] || '🎯';
    
    onSubmit({
      ...(goal && { id: goal._id || goal.id }),
      name: formData.name,
      target: parseFloat(formData.target),
      current: formData.current ? parseFloat(formData.current) : 0,
      icon,
      color: categoryColors[formData.category] || 'bg-primary',
      deadline: formData.deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: formData.category,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0a140d] border border-slate-200 dark:border-emerald-900/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-emerald-900/30">
          <h2 className="text-xl font-bold">{goal ? 'Edit Goal' : 'Add New Goal'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-emerald-100 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
            <MdClose className="text-xl" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">Goal Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="e.g., Emergency Fund"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="custom-select"
            >
              {allCategories.filter(c => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{categoryIcons[cat] || '🎯'} {cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">Target Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50">{currencyConfig.symbol}</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">Current Savings</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50">{currencyConfig.symbol}</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">Target Date</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-emerald-800/50 text-slate-600 dark:text-emerald-100 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-900/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              {goal ? 'Save Changes' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Funds Modal Component
const AddFundsModal = ({ isOpen, onClose, onAddFunds, goal }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const { currencyConfig } = useCurrency();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    onAddFunds(goal._id || goal.id, parseFloat(amount));
    setAmount('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0a140d] border border-slate-200 dark:border-emerald-900/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-emerald-900/30">
          <h2 className="text-xl font-bold">Add Funds</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-emerald-100 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
            <MdClose className="text-xl" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <div className="size-12 rounded-xl bg-slate-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl">
              {goal?.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-emerald-500/60">Adding to</p>
              <p className="font-bold">{goal?.name}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50">{currencyConfig.symbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(''); }}
                  className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-emerald-800/50 text-slate-600 dark:text-emerald-100 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-900/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <MdArrowUpward /> Add Funds
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Goal Card Component
const GoalCard = ({ goal, onAddFunds, onEdit, onDelete }) => {
  const { currencyConfig } = useCurrency();
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const isCompleted = goal.current >= goal.target;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm p-4 sm:p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-xl bg-slate-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl">
            {goal.icon}
          </div>
          <div>
            <h4 className="font-bold text-lg">{goal.name}</h4>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-emerald-500/60">{goal.category}</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <MdMoreVert className="text-xl" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#0a140d] border border-slate-200 dark:border-emerald-900/30 rounded-xl shadow-lg py-1 z-20 min-w-[120px]">
                <button onClick={() => { onEdit(goal); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-emerald-100 hover:bg-slate-100 dark:hover:bg-emerald-900/20">
                  <MdEdit /> Edit
                </button>
                <button onClick={() => { onDelete(goal._id || goal.id); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <MdDelete /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <span className="text-xs sm:text-sm text-slate-500 dark:text-emerald-500/60">Progress</span>
          <span className="text-xs sm:text-sm font-bold">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-primary' : goal.color}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 dark:text-emerald-500/60">Saved</p>
          <p className="text-lg sm:text-xl font-bold">{currencyConfig.symbol}{goal.current?.toLocaleString() || 0}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 dark:text-emerald-500/60">Target</p>
          <p className="text-lg sm:text-xl font-bold">{currencyConfig.symbol}{goal.target?.toLocaleString() || 0}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-emerald-900/30">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <MdCheckCircle className="text-base" /> Completed
            </span>
          ) : (
            <span className={`text-xs font-medium ${daysLeft < 30 ? 'text-orange-500' : 'text-slate-500 dark:text-emerald-500/60'}`}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
            </span>
          )}
        </div>
        <button 
          onClick={() => onAddFunds(goal)}
          className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"
        >
          <MdArrowUpward /> Add Funds
        </button>
      </div>
    </div>
  );
};

// Sidebar Navigation Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/' },
    { name: 'Transactions', icon: MdReceiptLong, path: '/transactions' },
    { name: 'Investments', icon: MdShowChart, path: '/investments' },
    { name: 'Goals', icon: MdFlag, path: '/goals', active: true },
    { name: 'Reports', icon: MdBarChart, path: '/reports' },
    { name: 'Settings', icon: MdSettings, path: '/settings' },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0a140d] border-r border-slate-200 dark:border-emerald-900/30 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark">
              <MdAccountBalance className="text-xl font-bold" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">CashCompass</h1>
              <p className="text-xs text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider font-semibold">Premium</p>
            </div>
          </div>
          <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-lg" onClick={() => setIsOpen(false)}>
            <MdClose className="text-xl" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-emerald-100/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20'}`}>
              <item.icon className="text-xl" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 mt-auto">
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-background-dark font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity">
            <MdPerson className="text-xl" />
            <span className="text-sm">Profile</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// Header Component
const Header = ({ onMenuClick, searchTerm, onSearchChange }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4 lg:py-6 border-b border-slate-200 dark:border-emerald-900/30 flex items-center justify-between gap-4">
      <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30 rounded-lg" onClick={onMenuClick}>
        <MdMenu className="text-xl" />
      </button>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-xl lg:text-2xl font-bold">Financial Goals</h2>
        <p className="text-slate-500 dark:text-emerald-500/60 text-sm hidden sm:block">Track your savings progress</p>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50 text-xl" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-primary focus:border-primary transition-all w-48 lg:w-64"
            placeholder="Search goals..."
            type="text"
          />
        </div>
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30 rounded-lg"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
        </button>
        <NotificationDropdown darkMode={darkMode} />
        <div className="size-8 sm:size-10 rounded-full bg-slate-200 dark:bg-emerald-900 overflow-hidden border border-slate-200 dark:border-emerald-800/50">
          <img className="w-full h-full object-cover" alt="User profile" src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=13ec5b&color=1a1a1a`} />
        </div>
      </div>
    </header>
  );
};

// Summary Stats Component
const SummaryStats = ({ goals }) => {
  const { currencyConfig } = useCurrency();
  const totalTarget = goals.reduce((sum, g) => sum + (g.target || 0), 0);
  const totalSaved = goals.reduce((sum, g) => sum + (g.current || 0), 0);
  const completedGoals = goals.filter(g => (g.current || 0) >= (g.target || 0)).length;
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Total Target</span>
          <div className="size-8 sm:size-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
            <MdFlag className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{currencyConfig.symbol}{totalTarget.toLocaleString()}</h3>
      </div>
      
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Total Saved</span>
          <div className="size-8 sm:size-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center text-emerald-600 dark:text-primary">
            <MdTrendingUp className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{currencyConfig.symbol}{totalSaved.toLocaleString()}</h3>
      </div>
      
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Overall Progress</span>
          <div className="size-8 sm:size-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
            <MdBarChart className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{overallProgress.toFixed(1)}%</h3>
      </div>
      
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Completed</span>
          <div className="size-8 sm:size-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
            <MdCheckCircle className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{completedGoals}<span className="text-lg sm:text-xl text-slate-400 dark:text-emerald-500/60">/{goals.length}</span></h3>
      </div>
    </div>
  );
};

// Main Goals Page Component
function Goals() {
  const { user } = useAuth();
  const { formatAmount, currencies } = useCurrency();
  const currencyConfig = currencies[localStorage.getItem('currency') || 'USD'];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  }, []);

  const hasToken = () => !!localStorage.getItem('token');

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/goals`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        // Map backend field names to frontend field names
        const mappedGoals = data.map(goal => ({
          _id: goal._id,
          id: goal._id,
          name: goal.name,
          target: goal.targetAmount,
          current: goal.currentAmount,
          deadline: goal.deadline,
          category: goal.category,
          icon: goal.icon,
          color: goal.color,
          status: goal.status,
        }));
        setGoals(mappedGoals);
        setError('');
      } else if (response.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError(data.message || 'Failed to fetch goals');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAddGoal = async (goalData) => {
    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(goalData),
      });
      const data = await response.json();
      if (response.ok) {
        // Map backend field names to frontend field names
        const mappedGoal = {
          _id: data._id,
          id: data._id,
          name: data.name,
          target: data.targetAmount,
          current: data.currentAmount,
          deadline: data.deadline,
          category: data.category,
          icon: data.icon,
          color: data.color,
          status: data.status,
        };
        setGoals([mappedGoal, ...goals]);
      } else {
        setError(data.message || 'Failed to add goal');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleUpdateGoal = async (goalData) => {
    try {
      const response = await fetch(`${API_URL}/goals/${goalData.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(goalData),
      });
      const data = await response.json();
      if (response.ok) {
        // Map backend field names to frontend field names
        const mappedGoal = {
          _id: data._id,
          id: data._id,
          name: data.name,
          target: data.targetAmount,
          current: data.currentAmount,
          deadline: data.deadline,
          category: data.category,
          icon: data.icon,
          color: data.color,
          status: data.status,
        };
        setGoals(goals.map(g => (g._id === data._id || g.id === data.id ? mappedGoal : g)));
      } else {
        setError(data.message || 'Failed to update goal');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setGoals(goals.filter(g => (g._id || g.id) !== goalId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete goal');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleAddFunds = async (goalId, amount) => {
    try {
      const response = await fetch(`${API_URL}/goals/${goalId}/add-funds`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (response.ok) {
        // Map backend field names to frontend field names
        const mappedGoal = {
          _id: data._id,
          id: data._id,
          name: data.name,
          target: data.targetAmount,
          current: data.currentAmount,
          deadline: data.deadline,
          category: data.category,
          icon: data.icon,
          color: data.color,
          status: data.status,
        };
        setGoals(goals.map(g => ((g._id || g.id) === goalId ? mappedGoal : g)));
      } else {
        setError(data.message || 'Failed to add funds');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const openEditModal = (goal) => {
    setSelectedGoal(goal);
    setShowEditModal(true);
  };

  const openFundsModal = (goal) => {
    setSelectedGoal(goal);
    setShowFundsModal(true);
  };

  const filteredGoals = goals.filter(g => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch = g.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <Header onMenuClick={() => setSidebarOpen(true)} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <SummaryStats goals={goals} />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 text-slate-600 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-900/30'
                  }`}
                >
                  {cat === 'All' ? 'All Goals' : `${categoryIcons[cat] || '🎯'} ${cat}`}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-primary text-background-dark font-bold py-2.5 px-4 sm:px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              <MdAdd className="text-lg sm:text-xl" />
              <span className="text-sm sm:text-base">Add Goal</span>
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : !hasToken() ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="size-20 bg-slate-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <MdLogin className="text-4xl text-slate-400 dark:text-emerald-500/50" />
              </div>
              <h3 className="text-lg font-bold mb-2">Login Required</h3>
              <p className="text-slate-500 dark:text-emerald-500/60 mb-4">
                Please login to view and manage your financial goals
              </p>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-primary text-background-dark font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity"
              >
                <MdLogin /> Login to Continue
              </Link>
            </div>
          ) : error && error.toLowerCase().includes('login') ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="size-20 bg-slate-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <MdFlag className="text-4xl text-slate-400 dark:text-emerald-500/50" />
              </div>
              <h3 className="text-lg font-bold mb-2">No goals found</h3>
              <p className="text-slate-500 dark:text-emerald-500/60 mb-4">
                {searchTerm || selectedCategory !== 'All' ? 'Try adjusting your filters' : 'Start by adding your first financial goal'}
              </p>
              {!searchTerm && selectedCategory === 'All' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-primary text-background-dark font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <MdAdd /> Add Your First Goal
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal._id || goal.id}
                  goal={goal}
                  onAddFunds={openFundsModal}
                  onEdit={openEditModal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <GoalModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddGoal} />
      {selectedGoal && (
        <>
          <GoalModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onSubmit={handleUpdateGoal} goal={selectedGoal} />
          <AddFundsModal isOpen={showFundsModal} onClose={() => setShowFundsModal(false)} onAddFunds={handleAddFunds} goal={selectedGoal} />
        </>
      )}
    </div>
  );
}

export default Goals;
