from flask import Flask, request, jsonify
import json
import os
import uuid
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to the data file
DATA_FILE = 'data.json'

# Initialize data file if it doesn't exist
def initialize_data_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)

# Load transactions from the data file
def load_transactions():
    initialize_data_file()
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        # If the file is empty or invalid JSON, return an empty list
        return []

# Save transactions to the data file
def save_transactions(transactions):
    with open(DATA_FILE, 'w') as f:
        json.dump(transactions, f, indent=2)

# API Routes
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    transactions = load_transactions()
    # Sort transactions by date (newest first)
    transactions.sort(key=lambda x: x['date'], reverse=True)
    return jsonify(transactions)

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    
    # Validate required fields
    required_fields = ['amount', 'description', 'category', 'date', 'type']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Create new transaction with a unique ID
    new_transaction = {
        'id': str(uuid.uuid4()),
        'amount': float(data['amount']),
        'description': data['description'],
        'category': data['category'],
        'date': data['date'],
        'type': data['type'],
        'created_at': datetime.now().isoformat()
    }
    
    # Load existing transactions, add the new one, and save
    transactions = load_transactions()
    transactions.append(new_transaction)
    save_transactions(transactions)
    
    return jsonify(new_transaction), 201

@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    transactions = load_transactions()
    
    # Find and remove the transaction with the given ID
    updated_transactions = [t for t in transactions if t['id'] != transaction_id]
    
    # If no transactions were removed, return 404
    if len(updated_transactions) == len(transactions):
        return jsonify({"error": "Transaction not found"}), 404
    
    # Save the updated transactions list
    save_transactions(updated_transactions)
    
    return jsonify({"message": "Transaction deleted successfully"}), 200

@app.route('/api/transactions/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    data = request.json
    transactions = load_transactions()
    
    # Find the transaction with the given ID
    for i, transaction in enumerate(transactions):
        if transaction['id'] == transaction_id:
            # Update the transaction with the new data
            for key, value in data.items():
                if key in ['amount', 'description', 'category', 'date', 'type']:
                    transactions[i][key] = value
            
            # Save the updated transactions list
            save_transactions(transactions)
            
            return jsonify(transactions[i]), 200
    
    return jsonify({"error": "Transaction not found"}), 404

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    transactions = load_transactions()
    
    # Calculate statistics
    total_income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    total_expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    balance = total_income - total_expenses
    
    # Group expenses by category
    categories = {}
    for t in transactions:
        if t['type'] == 'expense':
            category = t['category']
            if category not in categories:
                categories[category] = 0
            categories[category] += t['amount']
    
    # Sort categories by amount (highest first)
    sorted_categories = [{"category": k, "amount": v} for k, v in categories.items()]
    sorted_categories.sort(key=lambda x: x['amount'], reverse=True)
    
    return jsonify({
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance,
        "categories": sorted_categories
    })

if __name__ == '__main__':
    initialize_data_file()
    app.run(debug=True)