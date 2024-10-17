import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, ArrowRightLeft } from 'lucide-react';

interface ExchangeRates {
  [key: string]: number;
}

function App() {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (exchangeRates[toCurrency]) {
      const result = amount * (exchangeRates[toCurrency] / exchangeRates[fromCurrency]);
      setConvertedAmount(Number(result.toFixed(2)));
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setExchangeRates(response.data.rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Currency Converter</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(exchangeRates).map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <button onClick={handleSwapCurrencies} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowRightLeft size={24} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(exchangeRates).map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <p className="text-center text-lg font-semibold">
            {convertedAmount !== null ? (
              <>
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </>
            ) : (
              'Loading...'
            )}
          </p>
        </div>
        <button
          onClick={fetchExchangeRates}
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <RefreshCw size={20} className="mr-2" />
          Refresh Rates
        </button>
      </div>
    </div>
  );
}

export default App;