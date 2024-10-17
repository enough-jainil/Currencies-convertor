## How to Run the Currency Converter App

### Step 1: Clone the Repository

First, clone the repository to your local machine. Since the repository URL isn't provided, I'll assume a generic GitHub URL:

```bash
git clone https://github.com/enough-jainil/Currencies-convertor.git
cd Currencies-convertor
```

### Step 2: Install Dependencies

Install the necessary dependencies using npm (Node Package Manager):

```bash
npm install
```

This will install all the dependencies listed in the `package.json` file:


```12:33:package.json
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "axios": "^1.6.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
```


### Step 3: Set Up Environment Variables

If the app requires any environment variables (like API keys), create a `.env` file in the root directory and add them. However, in this case, no specific environment variables are needed as the exchange rate API doesn't require authentication.

### Step 4: Run the Development Server

Start the development server using the Vite command:

```bash
npm run dev
```

This command is defined in the `package.json` file:


```7:7:package.json
    "dev": "vite",
```


### Step 5: Access the Application

Once the development server starts, it will provide a local URL (usually `http://localhost:5173`). Open this URL in your web browser to view and interact with the Currency Converter app.

### Step 6: Using the Currency Converter

1. Enter the amount you want to convert in the "Amount" input field.
2. Select the currency you're converting from in the "From" dropdown.
3. Select the currency you're converting to in the "To" dropdown.
4. The converted amount will be displayed automatically.
5. Use the swap button (with arrows) to quickly switch between "From" and "To" currencies.
6. Click the "Refresh Rates" button to fetch the latest exchange rates.

### Additional Information

- The app uses React with TypeScript for the frontend.
- Styling is done using Tailwind CSS.
- Exchange rates are fetched from the `https://api.exchangerate-api.com/v4/latest/USD` API.
- The main application logic can be found in the `App.tsx` file:


```1:109:src/App.tsx
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
```


### Building for Production

If you want to build the app for production, run:

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

### Linting

To run the linter and check for code style issues:

```bash
npm run lint
```

This project uses ESLint with a custom configuration:


```1:28:eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
```


By following these steps, you should be able to run and interact with the Currency Converter app successfully. The app provides a user-friendly interface for converting between different currencies using real-time exchange rates.