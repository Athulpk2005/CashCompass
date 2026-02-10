const express = require('express');
const Investment = require('../models/Investment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all investments for user
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const query = { user: req.user.id };
    
    if (type) query.type = type;

    const investments = await Investment.find(query).sort({ purchaseDate: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create investment
router.post('/', auth, async (req, res) => {
  try {
    const investment = await Investment.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update investment
router.put('/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.json(investment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete investment
router.delete('/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.json({ message: 'Investment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
