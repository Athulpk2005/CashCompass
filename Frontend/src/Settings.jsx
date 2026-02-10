import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  MdPerson,
  MdSecurity,
  MdNotificationsActive,
  MdPalette,
  MdHelpOutline,
  MdInfo,
  MdEdit,
  MdSave,
  MdDarkMode,
  MdLightMode,
  MdVerified,
  MdLock,
  MdEmail,
  MdPhone,
  MdCalendarMonth,
  MdPhotoCamera,
  MdCheckCircle,
  MdError,
  MdLogout,
  MdDelete,
  MdAttachMoney,
} from 'react-icons/md';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { useNotification } from './contexts/NotificationContext';
import { useCurrency } from './contexts/CurrencyContext';
import NotificationDropdown from './components/NotificationDropdown';
import CurrencySelector from './components/CurrencySelector';
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
    { name: 'Settings', icon: MdSettings, path: '/settings', active: true },
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
              <p className="text-xs text-slate-500 dark:text-emerald-500/60 uppercase tracking-wider font-semibold">Finance Tracker</p>
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

// Settings Section Component
const SettingsSection = ({ icon: Icon, title, description, children }) => {
  return (
    <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl shadow-sm overflow-visible relative z-10">
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-emerald-900/30">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-emerald-100">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-emerald-500/60">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 overflow-visible">
        {children}
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update localStorage user data
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.name = data.name;
        storedUser.phone = data.phone;
        localStorage.setItem('user', JSON.stringify(storedUser));
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err) {
      if (err.message === 'Not authenticated') {
        logout();
        navigate('/login');
      } else {
        setMessage({ type: 'error', text: 'Failed to connect to server' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB - MongoDB document limit)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 2MB' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target.result;
      
      // Upload to server
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage({ type: 'error', text: 'Please login first' });
          return;
        }
        
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileImage: imageUrl }),
        });

        if (response.ok) {
          setMessage({ type: 'success', text: 'Profile image updated!' });
          // Update localStorage
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          storedUser.profileImage = imageUrl;
          localStorage.setItem('user', JSON.stringify(storedUser));
          
          // Refresh the page to show new image
          window.location.reload();
        } else {
          const errorData = await response.json().catch(() => ({}));
          setMessage({ type: 'error', text: errorData.error || 'Failed to upload image. Try a smaller image.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Network error. Please try again.' });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Header with Avatar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-6 border-b border-slate-100 dark:border-emerald-900/30">
        <div className="relative">
          <div className="size-24 sm:size-28 rounded-full bg-slate-200 dark:bg-emerald-900 overflow-hidden border-3 border-primary shadow-lg">
            <img
              className="w-full h-full object-cover"
              alt="Profile"
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=13ec5b&color=1a1a1a&size=112`}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-image-upload"
          />
          <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 size-9 bg-primary rounded-full flex items-center justify-center text-background-dark shadow-lg hover:opacity-90 transition-opacity cursor-pointer">
            <MdPhotoCamera className="text-lg" />
          </label>
        </div>
        <div className="text-center sm:text-left flex-1">
          <h4 className="font-bold text-2xl text-slate-800 dark:text-emerald-100">{user?.name || 'User'}</h4>
          <p className="text-sm text-slate-500 dark:text-emerald-500/60 flex items-center gap-1 justify-center sm:justify-start mt-1">
            <MdEmail className="text-sm" /> {user?.email || ''}
          </p>
          <p className="text-xs text-slate-400 dark:text-emerald-500/40 flex items-center gap-1 justify-center sm:justify-start mt-1">
            <MdPhone className="text-sm" /> {user?.phone || 'No phone added'}
          </p>
          <div className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
            <MdVerified className="text-xs" /> PREMIUM MEMBER
          </div>
        </div>
      </div>
      
      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'} flex items-center gap-2`}>
          {message.type === 'success' ? <MdCheckCircle className="text-lg" /> : <MdError className="text-lg" />}
          {message.text}
        </div>
      )}
      
      {/* Registration Data Card */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-2xl p-5 border border-slate-200 dark:border-emerald-800/30">
        <h5 className="text-sm font-bold text-slate-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <MdInfo className="text-base" /> Registration Information
        </h5>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-emerald-900/30 rounded-xl p-4 border border-slate-200 dark:border-emerald-800/30 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <MdPerson className="text-primary text-lg" />
              <span className="text-xs font-medium text-slate-500 dark:text-emerald-500/60 uppercase">Full Name</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-emerald-100">{user?.name || 'N/A'}</p>
          </div>
          <div className="bg-white dark:bg-emerald-900/30 rounded-xl p-4 border border-slate-200 dark:border-emerald-800/30 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <MdEmail className="text-primary text-lg" />
              <span className="text-xs font-medium text-slate-500 dark:text-emerald-500/60 uppercase">Email</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-emerald-100 truncate" title={user?.email}>{user?.email || 'N/A'}</p>
          </div>
          <div className="bg-white dark:bg-emerald-900/30 rounded-xl p-4 border border-slate-200 dark:border-emerald-800/30 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <MdPhone className="text-primary text-lg" />
              <span className="text-xs font-medium text-slate-500 dark:text-emerald-500/60 uppercase">Phone</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-emerald-100">{user?.phone || 'N/A'}</p>
          </div>
          <div className="bg-white dark:bg-emerald-900/30 rounded-xl p-4 border border-slate-200 dark:border-emerald-800/30 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <MdCalendarMonth className="text-primary text-lg" />
              <span className="text-xs font-medium text-slate-500 dark:text-emerald-500/60 uppercase">Member Since</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-emerald-100">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
      
      {/* Editable Fields */}
      <div className="grid gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-2 flex items-center gap-2">
            <MdPerson className="text-primary text-base" /> Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all pl-11"
              placeholder="Enter your full name"
            />
            <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50" />
          </div>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-2 flex items-center gap-2">
            <MdPhone className="text-primary text-base" /> Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all pl-11"
              placeholder="Enter your phone number"
            />
            <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50" />
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-emerald-900/30">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary text-background-dark font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> Saving...</>
          ) : (
            <><MdSave className="text-lg" /> Save Changes</>
          )}
        </button>
      </div>
    </form>
  );
};

