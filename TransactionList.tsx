import React from 'react';
import { ListFilter, TrendingDown, TrendingUp, Trash2 } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: Props) {
  const [filter, setFilter] = React.useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
            <ListFilter className="w-6 h-6 text-blue-500 dark:text-blue-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transactions</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filter === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filter === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
          >
            <div className="flex items-center">
              {transaction.type === 'income' ? (
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                  <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-300" />
                </div>
              ) : (
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-3">
                  <TrendingDown className="w-5 h-5 text-red-500 dark:text-red-300" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{transaction.description}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="capitalize">{transaction.category}</span> • {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </span>
              <button
                onClick={() => onDelete(transaction.id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 p-1"
                aria-label="Delete transaction"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No transactions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}