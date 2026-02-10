import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { useCurrency } from './contexts/CurrencyContext';
import NotificationDropdown from './components/NotificationDropdown';
import {
  MdDashboard,
  MdReceiptLong,
  MdShowChart,
  MdFlag,
  MdBarChart,
  MdSettings,
  MdSearch,
  MdNotifications,
  MdAccountBalance,
  MdMenu,
  MdClose,
  MdTrendingUp,
  MdTrendingDown,
  MdPieChart,
  MdDownload,
  MdFilterList,
  MdSavings,
  MdTrendingFlat,
  MdPerson,
  MdCalendarMonth,
  MdArrowUpward,
  MdArrowDownward,
  MdDarkMode,
  MdLightMode,
} from 'react-icons/md';
import { API_URL } from './config/api';

// Sidebar Navigation Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/' },
    { name: 'Transactions', icon: MdReceiptLong, path: '/transactions' },
    { name: 'Investments', icon: MdShowChart, path: '/investments' },
    { name: 'Goals', icon: MdFlag, path: '/goals' },
    { name: 'Reports', icon: MdBarChart, path: '/reports', active: true },
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
const Header = ({ onMenuClick, dateRange, setDateRange }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4 lg:py-6 border-b border-slate-200 dark:border-emerald-900/30 flex items-center justify-between gap-4 flex-wrap">
      <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30 rounded-lg" onClick={onMenuClick}>
        <MdMenu className="text-xl" />
      </button>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-xl lg:text-2xl font-bold">Financial Reports</h2>
        <p className="text-slate-500 dark:text-emerald-500/60 text-sm hidden sm:block">Analyze your financial performance</p>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg px-3 py-2">
          <MdCalendarMonth className="text-slate-400 dark:text-emerald-500/50" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="custom-select text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
          </select>
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

// Summary Stats Component
const SummaryStats = ({ summary, loading }) => {
  const { currencyConfig } = useCurrency();
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-200 dark:bg-emerald-900/40 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const { income = 0, expenses = 0, balance = 0 } = summary || {};
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Total Income</span>
          <div className="size-8 sm:size-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center text-emerald-600 dark:text-primary">
            <MdTrendingUp className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{currencyConfig.symbol}{income.toLocaleString()}</h3>
        <p className="text-xs text-slate-400 dark:text-emerald-500/60 mt-1">Income earned</p>
      </div>
      
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Total Expenses</span>
          <div className="size-8 sm:size-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
            <MdTrendingDown className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">{currencyConfig.symbol}{expenses.toLocaleString()}</h3>
        <p className="text-xs text-slate-400 dark:text-emerald-500/60 mt-1">Money spent</p>
      </div>
      
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Net Savings</span>
          <div className={`size-8 sm:size-8 rounded-lg flex items-center justify-center ${balance >= 0 ? 'bg-primary/20 text-primary' : 'bg-orange-100 dark:bg-orange-900/40 text-orange-500'}`}>
            {balance >= 0 ? <MdSavings className="text-lg sm:text-xl" /> : <MdTrendingFlat className="text-lg sm:text-xl" />}
          </div>
        </div>
        <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${balance >= 0 ? 'text-primary' : 'text-orange-500'}`}>
            {balance >= 0 ? '+' : ''}{currencyConfig.symbol}{balance.toLocaleString()}
          </h3>
        <p className="text-xs text-slate-400 dark:text-emerald-500/60 mt-1">Remaining balance</p>
      </div>
      
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-slate-500 dark:text-emerald-500/60 font-medium text-xs sm:text-sm">Savings Rate</span>
          <div className="size-8 sm:size-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
            <MdPieChart className="text-lg sm:text-xl" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500">{savingsRate}%</h3>
        <p className="text-xs text-slate-400 dark:text-emerald-500/60 mt-1">Of total income</p>
      </div>
    </div>
  );
};

// Income vs Expenses Chart Component
const IncomeExpenseChart = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="h-6 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="h-48 bg-slate-200 dark:bg-emerald-900/40 rounded animate-pulse"></div>
      </div>
    );
  }

  const { income = 0, expenses = 0 } = summary || {};
  
  // Create a simple visual representation
  const maxValue = Math.max(income, expenses, 1);
  const incomeWidth = (income / maxValue) * 100;
  const expenseWidth = (expenses / maxValue) * 100;
  
  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="mb-6">
        <h4 className="font-bold text-lg">Income vs Expenses</h4>
        <p className="text-slate-400 dark:text-emerald-500/50 text-sm">Total comparison</p>
      </div>
      
      <div className="space-y-6">
        {/* Income Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-primary"></span>
              <span className="text-sm font-medium">Income</span>
            </div>
            <span className="text-lg font-bold text-primary">${income.toLocaleString()}</span>
          </div>
          <div className="h-4 bg-slate-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${incomeWidth}%` }}></div>
          </div>
        </div>
        
        {/* Expenses Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-orange-400"></span>
              <span className="text-sm font-medium">Expenses</span>
            </div>
            <span className="text-lg font-bold text-orange-500">${expenses.toLocaleString()}</span>
          </div>
          <div className="h-4 bg-slate-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full transition-all duration-500" style={{ width: `${expenseWidth}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-emerald-900/30">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500 dark:text-emerald-500/60">Difference</span>
          <span className={`text-lg font-bold ${income - expenses >= 0 ? 'text-primary' : 'text-orange-500'}`}>
            {income - expenses >= 0 ? '+' : ''}${(income - expenses).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Category Breakdown Component
const CategoryBreakdown = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="h-6 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-slate-200 dark:bg-emerald-900/40 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const { categoryBreakdown = {} } = summary || {};
  const categories = Object.entries(categoryBreakdown);
  const totalExpenses = categories.reduce((sum, [, amount]) => sum + amount, 0);
  
  const categoryColors = {
    'Housing': 'bg-primary',
    'Rent': 'bg-primary',
    'Food': 'bg-blue-500',
    'Food & Dining': 'bg-blue-500',
    'Transportation': 'bg-purple-500',
    'Entertainment': 'bg-orange-500',
    'Shopping': 'bg-cyan-500',
    'Healthcare': 'bg-red-500',
    'Health': 'bg-red-500',
    'Utilities': 'bg-yellow-500',
    'Education': 'bg-amber-500',
    'Other': 'bg-gray-400',
  };

  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-bold text-lg">Spending by Category</h4>
          <p className="text-slate-400 dark:text-emerald-500/50 text-sm">Expense breakdown</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
          <MdFilterList className="text-xl" />
        </button>
      </div>
      
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MdPieChart className="text-4xl text-slate-400 dark:text-emerald-500/50 mb-2" />
          <p className="text-slate-500 dark:text-emerald-500/60">No expense data available</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {categories.map(([category, amount]) => {
              const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0;
              const color = categoryColors[category] || 'bg-gray-400';
              
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium">{category}</span>
                    <span className="text-xs sm:text-sm font-bold">${amount.toLocaleString()} <span className="text-slate-400 dark:text-emerald-500/60 font-normal">({percentage}%)</span></span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-emerald-900/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-emerald-500/60">Total Expenses</span>
              <span className="text-lg font-bold">${totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Investment Summary Component
const InvestmentSummary = ({ investmentSummary, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="h-6 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-200 dark:bg-emerald-900/40 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const { totalInvested = 0, totalCurrentValue = 0, totalReturns = 0 } = investmentSummary || {};
  const returnPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="mb-6">
        <h4 className="font-bold text-lg">Investment Performance</h4>
        <p className="text-slate-400 dark:text-emerald-500/50 text-sm">Portfolio overview</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MdArrowUpward className="text-primary" />
            <span className="text-xs text-slate-500 dark:text-emerald-500/60">Invested</span>
          </div>
          <p className="text-xl font-bold">${totalInvested.toLocaleString()}</p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MdShowChart className="text-blue-500" />
            <span className="text-xs text-slate-500 dark:text-blue-400">Current Value</span>
          </div>
          <p className="text-xl font-bold text-blue-500">${totalCurrentValue.toLocaleString()}</p>
        </div>
        
        <div className={`rounded-xl p-4 ${totalReturns >= 0 ? 'bg-primary/10' : 'bg-orange-100 dark:bg-orange-900/20'}`}>
          <div className="flex items-center gap-2 mb-2">
            {totalReturns >= 0 ? <MdTrendingUp className="text-primary" /> : <MdTrendingDown className="text-orange-500" />}
            <span className={`text-xs ${totalReturns >= 0 ? 'text-primary' : 'text-orange-500'}`}>Returns</span>
          </div>
          <p className={`text-xl font-bold ${totalReturns >= 0 ? 'text-primary' : 'text-orange-500'}`}>
            {totalReturns >= 0 ? '+' : ''}${totalReturns.toLocaleString()}
          </p>
        </div>
        
        <div className={`rounded-xl p-4 ${returnPercentage >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-orange-100 dark:bg-orange-900/20'}`}>
          <div className="flex items-center gap-2 mb-2">
            <MdTrendingFlat className={returnPercentage >= 0 ? 'text-emerald-600' : 'text-orange-500'} />
            <span className={`text-xs ${returnPercentage >= 0 ? 'text-emerald-600' : 'text-orange-500'}`}>Return Rate</span>
          </div>
          <p className={`text-xl font-bold ${returnPercentage >= 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
            {returnPercentage >= 0 ? '+' : ''}{returnPercentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

// Recent Transactions Component
const RecentTransactions = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-emerald-900/30">
          <div className="h-6 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-emerald-900/20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 sm:p-6">
              <div className="h-4 bg-slate-200 dark:bg-emerald-900/40 rounded w-1/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-emerald-900/30 flex items-center justify-between">
        <h4 className="font-bold text-lg">Recent Transactions</h4>
        <Link to="/transactions" className="text-sm font-bold text-primary hover:underline underline-offset-4">View All</Link>
      </div>
      
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MdReceiptLong className="text-4xl text-slate-400 dark:text-emerald-500/50 mb-2" />
          <p className="text-slate-500 dark:text-emerald-500/60">No transactions yet</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-emerald-900/20">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction._id || transaction.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-emerald-900/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-lg flex items-center justify-center ${transaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'}`}>
                  {transaction.type === 'income' ? <MdArrowUpward /> : <MdArrowDownward />}
                </div>
                <div>
                  <p className="text-sm font-bold">{transaction.description || transaction.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400 dark:text-emerald-500/60">{new Date(transaction.date).toLocaleDateString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${transaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'}`}>
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`text-sm font-bold ${transaction.type === 'income' ? 'text-primary' : 'text-orange-500'}`}>
                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Reports Page Component
function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [summary, setSummary] = useState(null);
  const [investmentSummary, setInvestmentSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currencyConfig } = useCurrency();

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  }, []);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      // Fetch summary
      const summaryResponse = await fetch(`${API_URL}/reports/summary?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
        headers: getAuthHeaders(),
      });
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);
      }

      // Fetch investment summary
      const investmentResponse = await fetch(`${API_URL}/reports/investments`, {
        headers: getAuthHeaders(),
      });
      
      if (investmentResponse.ok) {
        const investmentData = await investmentResponse.json();
        setInvestmentSummary(investmentData);
      }

      // Fetch recent transactions
      const transactionsResponse = await fetch(`${API_URL}/transactions?limit=5&sort=-date`, {
        headers: getAuthHeaders(),
      });
      
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);
      }

    } catch (err) {
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [dateRange, getAuthHeaders]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const exportPDF = async () => {
    try {
      const reportElement = document.getElementById('report-content');
      if (!reportElement) return;

      // Show loading state
      const exportBtn = document.getElementById('export-btn');
      if (exportBtn) {
        exportBtn.disabled = true;
        exportBtn.innerHTML = 'Generating...';
      }

      // Capture the report content with options to handle CSS issues
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          // Skip elements that might cause issues
          return element.tagName === 'BUTTON' || element.tagName === 'SELECT';
        },
        onclone: (clonedDoc) => {
          // Remove any problematic elements from the cloned document
          const buttons = clonedDoc.querySelectorAll('button');
          buttons.forEach(btn => {
            if (btn.id !== 'export-btn') {
              btn.style.display = 'none';
            }
          });
        }
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add header
      pdf.setFontSize(18);
      pdf.setTextColor(16, 185, 129); // Primary color
      pdf.text('CashCompass Financial Report', pdfWidth / 2, 15, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 22, { align: 'center' });

      // Add content
      pdf.addImage(imgData, 'JPEG', 0, 30, pdfWidth, pdfHeight);

      // Save PDF
      pdf.save(`CashCompass_Report_${new Date().toISOString().split('T')[0]}.pdf`);

      // Reset button
      if (exportBtn) {
        exportBtn.disabled = false;
        exportBtn.innerHTML = '<MdDownload /> Export PDF';
      }
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback: create a simple text-based PDF
      try {
        const { income = 0, expenses = 0, balance = 0, categoryBreakdown = {} } = summary || {};
        const { totalInvested = 0, totalCurrentValue = 0, totalReturns = 0 } = investmentSummary || {};
        
        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.setTextColor(16, 185, 129);
        pdf.text('CashCompass Financial Report', 20, 20);
        
        pdf.setFontSize(12);
        pdf.setTextColor(0);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        
        pdf.setFontSize(14);
        pdf.text('Summary', 20, 45);
        pdf.setFontSize(11);
        pdf.text(`Total Income: ${income.toLocaleString()}`, 20, 55);
        pdf.text(`Total Expenses: ${expenses.toLocaleString()}`, 20, 65);
        pdf.text(`Net Savings: ${balance.toLocaleString()}`, 20, 75);
        
        pdf.setFontSize(14);
        pdf.text('Investments', 20, 90);
        pdf.setFontSize(11);
        pdf.text(`Total Invested: ${totalInvested.toLocaleString()}`, 20, 100);
        pdf.text(`Current Value: ${totalCurrentValue.toLocaleString()}`, 20, 110);
        pdf.text(`Returns: ${totalReturns.toLocaleString()}`, 20, 120);
        
        pdf.save(`CashCompass_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        
        alert('PDF exported (text version)');
      } catch (fallbackErr) {
        alert('Failed to export PDF. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <Header onMenuClick={() => setSidebarOpen(true)} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8" id="report-content">
          {/* Header with Export Button */}
          <div className="flex items-center justify-between bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 p-4 rounded-xl">
            <div>
              <h2 className="text-lg font-bold">Financial Report</h2>
              <p className="text-sm text-slate-500 dark:text-emerald-500/60">
                Period: Last {dateRange === '365' ? 'Year' : dateRange === '180' ? '6 months' : dateRange === '90' ? '3 months' : dateRange === '30' ? '30 days' : '7 days'}
              </p>
            </div>
            <button
              id="export-btn"
              onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              <MdDownload /> Export PDF
            </button>
          </div>
          
          {/* Summary Stats */}
          <SummaryStats summary={summary} loading={loading} />
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <IncomeExpenseChart summary={summary} loading={loading} />
            <CategoryBreakdown summary={summary} loading={loading} />
          </div>
          
          {/* Investment Summary */}
          <InvestmentSummary investmentSummary={investmentSummary} loading={loading} />
          
          {/* Recent Transactions */}
          <RecentTransactions transactions={transactions} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default Reports;