// Security Settings Component
const SecuritySettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordModal(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (err) {
      if (err.message === 'Not authenticated') {
        logout();
        navigate('/login');
      } else {
        setMessage({ type: 'error', text: 'Failed to connect to server' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {message.text && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${message.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
          {message.text}
        </div>
      )}
      
      <div className="border-t border-slate-100 dark:border-emerald-900/30 pt-2">
        <button 
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-900/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <MdLock className="text-orange-500 dark:text-orange-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-800 dark:text-emerald-100">Change Password</p>
              <p className="text-sm text-slate-500 dark:text-emerald-500/60">Update your password regularly</p>
            </div>
          </div>
          <MdEdit className="text-slate-400 dark:text-emerald-500/50" />
        </button>
        
        <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-900/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <MdSecurity className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-800 dark:text-emerald-100">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500 dark:text-emerald-500/60">Add an extra layer of security</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">ENABLED</span>
        </button>
        
        <button 
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <MdLogout className="text-red-500 dark:text-red-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-800 dark:text-emerald-100">Logout</p>
              <p className="text-sm text-slate-500 dark:text-emerald-500/60">Sign out of your account</p>
            </div>
          </div>
        </button>
      </div>
      
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0a140d] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 dark:text-emerald-100 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2.5 text-slate-600 dark:text-emerald-100 hover:bg-slate-100 dark:hover:bg-emerald-900/20 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-background-dark font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Theme Settings Component
const ThemeSettings = () => {
  const { darkMode, toggleDarkMode, themeMode, setThemeMode } = useTheme();
  const { currency, currencies } = useCurrency();
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleThemeChange = async (newMode) => {
    setThemeMode(newMode);
    
    // Save to database
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeMode: newMode }),
      });
      setMessage({ type: 'success', text: 'Theme saved!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Theme Section */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-emerald-100 mb-4">Theme Mode</h3>
        {message.text && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : ''}`}>
            {message.text}
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-5 rounded-xl border-2 transition-all ${
              themeMode === 'light' 
                ? 'border-primary bg-primary/5' 
                : 'border-slate-200 dark:border-emerald-800/30 hover:border-primary/50'
            }`}
          >
            <MdLightMode className={`text-3xl mx-auto mb-3 ${themeMode === 'light' ? 'text-primary' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-center">Light</p>
          </button>
          
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-5 rounded-xl border-2 transition-all ${
              themeMode === 'dark' 
                ? 'border-primary bg-primary/5' 
                : 'border-slate-200 dark:border-emerald-800/30 hover:border-primary/50'
            }`}
          >
            <MdDarkMode className={`text-3xl mx-auto mb-3 ${themeMode === 'dark' ? 'text-primary' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-center">Dark</p>
          </button>
          
          <button
            onClick={() => handleThemeChange('system')}
            className={`p-5 rounded-xl border-2 transition-all ${
              themeMode === 'system' 
                ? 'border-primary bg-primary/5' 
                : 'border-slate-200 dark:border-emerald-800/30 hover:border-primary/50'
            }`}
          >
            <MdSettings className={`text-3xl mx-auto mb-3 ${themeMode === 'system' ? 'text-primary' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-center">System</p>
          </button>
        </div>
      </div>
      
      {/* Currency Section */}
      <div className="pt-4 border-t border-slate-200 dark:border-emerald-800/30">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-emerald-100 mb-4">Display Currency</h3>
        <div className="bg-white dark:bg-emerald-900/20 rounded-xl border border-slate-200 dark:border-emerald-800/30 p-4">
          <CurrencySelector showLabel={false} />
        </div>
        <p className="text-sm text-slate-500 dark:text-emerald-500/60 mt-3">
          All amounts will be displayed in <span className="font-semibold text-primary">{currencies[currency]?.name}</span> ({currencies[currency]?.symbol})
        </p>
      </div>
    </div>
  );
};

// Main Settings Page Component
export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: MdPerson },
    { id: 'security', label: 'Security', icon: MdSecurity },
    { id: 'appearance', label: 'Appearance', icon: MdPalette },
  ];

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-emerald-900/30 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button 
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MdMenu className="text-2xl" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-emerald-500/50" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-48 lg:w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleThemeChange(darkMode ? 'light' : 'dark')}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30 rounded-lg"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            </button>
            <NotificationDropdown darkMode={darkMode} />
            <Link to="/settings" className="p-2 text-primary hover:bg-primary/10 rounded-lg">
              <MdSettings className="text-xl" />
            </Link>
            <div className="size-8 sm:size-10 rounded-full bg-slate-200 dark:bg-emerald-900 overflow-hidden border border-slate-200 dark:border-emerald-800/50">
              <img
                className="w-full h-full object-cover"
                alt="User profile avatar portrait"
                src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=13ec5b&color=1a1a1a`}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-emerald-100">Settings</h1>
              <p className="text-slate-500 dark:text-emerald-500/60 mt-1">Manage your account preferences</p>
            </div>

            <div className="grid lg:grid-cols-[240px_1fr] gap-6">
              {/* Desktop Tabs */}
              <div className="hidden lg:block">
                <div className="bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl overflow-hidden">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'text-slate-600 dark:text-emerald-100/60 hover:bg-slate-50 dark:hover:bg-emerald-900/10 border-l-4 border-transparent'
                      }`}
                    >
                      <tab.icon className="text-xl" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className="lg:hidden overflow-x-auto pb-2">
                <div className="flex gap-2 pb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-background-dark'
                          : 'bg-white dark:bg-emerald-950/20 text-slate-600 dark:text-emerald-100/60 border border-slate-200 dark:border-emerald-800/30'
                      }`}
                    >
                      <tab.icon className="text-lg" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 relative z-0">
                {activeTab === 'profile' && <ProfileSettings user={user} />}
                {activeTab === 'security' && (
                  <SettingsSection
                    icon={MdLock}
                    title="Security"
                    description="Manage your password and security settings"
                  >
                    <SecuritySettings />
                  </SettingsSection>
                )}
                {activeTab === 'appearance' && (
                  <SettingsSection
                    icon={MdPalette}
                    title="Appearance"
                    description="Customize the look and feel"
                  >
                    <ThemeSettings />
                  </SettingsSection>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
