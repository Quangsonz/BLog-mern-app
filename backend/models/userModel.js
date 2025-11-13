const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// có tác dụng lưu thông tin user vào database
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: [true, 'first name is required'],
        maxlength: 32,
    },

    email: {
        type: String,
        trim: true,
        required: [true, 'e-mail is required'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'password is required'],
        minlength: [6, 'password must have at least (6) caracters'],
    },

    avatar: {
        url: String,
        public_id: String,
    },

    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true })

// ==========================================
// 📊 INDEXES FOR PERFORMANCE OPTIMIZATION
// ==========================================

// Unique index on email (already enforced by unique: true, but explicit is better)
userSchema.index({ email: 1 }, { unique: true });

// Index for role-based queries
userSchema.index({ role: 1 });

// Index for sorting by creation date
userSchema.index({ createdAt: -1 });

// Compound index for role + date
userSchema.index({ role: 1, createdAt: -1 });


//encrypting password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})


// compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// return a JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}


module.exports = mongoose.model('User', userSchema);