import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdReceiptLong,
  MdTrendingUp,
  MdTrendingDown,
  MdShoppingBag,
  MdRestaurant,
  MdWork,
  MdDirectionsCar,
  MdHome,
  MdLocalHospital,
  MdFlight,
  MdMovie,
  MdFitnessCenter,
  MdAdd,
  MdSearch,
  MdNotifications,
  MdFilterList,
  MdAccountBalance,
  MdPayments,
  MdShoppingCart,
  MdShowChart,
  MdFlag,
  MdBarChart,
  MdSettings,
  MdEdit,
  MdDelete,
  MdMenu,
  MdClose,
  MdDarkMode,
  MdLightMode,
  MdPerson,
} from 'react-icons/md';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { useCurrency } from './contexts/CurrencyContext';
import NotificationDropdown from './components/NotificationDropdown';
import { API_URL } from './config/api';

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'];
const expenseCategories = ['Electronics', 'Dining Out', 'Travel', 'Shopping', 'Entertainment', 'Food & Dining', 'Utilities', 'Health', 'Housing', 'Transport', 'Other Expense'];

const categoryIcons = {
  'Salary': MdWork,
  'Freelance': MdWork,
  'Investment': MdTrendingUp,
  'Business': MdAccountBalance,
  'Other Income': MdWork,
  'Electronics': MdShoppingBag,
  'Dining Out': MdRestaurant,
  'Travel': MdDirectionsCar,
  'Shopping': MdShoppingCart,
  'Entertainment': MdMovie,
  'Food & Dining': MdRestaurant,
  'Utilities': MdHome,
  'Health': MdLocalHospital,
  'Housing': MdHome,
  'Transport': MdDirectionsCar,
  'Other Expense': MdReceiptLong,
};

// Add Transaction Modal Component
const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const { currencyConfig } = useCurrency();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: formData.type,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description || formData.category,
          date: formData.date
        })
      });
      
      if (response.ok) {
        const newTransaction = await response.json();
        onAdd(newTransaction);
        setFormData({
          name: '',
          description: '',
          category: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          type: 'expense',
        });
        onClose();
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-[#0a140d] border border-slate-200 dark:border-emerald-900/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-emerald-900/30">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-emerald-100 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Transaction Type */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-emerald-900/20 rounded-lg">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.type === 'expense'
                  ? 'bg-white dark:bg-emerald-800 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-emerald-100/60 hover:text-slate-900 dark:hover:text-emerald-100'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.type === 'income'
                  ? 'bg-white dark:bg-emerald-800 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-emerald-100/60 hover:text-slate-900 dark:hover:text-emerald-100'
              }`}
            >
              Income
            </button>
          </div>
          
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50">{currencyConfig.symbol}</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="custom-select"
              required
            >
              <option value="">Select category</option>
              {formData.type === 'income' ? (
                incomeCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              ) : (
                expenseCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              )}
            </select>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="What's this for?"
            />
          </div>
          
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          {/* Buttons */}
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
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sidebar Navigation Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/' },
    { name: 'Transactions', icon: MdReceiptLong, path: '/transactions', active: true },
    { name: 'Investments', icon: MdShowChart, path: '/investments' },
    { name: 'Goals', icon: MdFlag, path: '/goals' },
    { name: 'Reports', icon: MdBarChart, path: '/reports' },
    { name: 'Settings', icon: MdSettings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
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
              <p className="text-xs text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider font-semibold">Premium</p>
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
const Header = ({ onMenuClick }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4 lg:py-6 border-b border-slate-200 dark:border-emerald-900/30 flex items-center justify-between gap-4">
      <button 
        className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30 rounded-lg"
        onClick={onMenuClick}
      >
        <MdMenu className="text-xl" />
      </button>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-xl lg:text-2xl font-bold">Transactions</h2>
        <p className="text-slate-500 dark:text-emerald-500/60 text-sm hidden sm:block">View and manage all your transactions</p>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50 text-xl" />
          <input
            className="bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-primary focus:border-primary transition-all w-48 lg:w-64"
            placeholder="Search transactions..."
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
          <img
            className="w-full h-full object-cover"
            alt="User profile avatar portrait"
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=13ec5b&color=1a1a1a`}
          />
        </div>
      </div>
    </header>
  );
};

// Transaction Row Component
const TransactionRow = ({ transaction, onDelete }) => {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-emerald-900/10 transition-colors">
      <td className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="size-8 sm:size-10 rounded-lg bg-slate-100 dark:bg-emerald-900/30 flex items-center justify-center text-slate-600 dark:text-primary">
            <transaction.icon className="text-lg sm:text-xl" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold truncate">{transaction.name}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-emerald-500/40 truncate">{transaction.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm hidden md:table-cell">{transaction.category}</td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">{transaction.date}</td>
      <td className="px-4 sm:px-6 py-3 sm:py-4">
        <span className="px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
          Completed
        </span>
      </td>
      <td className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold ${
        transaction.type === 'income' ? 'text-primary' : 'text-slate-900 dark:text-white'
      }`}>
        {transaction.amount.startsWith('+') ? '+' : ''}{Number(transaction.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </td>
      <td className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-1.5 sm:p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <MdEdit className="text-base sm:text-lg" />
          </button>
          <button 
            onClick={onDelete}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <MdDelete className="text-base sm:text-lg" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Stats Summary Component
const StatsSummary = ({ transactions }) => {
  const { formatAmount } = useCurrency();
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  const balance = income - expenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Total Income</span>
          <div className="size-8 sm:size-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center text-emerald-600 dark:text-primary">
            <MdTrendingUp className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">+{formatAmount(income)}</h3>
      </div>
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Total Expenses</span>
          <div className="size-8 sm:size-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
            <MdTrendingDown className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">-{formatAmount(expenses)}</h3>
      </div>
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Net Balance</span>
          <div className="size-8 sm:size-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
            <MdAccountBalance className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${balance >= 0 ? 'text-primary' : 'text-red-500'}`}>
          {balance >= 0 ? '' : '-'}{formatAmount(Math.abs(balance))}
        </h3>
      </div>
    </div>
  );
};

