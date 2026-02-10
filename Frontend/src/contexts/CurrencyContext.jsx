import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Currency configurations
export const currencies = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR', locale: 'de-DE' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP', locale: 'en-GB' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR', locale: 'en-IN' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY', locale: 'ja-JP' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY', locale: 'zh-CN' },
  KRW: { symbol: '₩', name: 'South Korean Won', code: 'KRW', locale: 'ko-KR' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL', locale: 'pt-BR' },
  RUB: { symbol: '₽', name: 'Russian Ruble', code: 'RUB', locale: 'ru-RU' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD', locale: 'en-AU' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD', locale: 'en-CA' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc', code: 'CHF', locale: 'de-CH' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD', locale: 'en-SG' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', code: 'MYR', locale: 'ms-MY' },
  THB: { symbol: '฿', name: 'Thai Baht', code: 'THB', locale: 'th-TH' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', code: 'IDR', locale: 'id-ID' },
  PHP: { symbol: '₱', name: 'Philippine Peso', code: 'PHP', locale: 'en-PH' },
  VND: { symbol: '₫', name: 'Vietnamese Dong', code: 'VND', locale: 'vi-VN' },
  ZAR: { symbol: 'R', name: 'South African Rand', code: 'ZAR', locale: 'en-ZA' },
  MXN: { symbol: '$', name: 'Mexican Peso', code: 'MXN', locale: 'es-MX' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('currency');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (currencies[parsed]) {
        return parsed;
      }
    }
    // Default to USD
    return 'USD';
  });
  const [loading, setLoading] = useState(true);

  // Format amount based on selected currency
  const formatAmount = useCallback((amount, options = {}) => {
    const currencyConfig = currencies[currency] || currencies.USD;
    const { compact = false, showSymbol = true, maximumFractionDigits = null } = options;

    if (compact && Math.abs(amount) >= 1000000) {
      return `${currencyConfig.symbol}${(amount / 1000000).toFixed(1)}M`;
    }
    if (compact && Math.abs(amount) >= 1000) {
      return `${currencyConfig.symbol}${(amount / 1000).toFixed(1)}K`;
    }

    try {
      const formatterOptions = {
        style: showSymbol ? 'currency' : 'decimal',
        currency: currencyConfig.code,
        minimumFractionDigits: maximumFractionDigits !== null ? maximumFractionDigits : (currency === 'JPY' || currency === 'KRW' ? 0 : 2),
        maximumFractionDigits: maximumFractionDigits !== null ? maximumFractionDigits : (currency === 'JPY' || currency === 'KRW' ? 0 : 2),
      };
      const formatter = new Intl.NumberFormat(currencyConfig.locale, formatterOptions);
      return formatter.format(amount);
    } catch (e) {
      // Fallback formatting
      const decimals = maximumFractionDigits !== null ? maximumFractionDigits : (currency === 'JPY' || currency === 'KRW' ? 0 : 2);
      const separator = currency === 'INR' ? ',' : '.';
      const formattedAmount = amount.toFixed(decimals).replace('.', separator);
      return showSymbol ? `${currencyConfig.symbol}${formattedAmount}` : formattedAmount;
    }
  }, [currency]);

  // Fetch user's currency preference from backend
  useEffect(() => {
    const fetchCurrencyPreference = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            if (userData.currency && currencies[userData.currency]) {
              setCurrency(userData.currency);
            }
          }
        } catch (err) {
          console.error('Failed to fetch currency preference:', err);
        }
      }
      setLoading(false);
    };
    fetchCurrencyPreference();
  }, []);

  // Save currency preference to localStorage and backend
  const setCurrencyPreference = useCallback(async (currencyCode) => {
    if (!currencies[currencyCode]) {
      console.error('Invalid currency code:', currencyCode);
      return;
    }

    setCurrency(currencyCode);
    localStorage.setItem('currency', JSON.stringify(currencyCode));

    // Save to backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_URL}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ currency: currencyCode })
        });
      } catch (err) {
        console.error('Failed to save currency preference:', err);
      }
    }
  }, []);

  const value = {
    currency,
    setCurrency: setCurrencyPreference,
    currencies,
    formatAmount,
    loading,
    currencyConfig: currencies[currency] || currencies.USD
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
