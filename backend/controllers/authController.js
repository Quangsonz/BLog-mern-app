
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../utils/cloudinary');

exports.signup = async (req, res, next) => {
    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        return next(new ErrorResponse("E-mail already registred", 400));
    }
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
}


exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email) {
            return next(new ErrorResponse("please add an email", 403));
        }
        if (!password) {
            return next(new ErrorResponse("please add a password", 403));
        }

        //check user email
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("invalid credentials", 400));
        }
        //check password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse("invalid credentials", 400));
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
}

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    const options = { maxAge: 60 * 60 * 1000, httpOnly: true }
    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }
    res
        .status(codeStatus)
        .cookie('token', token, options)
        .json({
            success: true,
            id: user._id,
            role: user.role
        })
}

//log out
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "logged out"
    })
}


//user profile
exports.userProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
        success: true,
        user
    })
}

//update avatar
exports.updateAvatar = async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Delete old avatar from cloudinary if exists
        if (user.avatar && user.avatar.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        // Upload new avatar
        const result = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 200,
            height: 200,
            crop: "fill",
            gravity: "face"
        });

        user.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Get all users with pagination and statistics (Admin only)
exports.getAllUsers = async (req, res, next) => {
    try {
        const Post = require('../models/postModel');
        
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count
        const totalUsers = await User.countDocuments();

        // Fetch users with pagination
        const users = await User.find()
            .select('-password -__v') // Exclude sensitive fields
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(); // Better performance

        // Enrich users with posts statistics
        const enrichedUsers = await Promise.all(users.map(async (user) => {
            const posts = await Post.find({ postedBy: user._id })
                .select('likes comments')
                .lean();
            
            const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
            const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
            
            return {
                ...user,
                postsCount: posts.length,
                totalLikes,
                totalComments
            };
        }));

        res.status(200).json({
            success: true,
            users: enrichedUsers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                usersPerPage: limit,
                hasNextPage: page < Math.ceil(totalUsers / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Delete user (Admin only)
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user.id) {
            return next(new ErrorResponse('You cannot delete yourself', 400));
        }

        await user.deleteOne();
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Update user role (Admin only)
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return next(new ErrorResponse('Invalid role', 400));
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Prevent changing your own role
        if (user._id.toString() === req.user.id) {
            return next(new ErrorResponse('You cannot change your own role', 400));
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
