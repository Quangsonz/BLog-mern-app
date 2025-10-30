const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "category name is required"],
            enum: ['Technology', 'Design', 'Business', 'Lifestyle', 'Other']
        },
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
        postId: {
            type: ObjectId,
            ref: "Post",
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
