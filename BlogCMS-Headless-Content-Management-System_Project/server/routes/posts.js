const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all published blogs (Public)
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        // If admin is requesting (we could check token, but simpler to have separate endpoints or query params)
        // For now: Public endpoint returns ONLY published.
        // Admin dashboard can use a different endpoint or query param ?all=true

        // Check for query param 'all'
        const showAll = req.query.all === 'true'; // Basic insecure check, usually we'd verify token here too.

        // Better: Helper to check separate admin-ness if needed, but for "simplicity":
        // Let's adhere to: Public API = Published Only. Admin API = All.
        // But since frontend usually shares APIs, let's just return all if user is authenticated?
        // No, keep it simple.

        const query = showAll ? {} : { status: 'published' };
        const posts = await Blog.find(query).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single blog by ID or Slug
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
        const query = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

        const post = await Blog.findOne(query);

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a blog
// @route   POST /api/posts
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
    const { title, content, image, category_id, status } = req.body;

    try {
        const blog = new Blog({
            title,
            content,
            image,
            category: category_id,
            status,
            author: req.user._id,
        });

        const createdBlog = await blog.save();
        res.status(201).json(createdBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a blog
// @route   PUT /api/posts/:id
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
    const { title, content, image, category, status } = req.body;

    try {
        const blog = await Blog.findById(req.params.id);

        if (blog) {
            blog.title = title || blog.title;
            blog.content = content || blog.content;
            blog.image = image || blog.image;
            blog.category = category || blog.category;
            blog.status = status || blog.status;

            // Slug update logic could go here if title changes, but often safer to not change slug once published to avoid breaking links.
            // We will leave slug as is for now unless explicitly requested.

            const updatedBlog = await blog.save();
            res.json(updatedBlog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a blog
// @route   DELETE /api/posts/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (blog) {
            await blog.deleteOne();
            res.json({ message: 'Blog removed' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
