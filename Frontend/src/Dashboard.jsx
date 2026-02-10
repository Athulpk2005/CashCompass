import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdReceiptLong,
  MdTrendingUp,
  MdTrendingDown,
  MdShoppingBag,
  MdRestaurant,
  MdWork,
  MdDirectionsCar,
  MdSearch,
  MdNotifications,
  MdAccountBalance,
  MdPayments,
  MdShoppingCart,
  MdSettings,
  MdBarChart,
  MdShowChart,
  MdFlag,
  MdMenu,
  MdClose,
  MdDarkMode,
  MdLightMode,
  MdPerson,
  MdLogout,
  MdAdd,
  MdWarning,
  MdPieChart,
  MdLocalHospital,
  MdHome,
  MdMovie,
  MdArrowUpward,
  MdArrowDownward,
} from 'react-icons/md';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { useNotification } from './contexts/NotificationContext';
import { useCurrency } from './contexts/CurrencyContext';
import NotificationDropdown from './components/NotificationDropdown';
import { API_URL } from './config/api';

// Sidebar Navigation Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/' },
    { name: 'Transactions', icon: MdReceiptLong, path: '/transactions' },
    { name: 'Investments', icon: MdShowChart, path: '/investments' },
    { name: 'Goals', icon: MdFlag, path: '/goals' },
    { name: 'Reports', icon: MdBarChart, path: '/reports' },
    { name: 'Settings', icon: MdSettings, path: '/settings' },
  ];

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
              <MdAccountBalance className="text-xl font-bold" />
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
            <MdClose className="text-xl" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-emerald-100/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20'
              }`}
            >
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
  const { user, logout } = useAuth();
  const { fetchNotifications } = useNotification();
  const navigate = useNavigate();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Generate avatar URL based on user name
  const getAvatarUrl = (name) => {
    const defaultName = name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultName)}&background=13ec5b&color=1a1a1a`;
  };
  
  return (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4 lg:py-6 border-b border-slate-200 dark:border-emerald-900/30 flex items-center justify-between gap-4">
      <button 
        className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30 rounded-lg"
        onClick={onMenuClick}
      >
        <MdMenu className="text-xl" />
      </button>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-xl lg:text-2xl font-bold hidden sm:block">Dashboard Overview</h2>
        <h2 className="text-xl lg:text-2xl font-bold sm:hidden">Dashboard</h2>
        <p className="text-slate-500 dark:text-emerald-500/60 text-sm hidden sm:block">Welcome back, {user?.name || 'Alex'}. Your finances are looking good.</p>
        <p className="text-slate-500 dark:text-emerald-500/60 text-sm sm:hidden">Welcome back, {user?.name || 'Alex'}.</p>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50 text-xl" />
          <input
            className="bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-primary focus:border-primary transition-all w-48 lg:w-64"
            placeholder="Search..."
            type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
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
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30 rounded-lg"
          title="Logout"
        >
          <MdLogout className="text-xl" />
        </button>
        <div className="size-8 sm:size-10 rounded-full bg-slate-200 dark:bg-emerald-900 overflow-hidden border border-slate-200 dark:border-emerald-800/50">
          <img
            className="w-full h-full object-cover"
            alt="User profile"
            src={user?.profileImage || getAvatarUrl(user?.name)}
          />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLogoutModal(false)}>
          <div 
            className="bg-white dark:bg-[#0a140d] rounded-xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="size-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <MdWarning className="text-3xl text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Confirm Logout</h3>
              <p className="text-slate-500 dark:text-emerald-500/60 mb-6">Are you sure you want to logout? You will need to login again to access your account.</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-emerald-800 rounded-lg text-sm font-medium text-slate-600 dark:text-emerald-100/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Stats Card Component
const StatsCard = ({ title, amount, change, changeType, icon: Icon, iconColor }) => {
  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">{title}</span>
        <div className={`size-8 sm:size-8 ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon className="text-lg sm:text-xl" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{amount}</h3>
        {change && (
          <p className={`text-xs sm:text-sm font-medium ${changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'}`}>
            {changeType === 'increase' ? '+' : '-'}{change}% from last month
          </p>
        )}
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl hover:shadow-md transition-all text-left group"
  >
    <div className={`size-10 sm:size-12 ${color} rounded-lg flex items-center justify-center text-white shrink-0`}>
      <Icon className="text-lg sm:text-xl" />
    </div>
    <div className="min-w-0">
      <p className="font-bold text-slate-800 dark:text-emerald-100 truncate">{label}</p>
      <p className="text-xs text-slate-500 dark:text-emerald-500/60">Click to add</p>
    </div>
  </button>
);

