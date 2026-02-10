import { useState } from 'react';
import { useCurrency, currencies } from '../contexts/CurrencyContext';
import {
  MdAttachMoney,
  MdArrowDropDown,
  MdCheck,
  MdSearch,
  MdClose,
} from 'react-icons/md';

const CurrencySelector = ({ showLabel = true }) => {
  const { currency, setCurrency, currencies, formatAmount, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCurrency = currencies[currency];

  const filteredCurrencies = Object.values(currencies).filter((curr) =>
    curr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curr.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curr.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (code) => {
    setCurrency(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="w-full">
        {showLabel && (
          <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-2">
            Currency
          </label>
        )}
        <div className="animate-pulse bg-slate-200 dark:bg-emerald-900/30 h-12 rounded-lg w-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {showLabel && (
        <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-2">
          Currency
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 rounded-xl hover:border-primary dark:hover:border-primary transition-all w-full text-left ${
          isOpen ? 'border-primary ring-2 ring-primary/20' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl w-8 text-center">{selectedCurrency?.symbol}</span>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 dark:text-white text-base">
              {selectedCurrency?.code}
            </span>
            <span className="text-xs text-slate-500 dark:text-emerald-500/60">
              {selectedCurrency?.name}
            </span>
          </div>
        </div>
        <MdArrowDropDown
          className={`text-slate-400 text-xl transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={handleClose}
          />
          <div className="absolute z-50 mt-2 w-full bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800/50 rounded-xl shadow-2xl overflow-hidden left-0 right-0" style={{ minWidth: '280px' }}>
            {/* Header */}
            <div className="p-3 bg-slate-50 dark:bg-emerald-900/30 border-b border-slate-200 dark:border-emerald-800/30">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search currency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-emerald-900/30 border border-slate-200 dark:border-emerald-800/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <MdClose className="text-lg" />
                  </button>
                )}
              </div>
            </div>

            {/* Currency List */}
            <div className="max-h-64 overflow-y-auto py-1">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleSelect(curr.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-emerald-900/30 transition-colors ${
                      currency === curr.code ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl w-8 text-center">{curr.symbol}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {curr.code}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-emerald-500/60">
                          {curr.name}
                        </span>
                      </div>
                    </div>
                    {currency === curr.code && (
                      <MdCheck className="text-primary text-xl" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-slate-500 dark:text-emerald-500/60">
                  No currencies found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-emerald-900/30 border-t border-slate-200 dark:border-emerald-800/30">
              <p className="text-xs text-slate-500 dark:text-emerald-500/60 text-center">
                Preview: {formatAmount(1234.56)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;
