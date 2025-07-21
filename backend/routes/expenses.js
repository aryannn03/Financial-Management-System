import express from 'express';
import Expense from '../models/Expense.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all expenses for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
});

// Add new expense
router.post('/', auth, async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    const expense = await Expense.create({
      user: req.user._id,
      description,
      amount,
      category,
      date,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add expense', error: err.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense', error: err.message });
  }
});

export default router; 