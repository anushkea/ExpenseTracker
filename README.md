# Expense Tracker

A full-stack expense tracking application with React frontend and Flask backend.

## Features

- Add and delete income and expense transactions
- Filter transactions by type (income/expense)
- Persistent data storage in JSON file
- Real-time balance calculation
- Category-based transaction organization

## Setup Instructions

### Backend Setup

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the Flask backend:
   ```
   python app.py
   ```
   The backend will run on http://127.0.0.1:5000

### Frontend Setup

1. Install Node.js dependencies:
   ```
   npm install
   ```

2. Run the React frontend:
   ```
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## Usage

1. Add transactions using the form on the left
2. View your transactions in the list on the right
3. Filter transactions by clicking the All/Income/Expenses buttons
4. Delete transactions by clicking the Delete button next to each transaction
5. View your financial summary in the dashboard at the top

## Data Storage

All transactions are stored in a `data.json` file in the root directory. This ensures your data persists between sessions.

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add a new transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `PUT /api/transactions/:id` - Update a transaction
- `GET /api/statistics` - Get financial statistics