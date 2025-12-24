const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: false, // Optional for now
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save middleware to generate slug if not provided or title changed
// For simplicity, we assume slug is sent from frontend or generated here.
// Let's generate it here if missing.
blogSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
