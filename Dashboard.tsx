import React from 'react';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: Props) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Balance</p>
            <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
              ${balance.toFixed(2)}
            </h3>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <DollarSign className="w-6 h-6 text-blue-500 dark:text-blue-300" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {balance >= 0 ? 'You\'re doing great!' : 'You\'re spending more than you earn'}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Income</p>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${totalIncome.toFixed(2)}
            </h3>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <TrendingUp className="w-6 h-6 text-green-500 dark:text-green-300" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {transactions.filter(t => t.type === 'income').length} income transactions
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${totalExpenses.toFixed(2)}
            </h3>
          </div>
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
            <TrendingDown className="w-6 h-6 text-red-500 dark:text-red-300" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {transactions.filter(t => t.type === 'expense').length} expense transactions
          </p>
        </div>
      </div>
    </div>
  );
}