const express = require('express');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all goals for user
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create goal
router.post('/', auth, async (req, res) => {
  try {
    const goal = await Goal.create({
      name: req.body.name,
      targetAmount: req.body.target,
      currentAmount: req.body.current || 0,
      deadline: req.body.deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      category: req.body.category,
      icon: req.body.icon,
      color: req.body.color,
      user: req.user.id
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update goal
router.put('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        name: req.body.name,
        targetAmount: req.body.target,
        currentAmount: req.body.current,
        deadline: req.body.deadline,
        category: req.body.category,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add funds to goal
router.put('/:id/add-funds', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    goal.currentAmount = (goal.currentAmount || 0) + (req.body.amount || 0);
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }
    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed sample goals
router.post('/seed', auth, async (req, res) => {
  try {
    const sampleGoals = [
      { name: 'Emergency Fund', targetAmount: 100000, currentAmount: 45000, category: 'Savings', icon: 'MdShield', color: '#13ec5b', deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Vacation', targetAmount: 50000, currentAmount: 20000, category: 'Travel', icon: 'MdFlight', color: '#3b82f6', deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { name: 'New Car', targetAmount: 500000, currentAmount: 120000, category: 'Vehicle', icon: 'MdDirectionsCar', color: '#f97316', deadline: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000) },
      { name: 'Home Down Payment', targetAmount: 1000000, currentAmount: 300000, category: 'Housing', icon: 'MdHome', color: '#8b5cf6', deadline: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000) },
    ];
    
    await Goal.deleteMany({ user: req.user.id });
    
    await Goal.insertMany(
      sampleGoals.map(g => ({
        ...g,
        user: req.user.id
      }))
    );
    
    res.json({ message: 'Sample goals seeded successfully', count: sampleGoals.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
