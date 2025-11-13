const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: [true, "category is required"],
            enum: ['Technology', 'Design', 'Business', 'Lifestyle', 'Other']
        },
        content: {
            type: String,
            required: [true, "content is required"],
        },
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
        image: {
            url: String,
            public_id: String,
        },
        likes: [{ type: ObjectId, ref: "User" }],
        comments: [
            {
                text: String,
                created: { type: Date, default: Date.now },
                postedBy: {
                    type: ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    { timestamps: true }
);

// ==========================================
// 📊 INDEXES FOR PERFORMANCE OPTIMIZATION
// ==========================================

// Index for sorting by creation date (most common query)
postSchema.index({ createdAt: -1 });

// Index for category filtering
postSchema.index({ category: 1 });

// Index for finding posts by user
postSchema.index({ postedBy: 1 });

// Compound index for category + date sorting
postSchema.index({ category: 1, createdAt: -1 });

// Text index for search functionality
postSchema.index({ 
    content: 'text', 
    category: 'text' 
}, {
    weights: {
        category: 10,  // Category has higher weight in search
        content: 5
    }
});

module.exports = mongoose.model('Post', postSchema);