const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = new Category({
            name,
            description,
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
