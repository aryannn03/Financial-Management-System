import express from 'express';
import Income from '../models/Income.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all income for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch income', error: err.message });
  }
});

// Add new income
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const income = await Income.create({
      user: req.user._id,
      amount,
      category,
      date,
      note,
    });
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add income', error: err.message });
  }
});

// Update income
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { amount, category, date, note },
      { new: true }
    );
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json(income);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update income', error: err.message });
  }
});

// Delete income
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json({ message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete income', error: err.message });
  }
});

export default router; 