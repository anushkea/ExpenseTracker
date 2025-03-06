import React from 'react';
import { Transaction } from '../types';
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  timePeriod: 'week' | 'month' | 'year';
}

export function CategorySummary({ transactions, timePeriod }: Props) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<'week' | 'month' | 'year'>(timePeriod);
  const [activeTab, setActiveTab] = React.useState<'expense' | 'income'>('expense');
  
  // Filter transactions based on the selected time period
  const filteredTransactions = React.useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    if (selectedPeriod === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (selectedPeriod === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (selectedPeriod === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  }, [transactions, selectedPeriod]);
  
  // Group by category based on active tab
  const categorySummary = React.useMemo(() => {
    const summary: Record<string, number> = {};
    
    filteredTransactions
      .filter(t => t.type === activeTab)
      .forEach(transaction => {
        const { category, amount } = transaction;
        if (!summary[category]) {
          summary[category] = 0;
        }
        summary[category] += amount;
      });
    
    // Convert to array and sort by amount (highest first)
    return Object.entries(summary)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, activeTab]);
  
  const periodLabel = React.useMemo(() => {
    switch (selectedPeriod) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  }, [selectedPeriod]);

  const totalAmount = React.useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === activeTab)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions, activeTab]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
            <BarChart3 className="w-6 h-6 text-purple-500 dark:text-purple-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Category Summary</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-4 py-2 flex items-center transition-colors duration-200 ${
                activeTab === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-4 py-2 flex items-center transition-colors duration-200 ${
                activeTab === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Income
            </button>
          </div>
          
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
              className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                {activeTab === 'expense' ? 'Expenses' : 'Income'} {periodLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {categorySummary.length > 0 ? (
              categorySummary.map(({ category, amount }) => (
                <tr key={category} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200">
                  <td className="py-3 px-4 capitalize text-gray-900 dark:text-white">{category}</td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    activeTab === 'expense' 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    ${amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  No {activeTab === 'expense' ? 'expenses' : 'income'} found for {periodLabel.toLowerCase()}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 dark:bg-gray-750 transition-colors duration-200">
              <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">Total</td>
              <td className={`py-3 px-4 text-right font-bold ${
                activeTab === 'expense' 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                ${totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}