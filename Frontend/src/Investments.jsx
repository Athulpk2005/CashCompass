import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdReceiptLong,
  MdTrendingUp,
  MdTrendingDown,
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
  MdTrendingFlat,
  MdPieChart,
  MdArrowUpward,
  MdArrowDownward,
  MdMoreVert,
  MdPerson,
  MdEdit,
  MdDelete,
  MdDarkMode,
  MdLightMode,
} from 'react-icons/md';
import { API_URL } from './config/api';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { useCurrency } from './contexts/CurrencyContext';
import NotificationDropdown from './components/NotificationDropdown';

// Investment types matching backend model
const investmentTypes = [
  { value: 'stock', label: 'Stocks', icon: '📈' },
  { value: 'mutual_fund', label: 'Mutual Funds', icon: '💰' },
  { value: 'fd', label: 'Fixed Deposits', icon: '📊' },
  { value: 'ppf', label: 'PPF', icon: '🏦' },
  { value: 'other', label: 'Other', icon: '💎' },
];

const typeIcons = {
  'stock': '📈',
  'mutual_fund': '💰',
  'fd': '📊',
  'ppf': '🏦',
  'other': '💎',
};

// Add Investment Modal Component
const AddInvestmentModal = ({ isOpen, onClose, onAdd }) => {
  const { currencies, formatAmount } = useCurrency();
  const currencyConfig = currencies[localStorage.getItem('currency') || 'USD'];
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    investedAmount: '',
    currentValue: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.investedAmount) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          investedAmount: parseFloat(formData.investedAmount),
          currentValue: formData.currentValue ? parseFloat(formData.currentValue) : parseFloat(formData.investedAmount),
          purchaseDate: formData.purchaseDate,
          notes: formData.notes
        })
      });
      
      if (response.ok) {
        const newInvestment = await response.json();
        onAdd(newInvestment);
        setFormData({
          name: '',
          type: '',
          investedAmount: '',
          currentValue: '',
          purchaseDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
        onClose();
      }
    } catch (error) {
      console.error('Failed to add investment:', error);
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
          <h2 className="text-xl font-bold">Add Investment</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-emerald-100 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Investment Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
              Investment Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="custom-select"
              required
            >
              <option value="">Select type</option>
              {investmentTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
              ))}
            </select>
          </div>
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
              Investment Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="e.g., Apple Inc."
              required
            />
          </div>
          
          {/* Amount Invested & Current Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
                Amount Invested
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50">{currencyConfig.symbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.investedAmount}
                  onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
                  className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
                Current Value
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50">{currencyConfig.symbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          
          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Any additional notes..."
              rows="2"
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
              {loading ? 'Adding...' : 'Add Investment'}
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
    { name: 'Transactions', icon: MdReceiptLong, path: '/transactions' },
    { name: 'Investments', icon: MdShowChart, path: '/investments', active: true },
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
              <h1 className="font-bold text-lg leading-tight">FinTrack</h1>
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
const Header = ({ onMenuClick, searchTerm, onSearchChange }) => {
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
        <h2 className="text-xl lg:text-2xl font-bold">Investments</h2>
        <p className="text-slate-500 dark:text-emerald-500/60 text-sm hidden sm:block">Track your portfolio performance</p>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50 text-xl" />
          <input
            className="bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-primary focus:border-primary transition-all w-48 lg:w-64"
            placeholder="Search investments..."
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

// Portfolio Stats Component
const PortfolioStats = ({ investments }) => {
  const { formatAmount } = useCurrency();
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.investedAmount || 0), 0);
  const currentValue = investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
  const totalGain = currentValue - totalInvested;
  const gainPercentage = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(2) : '0.00';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Total Invested</span>
          <div className="size-8 sm:size-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
            <MdAccountBalance className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatAmount(totalInvested)}</h3>
      </div>
      
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Current Value</span>
          <div className="size-8 sm:size-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center text-emerald-600 dark:text-primary">
            <MdShowChart className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatAmount(currentValue)}</h3>
      </div>
      
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Total Gain/Loss</span>
          <div className={`size-8 sm:size-8 rounded-lg flex items-center justify-center ${totalGain >= 0 ? 'bg-primary/20 text-primary' : 'bg-orange-100 dark:bg-orange-900/40 text-orange-500'}`}>
            {totalGain >= 0 ? <MdArrowUpward className="text-lg sm:text-xl" /> : <MdArrowDownward className="text-lg sm:text-xl" />}
          </div>
        </div>
        <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${totalGain >= 0 ? 'text-primary' : 'text-orange-500'}`}>
          {totalGain >= 0 ? '+' : ''}{formatAmount(totalGain)}
        </h3>
      </div>
      
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Return Rate</span>
          <div className={`size-8 sm:size-8 rounded-lg flex items-center justify-center ${parseFloat(gainPercentage) >= 0 ? 'bg-primary/20 text-primary' : 'bg-orange-100 dark:bg-orange-900/40 text-orange-500'}`}>
            {parseFloat(gainPercentage) >= 0 ? <MdTrendingUp className="text-lg sm:text-xl" /> : <MdTrendingDown className="text-lg sm:text-xl" />}
          </div>
        </div>
        <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${parseFloat(gainPercentage) >= 0 ? 'text-primary' : 'text-orange-500'}`}>
          {parseFloat(gainPercentage) >= 0 ? '+' : ''}{gainPercentage}%
        </h3>
      </div>
    </div>
  );
};

// Portfolio Chart Component
const PortfolioChart = ({ investments }) => {
  const { formatAmount } = useCurrency();
  const [showFullChart, setShowFullChart] = useState(false);
  
  // Generate portfolio history from investments
  const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.investedAmount || 0), 0);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Generate 6 months or 12 months of data
  const monthCount = showFullChart ? 12 : 6;
  const chartMonths = [];
  for (let i = monthCount - 1; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    chartMonths.push(months[monthIndex]);
  }
  
  const portfolioHistory = chartMonths.map((month, index) => {
    const monthOffset = index - (monthCount - 1);
    // Use deterministic calculation instead of Math.random() for stable renders
    const pseudoRandom = Math.sin(index * 123.45) * 0.03;
    const growthFactor = 1 + (monthOffset * 0.02) + pseudoRandom;
    return { month, value: Math.max(0, totalValue * growthFactor) };
  });
  
  const maxValue = Math.max(...portfolioHistory.map(d => d.value), 1);
  
  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-bold text-lg">Portfolio Performance</h4>
          <p className="text-slate-400 dark:text-emerald-500/50 text-sm">{showFullChart ? 'Last 12 months' : 'Last 6 months'}</p>
        </div>
        <button 
          onClick={() => setShowFullChart(!showFullChart)}
          className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          {showFullChart ? 'Show Less' : 'View All'}
        </button>
      </div>
      
      {investments.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-slate-500">
          Add investments to see performance
        </div>
      ) : (
        <div className="flex items-end justify-between h-40 sm:h-48 gap-2 sm:gap-4 px-2">
          {portfolioHistory.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            const isPositive = index === 0 ? true : item.value >= portfolioHistory[index - 1].value;
            
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="relative w-full flex justify-center items-end h-full group">
                  <div 
                    className={`w-full max-w-[40px] sm:max-w-[60px] rounded-t-lg transition-all duration-300 ${isPositive ? 'bg-primary' : 'bg-orange-500'}`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-emerald-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                    {formatAmount(item.value, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-emerald-500/60">{item.month}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Asset Allocation Component
const AssetAllocation = ({ investments }) => {
  const { formatAmount } = useCurrency();
  // Calculate allocation by type
  const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.investedAmount || 0), 0);
  
  const allocationMap = {};
  investments.forEach(inv => {
    const type = inv.type;
    const value = inv.currentValue || inv.investedAmount || 0;
    allocationMap[type] = (allocationMap[type] || 0) + value;
  });
  
  const allocation = Object.entries(allocationMap).map(([name, value]) => ({
    name,
    value,
    percentage: totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0
  }));
  
  const colors = ['#13ec5b', '#3b82f6', '#f97316', '#a855f7', '#ec4899', '#14b8a6'];
  
  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-bold text-lg">Asset Allocation</h4>
          <p className="text-slate-400 dark:text-emerald-500/50 text-sm">Diversification</p>
        </div>
        <MdPieChart className="text-2xl text-primary" />
      </div>
      
      {allocation.length === 0 ? (
        <div className="text-center text-slate-500 py-8">No investments yet</div>
      ) : (
        <>
          {/* Donut Chart */}
          <div className="relative flex items-center justify-center h-32 sm:h-40 mb-6">
            <svg className="w-28 h-28 sm:w-36 sm:h-36 transform -rotate-90" viewBox="0 0 36 36">
              <circle className="text-slate-100 dark:text-emerald-900/30" cx="18" cy="18" fill="transparent" r="16" stroke="currentColor" strokeWidth="4"></circle>
              {allocation.map((item, index) => {
                const cumulativePercentage = allocation.slice(0, index).reduce((sum, prev) => sum + (parseFloat(prev.percentage) / 100) * 100, 0);
                return (
                  <circle 
                    key={item.name}
                    cx="18" cy="18" fill="transparent" r="16" 
                    stroke={colors[index % colors.length]} 
                    strokeDasharray={`${parseFloat(item.percentage)} ${100 - parseFloat(item.percentage)}`} 
                    strokeDashoffset={-cumulativePercentage}
                    strokeWidth="4"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold">{formatAmount(totalValue)}</span>
              <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {allocation.map((item, index) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-medium">{item.name}</span>
                  <span className="text-xs sm:text-sm font-bold">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: colors[index % colors.length] }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Investment Row Component
const InvestmentRow = ({ investment, onDelete }) => {
  const { formatAmount } = useCurrency();
  const isPositive = investment.change >= 0;
  
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-emerald-900/10 transition-colors">
      <td className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="size-10 sm:size-12 rounded-lg bg-slate-100 dark:bg-emerald-900/30 flex items-center justify-center text-xl sm:text-2xl">
            {investment.icon}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold">{investment.name}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-emerald-500/40">{investment.type}</p>
          </div>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
        <p className="font-bold">{formatAmount(investment.investedAmount || 0)}</p>
      </td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
        <p className="font-bold">{formatAmount(investment.currentValue || 0)}</p>
      </td>
      <td className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold ${isPositive ? 'text-primary' : 'text-orange-500'}`}>
        {isPositive ? '+' : ''}{investment.change?.toFixed(2) || 0}%
      </td>
      <td className="px-4 sm:px-6 py-3 sm:py-4">
        <button 
          onClick={onDelete}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <MdDelete className="text-lg sm:text-xl" />
        </button>
      </td>
    </tr>
  );
};

// Main Investments Page Component
function Investments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/investments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setInvestments(data);
      }
    } catch (error) {
      console.error('Failed to fetch investments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleAddInvestment = (newInvestment) => {
    setInvestments([newInvestment, ...investments]);
  };

  const handleDeleteInvestment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/investments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setInvestments(investments.filter(i => i._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete investment:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <Header onMenuClick={() => setSidebarOpen(true)} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Portfolio Stats */}
          <PortfolioStats investments={investments} />
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <PortfolioChart investments={investments} />
            <AssetAllocation investments={investments} />
          </div>
          
          {/* Investments Section */}
          <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-emerald-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-lg">Your Investments</h4>
                <p className="text-slate-400 dark:text-emerald-500/50 text-sm hidden sm:block">Detailed breakdown of all holdings</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 bg-primary text-background-dark font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                <MdAdd className="text-xl" />
                <span className="text-sm">Add Investment</span>
              </button>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading investments...</div>
            ) : investments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p className="mb-4">No investments yet.</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 bg-primary text-background-dark font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <MdAdd className="text-xl" />
                  <span className="text-sm">Add Your First Investment</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-emerald-900/10 text-left">
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider">Asset</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider">Invested</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider">Current Value</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider">Return</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-emerald-900/20">
                    {investments
                      .filter(inv => 
                        (inv.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (inv.type || '').toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((investment) => (
                        <InvestmentRow 
                        key={investment._id} 
                        investment={{
                          ...investment,
                          icon: typeIcons[investment.type] || '💎',
                          change: investment.investedAmount > 0 
                            ? ((investment.currentValue - investment.investedAmount) / investment.investedAmount * 100)
                            : 0
                        }} 
                        onDelete={() => handleDeleteInvestment(investment._id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Add Investment Modal */}
      <AddInvestmentModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddInvestment}
      />
    </div>
  );
}

export default Investments;
