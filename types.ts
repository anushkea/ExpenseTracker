export interface TransactionFormData {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Transaction extends TransactionFormData {
  id: string;
}