// Filter Bar Component
const FilterBar = ({ selectedCategory, onCategoryChange, selectedTimeRange, onTimeRangeChange }) => {
  const allCategories = [...incomeCategories, ...expenseCategories];
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg px-3 sm:px-4 py-2">
        <MdFilterList className="text-slate-400 dark:text-emerald-500/50 text-lg sm:text-xl" />
        <span className="text-sm font-medium text-slate-500 dark:text-emerald-500/60 hidden sm:inline">Filter:</span>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="custom-select text-sm font-medium min-w-[100px]"
        >
          <option value="All">All</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
          <optgroup label="Income Categories">
            {incomeCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </optgroup>
          <optgroup label="Expense Categories">
            {expenseCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        <button 
          onClick={() => onTimeRangeChange('all')}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-opacity whitespace-nowrap ${selectedTimeRange === 'all' ? 'bg-primary text-background-dark' : 'text-slate-600 dark:text-emerald-100/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20'}`}
        >
          All
        </button>
        <button 
          onClick={() => onTimeRangeChange('week')}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${selectedTimeRange === 'week' ? 'bg-primary text-background-dark' : 'text-slate-600 dark:text-emerald-100/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20'}`}
        >
          This Week
        </button>
        <button 
          onClick={() => onTimeRangeChange('month')}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${selectedTimeRange === 'month' ? 'bg-primary text-background-dark' : 'text-slate-600 dark:text-emerald-100/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20'}`}
        >
          This Month
        </button>
      </div>
    </div>
  );
};

// Main Transactions Page Component
function Transactions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setTransactions(transactions.filter(t => t._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const incomeCats = [...incomeCategories];
    const expenseCats = [...expenseCategories];
    const matchesCategory = 
      selectedCategory === 'All' || 
      t.category === selectedCategory || 
      (selectedCategory === 'income' && incomeCats.includes(t.category)) || 
      (selectedCategory === 'expense' && expenseCats.includes(t.category));
    
    const matchesSearch = (t.category || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Time range filtering
    let matchesTimeRange = true;
    if (selectedTimeRange !== 'all') {
      const transactionDate = new Date(t.date);
      const today = new Date();
      
      if (selectedTimeRange === 'week') {
        // This week (last 7 days)
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        matchesTimeRange = transactionDate >= weekAgo;
      } else if (selectedTimeRange === 'month') {
        // This month
        matchesTimeRange = 
          transactionDate.getMonth() === today.getMonth() && 
          transactionDate.getFullYear() === today.getFullYear();
      }
    }
    
    return matchesCategory && matchesSearch && matchesTimeRange;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Stats Summary */}
          <StatsSummary transactions={transactions} />

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <FilterBar 
              selectedCategory={selectedCategory} 
              onCategoryChange={setSelectedCategory}
              selectedTimeRange={selectedTimeRange}
              onTimeRangeChange={setSelectedTimeRange}
            />
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-primary text-background-dark font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              <MdAdd className="text-xl" />
              <span className="text-sm">Add Transaction</span>
            </button>
          </div>

          {/* Transactions Table */}
          {loading ? (
            <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading transactions...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm p-8 text-center text-slate-500">
              No transactions found. Add your first transaction!
            </div>
          ) : (
            <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm overflow-hidden">
              {/* Mobile Search */}
              <div className="p-4 sm:hidden">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50 text-xl" />
                  <input
                    className="w-full bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg pl-10 pr-4 py-2 text-sm"
                    placeholder="Search..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-emerald-900/10 text-left">
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider">Transaction</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider hidden md:table-cell">Category</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider hidden sm:table-cell">Date</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider">Amount</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-emerald-900/20">
                    {filteredTransactions.map((transaction) => (
                      <TransactionRow 
                        key={transaction._id} 
                        transaction={{
                          ...transaction,
                          name: transaction.category,
                          description: transaction.description || '',
                          icon: categoryIcons[transaction.category] || MdReceiptLong,
                          date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          amount: transaction.type === 'income' ? `+${transaction.amount}` : `-${transaction.amount}`
                        }}
                        onDelete={() => handleDeleteTransaction(transaction._id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-emerald-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-500/60">
                  Showing <span className="font-bold text-slate-700 dark:text-emerald-100">{filteredTransactions.length}</span> of <span className="font-bold text-slate-700 dark:text-emerald-100">{transactions.length}</span> transactions
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-emerald-500/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                    Prev
                  </button>
                  <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-primary text-background-dark rounded-lg">
                    1
                  </button>
                  <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-emerald-500/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                    2
                  </button>
                  <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-emerald-500/60 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}

export default Transactions;
