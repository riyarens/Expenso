import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link 
} from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import './App.css';

// Initial Expense Data
const initialExpenses = [
  {
    id: 1,
    date: "2024-01-15",
    category: "Food",
    amount: 45.50,
    description: "Grocery shopping"
  },
  {
    id: 2, 
    date: "2024-01-20",
    category: "Transportation",
    amount: 30.00,
    description: "Uber rides"
  },
  {
    id: 3,
    date: "2024-01-22",
    category: "Entertainment",
    amount: 75.25,
    description: "Movie night"
  }
];

// Home Page Component
const HomePage = ({ expenses }) => {
  return (
    <div className="card">
      <h2>Recent Expenses</h2>
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{expense.date}</td>
              <td>{expense.category}</td>
              <td>${expense.amount.toFixed(2)}</td>
              <td>{expense.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Add Expense Page
const AddExpensePage = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    date: '',
    category: '',
    amount: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense({
      ...expense,
      id: Date.now(),
      amount: parseFloat(expense.amount)
    });
    
    // Reset form
    setExpense({
      date: '',
      category: '',
      amount: '',
      description: ''
    });
  };

  return (
    <div className="card">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit} className="input-group">
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          className="input-field"
          required
        />
        <select
          name="category"
          value={expense.category}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          className="input-field"
          step="0.01"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={expense.description}
          onChange={handleChange}
          className="input-field"
        />
        <button type="submit" className="btn">Add Expense</button>
      </form>
    </div>
  );
};

// Analysis Page
const AnalysisPage = ({ expenses }) => {
  // Prepare chart data
  const chartData = expenses.map(expense => ({
    date: expense.date,
    amount: expense.amount
  }));

  // Category breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div className="card">
      <h2>Expense Analysis</h2>
      
      <div className="chart-container">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#3498db" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="category-breakdown">
        {Object.entries(categoryBreakdown).map(([category, total]) => (
          <div key={category} className="card">
            <h3>{category}</h3>
            <p>${total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [expenses, setExpenses] = useState(initialExpenses);

  const addExpense = (newExpense) => {
    setExpenses(prev => [...prev, newExpense]);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navigation">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/add" className="nav-link">Add Expense</Link>
          <Link to="/analysis" className="nav-link">Analysis</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage expenses={expenses} />} />
          <Route path="/add" element={<AddExpensePage onAddExpense={addExpense} />} />
          <Route path="/analysis" element={<AnalysisPage expenses={expenses} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;