// Donut Chart Component
const DonutChart = () => {
  const { darkMode } = useTheme();
  const { formatAmount } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  const categories = {};
  expenseTransactions.forEach((t) => {
    const category = t.category || 'Other';
    categories[category] = (categories[category] || 0) + (t.amount || 0);
  });

  const categoryColors = {
    'Food & Dining': { light: '#10b981', dark: '#4ade80' },
    Food: { light: '#059669', dark: '#22c55e' },
    Shopping: { light: '#6366f1', dark: '#a5b4fc' },
    Transportation: { light: '#f59e0b', dark: '#fbbf24' },
    Entertainment: { light: '#ec4899', dark: '#f9a8d4' },
    Utilities: { light: '#3b82f6', dark: '#93c5fd' },
    Health: { light: '#ef4444', dark: '#fca5a5' },
    Housing: { light: '#8b5cf6', dark: '#c4b5fd' },
    Education: { light: '#14b8a6', dark: '#5eead4' },
    Travel: { light: '#f97316', dark: '#fdba74' },
    Personal: { light: '#a855f7', dark: '#d8b4fe' },
    Other: { light: '#6b7280', dark: '#d1d5db' },
  };

  const getColor = (category) => {
    const color = categoryColors[category];
    return color ? (darkMode ? color.dark : color.light) : '#9ca3af';
  };

  const formatCategoryAmount = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0';
    return formatAmount(amount);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-center">
          <div className="size-40 bg-slate-200 dark:bg-emerald-900/40 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg">Spending by Category</h4>
        <Link to="/transactions" className="text-sm font-bold text-primary hover:underline underline-offset-4">View All</Link>
      </div>
      
      {expenseTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MdPieChart className="text-4xl text-slate-400 dark:text-emerald-500/50 mb-2" />
          <p className="text-slate-500 dark:text-emerald-500/60">Add your first expense to see the breakdown</p>
          <Link to="/transactions" className="mt-2 text-primary font-medium hover:underline">Go to Transactions</Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Donut Chart */}
          <div className="relative size-40 shrink-0">
            <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle cx="18" cy="18" r="15.91549430918954" fill="none" stroke={darkMode ? '#374151' : '#e2e8f0'} strokeWidth="3" />
              {/* Colored segments */}
              {Object.entries(categories).map(([category, amount], index) => {
                const percentage = (amount / totalExpenses) * 100;
                const strokeDasharray = `${percentage} 100`;
                const strokeDashoffset = Object.entries(categories)
                  .slice(0, index)
                  .reduce((sum, [, catAmount]) => sum - (catAmount / totalExpenses) * 100, 0);
                const color = getColor(category);
                
                return (
                  <circle
                    key={category}
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke={color}
                    strokeWidth="3.5"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-800 dark:text-emerald-100">{formatAmount(totalExpenses)}</span>
              <span className="text-xs text-slate-500 dark:text-emerald-500/60">Total Spent</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="space-y-2 min-w-0 flex-1">
            {Object.entries(categories).map(([category, amount]) => {
              const percentage = ((amount / totalExpenses) * 100).toFixed(1);
              const color = getColor(category);
              
              return (
                <div key={category} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: color }}></div>
                    <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-emerald-100/80 truncate">{category}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-emerald-100">{formatAmount(amount)}</p>
                    <p className="text-xs text-slate-400 dark:text-emerald-500/60">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Goals Progress Component
const GoalsProgress = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/goals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setGoals(data);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0';
    return formatAmount(amount, { maximumFractionDigits: 0 });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-emerald-900/40 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg">Savings Goals</h4>
        <Link to="/goals" className="text-sm font-bold text-primary hover:underline underline-offset-4">View All</Link>
      </div>
      
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MdFlag className="text-4xl text-slate-400 dark:text-emerald-500/50 mb-2" />
          <p className="text-slate-500 dark:text-emerald-500/60">Set your first savings goal</p>
          <Link to="/goals" className="mt-2 text-primary font-medium hover:underline">Go to Goals</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.slice(0, 3).map((goal) => {
            const progress = (goal.targetAmount || goal.target) > 0 ? Math.min(((goal.currentAmount || goal.current) / (goal.targetAmount || goal.target)) * 100, 100) : 0;
            const isComplete = (goal.currentAmount || goal.current) >= (goal.targetAmount || goal.target);
            
            return (
              <div key={goal._id} className="p-3 sm:p-4 bg-slate-50 dark:bg-emerald-900/10 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{goal.icon || '💰'}</span>
                    <span className="font-bold text-slate-800 dark:text-emerald-100 truncate">{goal.name}</span>
                  </div>
                  {isComplete && <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Complete!</span>}
                </div>
                <div className="relative h-2 bg-slate-200 dark:bg-emerald-900/40 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-slate-500 dark:text-emerald-500/60">{formatCurrency(goal.currentAmount || goal.current || 0)} saved</span>
                  <span className="font-bold text-emerald-500 dark:text-emerald-400">{progress.toFixed(0)}%</span>
                  <span className="text-slate-500 dark:text-emerald-500/60">{formatCurrency(goal.targetAmount || goal.target || 0)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/transactions?_sort=date&_order=desc&_limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0';
    return formatAmount(amount);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': MdRestaurant,
      Food: MdRestaurant,
      Shopping: MdShoppingCart,
      Transportation: MdDirectionsCar,
      Entertainment: MdMovie,
      Utilities: MdWork,
      Health: MdLocalHospital,
      Housing: MdHome,
    };
    return icons[category] || MdReceiptLong;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm overflow-hidden animate-pulse">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-emerald-900/30">
          <div className="h-6 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/4"></div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-emerald-900/20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 sm:p-6">
              <div className="h-4 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-emerald-900/30 flex items-center justify-between">
        <h4 className="font-bold text-lg">Recent Activity</h4>
        <Link to="/transactions" className="text-sm font-bold text-primary hover:underline underline-offset-4">View All</Link>
      </div>
      
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MdReceiptLong className="text-4xl text-slate-400 dark:text-emerald-500/50 mb-2" />
          <p className="text-slate-500 dark:text-emerald-500/60">Add your first transaction</p>
          <Link to="/transactions" className="mt-2 text-primary font-medium hover:underline">Go to Transactions</Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-emerald-900/20">
          {transactions.map((transaction) => {
            const Icon = getCategoryIcon(transaction.category);
            
            return (
              <div key={transaction._id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-emerald-900/10 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`size-10 sm:size-12 rounded-lg flex items-center justify-center shrink-0 ${transaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'}`}>
                    {transaction.type === 'income' ? <MdArrowUpward className="text-lg" /> : <Icon className="text-lg" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-emerald-100 truncate">{transaction.description || transaction.category}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 dark:text-emerald-500/60">{new Date(transaction.date).toLocaleDateString()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${transaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'}`}>
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm sm:text-base font-bold shrink-0 ${transaction.type === 'income' ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount || 0))}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Dashboard Component
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats from transactions
  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(0) : 0;

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <StatsCard title="Total Balance" amount={loading ? '...' : formatAmount(totalBalance)} change={null} changeType={totalBalance >= 0 ? 'increase' : 'decrease'} icon={MdAccountBalance} iconColor="bg-primary" />
            <StatsCard title="Monthly Income" amount={loading ? '...' : formatAmount(totalIncome)} change={null} changeType="increase" icon={MdTrendingUp} iconColor="bg-emerald-500" />
            <StatsCard title="Monthly Expenses" amount={loading ? '...' : formatAmount(totalExpenses)} change={null} changeType="decrease" icon={MdTrendingDown} iconColor="bg-orange-500" />
            <StatsCard title="Savings Rate" amount={loading ? '...' : `${savingsRate}%`} change={null} changeType="increase" icon={MdPieChart} iconColor="bg-blue-500" />
          </div>
          
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-emerald-100 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <QuickActionButton icon={MdAdd} label="Add Transaction" color="bg-primary" onClick={() => window.location.href = '/transactions'} />
              <QuickActionButton icon={MdFlag} label="Set New Goal" color="bg-emerald-500" onClick={() => window.location.href = '/goals'} />
              <QuickActionButton icon={MdShowChart} label="Track Investment" color="bg-blue-500" onClick={() => window.location.href = '/investments'} />
              <QuickActionButton icon={MdBarChart} label="View Reports" color="bg-purple-500" onClick={() => window.location.href = '/reports'} />
            </div>
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <DonutChart />
            <GoalsProgress />
          </div>
          
          {/* Recent Activity */}
          <RecentActivity />
        </main>
      </div>
    </div>
  );
}
