const cloudinary = require('../utils/cloudinary');
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const ErrorResponse = require('../utils/errorResponse');
const { createNotification } = require('./notificationController');

//create post
exports.createPost = async (req, res, next) => {
    const { category, content, postedBy, image, likes, comments } = req.body;

    try {
        let postData = {
            category,
            content,
            postedBy: req.user._id,
        };

        // Only upload image if provided
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "posts",
                width: 1200,
                crop: "scale"
            });
            postData.image = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        const post = await Post.create(postData);

        // Save category to Category collection
        await Category.create({
            name: category,
            postedBy: req.user._id,
            postId: post._id
        });

        res.status(201).json({
            success: true,
            post
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}


//show posts with pagination, filtering, and sorting
exports.showPost = async (req, res, next) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter query
        const filter = {};
        
        // Category filter
        if (req.query.category && req.query.category !== 'All Posts') {
            filter.category = req.query.category;
        }

        // Build sort query
        let sortQuery = { createdAt: -1 }; // Default: Latest
        
        if (req.query.sort) {
            switch (req.query.sort) {
                case '-likes':
                    // Sort by number of likes (descending)
                    sortQuery = { likes: -1, createdAt: -1 };
                    break;
                case '-comments':
                    // Sort by number of comments (descending)
                    sortQuery = { comments: -1, createdAt: -1 };
                    break;
                case '-createdAt':
                default:
                    sortQuery = { createdAt: -1 };
                    break;
            }
        }

        // Get total count for pagination metadata with filter
        const totalPosts = await Post.countDocuments(filter);

        // Fetch posts with pagination, filtering, sorting, and optimization
        let query = Post.find(filter)
            .skip(skip)
            .limit(limit)
            .populate('postedBy', 'name email avatar')
            .select('-__v') // Exclude version field
            .lean(); // Convert to plain JavaScript objects for better performance

        // For likes and comments sorting, we need to calculate lengths
        if (req.query.sort === '-likes' || req.query.sort === '-comments') {
            const posts = await Post.find(filter)
                .skip(skip)
                .limit(limit)
                .populate('postedBy', 'name email avatar')
                .select('-__v')
                .lean();

            // Sort by array length in memory
            posts.sort((a, b) => {
                if (req.query.sort === '-likes') {
                    return (b.likes?.length || 0) - (a.likes?.length || 0);
                } else {
                    return (b.comments?.length || 0) - (a.comments?.length || 0);
                }
            });

            return res.status(200).json({
                success: true,
                posts,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalPosts / limit),
                    totalPosts,
                    postsPerPage: limit,
                }
            });
        }

        // Execute query for date sorting
        const posts = await query.sort(sortQuery);

        res.status(200).json({
            success: true,
            posts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts,
                postsPerPage: limit,
                hasNextPage: page < Math.ceil(totalPosts / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        next(error);
    }
}


//show single post
exports.showSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('postedBy', 'name email avatar')
            .populate('comments.postedBy', 'name avatar');
        res.status(200).json({
            success: true,
            post
        })
    } catch (error) {
        next(error);
    }

}


//delete post
exports.deletePost = async (req, res, next) => {
    try {
        const currentPost = await Post.findById(req.params.id);
        
        if (!currentPost) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Check if user is owner or admin
        if (currentPost.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return next(new ErrorResponse('You are not authorized to delete this post', 403));
        }

        //delete post image in cloudinary       
        const ImgId = currentPost.image.public_id;
        if (ImgId) {
            await cloudinary.uploader.destroy(ImgId);
        }

        const post = await Post.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "post deleted"
        })

    } catch (error) {
        next(error);
    }

}


//update post
exports.updatePost = async (req, res, next) => {
    try {
        const { category, content, image } = req.body;
        const currentPost = await Post.findById(req.params.id);

        if (!currentPost) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Check if user is owner or admin
        if (currentPost.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return next(new ErrorResponse('You are not authorized to update this post', 403));
        }

        //build the object data
        const data = {
            category: category || currentPost.category,
            content: content || currentPost.content,
        }

        //modify post image conditionally
        if (req.body.image !== '' && req.body.image !== undefined && req.body.image !== null) {
            // Delete old image if exists
            const ImgId = currentPost.image?.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'posts',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }
        } else if (currentPost.image) {
            // Keep existing image if no new image provided
            data.image = currentPost.image;
        }

        const postUpdate = await Post.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            postUpdate
        })

    } catch (error) {
        next(error);
    }

}

//add comment
exports.addComment = async (req, res, next) => {
    const { comment } = req.body;
    try {
        const postComment = await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: { text: comment, postedBy: req.user._id } }
        },
            { new: true }
        );
        const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email avatar');
        
        // Create notification for post owner
        if (post.postedBy._id.toString() !== req.user._id.toString()) {
            const notification = await createNotification({
                recipient: post.postedBy._id,
                sender: req.user._id,
                post: post._id,
                type: 'comment',
                message: `${req.user.name} commented on your post`
            });
            
            if (notification && global.io) {
                // Emit socket event for real-time notification
                const populatedNotification = await notification.populate('sender', 'name avatar');
                global.io.to(`user-${post.postedBy._id}`).emit('new-notification', {
                    ...populatedNotification.toObject(),
                    unreadCount: true
                });
            }
        }
        
        res.status(200).json({
            success: true,
            post
        })

    } catch (error) {
        next(error);
    }

}


//add like
exports.addLike = async (req, res, next) => {

    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: req.user._id }
        },
            { new: true }
        ).populate('postedBy', '_id name avatar');
        
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name avatar');
        if (global.io) {
            global.io.emit('add-like', posts);
        }
        
        // Create notification for post owner
        if (post.postedBy._id.toString() !== req.user._id.toString()) {
            const notification = await createNotification({
                recipient: post.postedBy._id,
                sender: req.user._id,
                post: post._id,
                type: 'like',
                message: `${req.user.name} liked your post`
            });
            
            if (notification && global.io) {
                // Emit socket event for real-time notification
                const populatedNotification = await notification.populate('sender', 'name avatar');
                global.io.to(`user-${post.postedBy._id}`).emit('new-notification', {
                    ...populatedNotification.toObject(),
                    unreadCount: true
                });
            }
        }

        res.status(200).json({
            success: true,
            post,
            posts
        })

    } catch (error) {
        next(error);
    }

}


//remove like
exports.removeLike = async (req, res, next) => {

    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id }
        },
            { new: true }
        );

        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name avatar');
        if (global.io) {
            global.io.emit('remove-like', posts);
        }

        res.status(200).json({
            success: true,
            post
        })

    } catch (error) {
        next(error);
    }

}


// tìm kiếm bài viết với thuật toán 
exports.searchPosts = async (req, res, next) => {
    try {
        const { query, sortBy = 'relevance', page = 1, limit = 10 } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchQuery = query.trim();
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // ============================================
        // 🔍 TÌM KIẾM ĐƠN GIẢN (Simple Regex Search)
        // ============================================
        const searchRegex = new RegExp(searchQuery, 'i'); // Case-insensitive
        
        // First, populate postedBy to search by username
        const allPosts = await Post.find()
            .populate('postedBy', 'name avatar')
            .lean();
        
        // Filter posts that match category, content, or username
        const filteredPosts = allPosts.filter(post => {
            const category = (post.category || '').toLowerCase();
            const content = (post.content || '').toLowerCase();
            const username = (post.postedBy?.name || '').toLowerCase();
            const query = searchQuery.toLowerCase();
            
            return category.includes(query) || 
                   content.includes(query) || 
                   username.includes(query);
        });

        // ============================================
        // 📊 CHẤM ĐIỂM ĐƠN GIẢN (Simple Scoring)
        // ============================================
        const scoredPosts = filteredPosts.map(post => {
            let score = 0;
            const categoryLower = (post.category || '').toLowerCase();
            const contentLower = (post.content || '').toLowerCase();
            const usernameLower = (post.postedBy?.name || '').toLowerCase();
            const queryLower = searchQuery.toLowerCase();

            // 1. Khớp chính xác trong category = 100 điểm
            if (categoryLower === queryLower) {
                score += 100;
            }
            // 2. Chứa query trong category = 50 điểm
            else if (categoryLower.includes(queryLower)) {
                score += 50;
            }

            // 3. Khớp chính xác trong username = 80 điểm
            if (usernameLower === queryLower) {
                score += 80;
            }
            // 4. Chứa query trong username = 40 điểm
            else if (usernameLower.includes(queryLower)) {
                score += 40;
            }

            // 5. Chứa query trong content = 20 điểm
            if (contentLower.includes(queryLower)) {
                score += 20;
            }

            // 6. Điểm từ likes (Social proof)
            score += (post.likes?.length || 0) * 1;

            // 7. Điểm từ comments (Engagement)
            score += (post.comments?.length || 0) * 0.5;

            // 8. Điểm từ độ mới (Freshness)
            const daysOld = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            if (daysOld < 7) {
                score += 10; // Bài mới (<7 ngày)
            } else if (daysOld < 30) {
                score += 5; // Bài gần đây (<30 ngày)
            }

            return {
                ...post,
                relevanceScore: Math.round(score)
            };
        });

        // ============================================
        // 🔄 SẮP XẾP (Sorting)
        // ============================================
        if (sortBy === 'relevance') {
            scoredPosts.sort((a, b) => b.relevanceScore - a.relevanceScore);
        } else if (sortBy === 'likes') {
            scoredPosts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        } else if (sortBy === 'recent') {
            scoredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // ============================================
        // 📄 PHÂN TRANG (Pagination)
        // ============================================
        const totalResults = scoredPosts.length;
        const posts = scoredPosts.slice(skip, skip + parseInt(limit));

        res.status(200).json({
            success: true,
            posts,
            totalResults,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalResults / parseInt(limit)),
            query: searchQuery,
            algorithm: 'Enhanced Search with Username',
            features: {
                usernameSearch: true,
                categorySearch: true,
                contentSearch: true,
                smartScoring: true,
                sorting: true,
                pagination: true
            }
        });

    } catch (error) {
        console.log('Search error:', error);
        next(error);
    }
};


// dùng để lấy gợi ý tìm kiếm dựa trên đầu vào một phần
exports.getSearchSuggestions = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length < 2) {
            // Nếu không có query, trả về trending topics
            const trendingPosts = await Post.find()
                .sort({ likes: -1, createdAt: -1 })
                .limit(5)
                .populate('postedBy', 'name')
                .select('category content postedBy')
                .lean();

            const trendingSuggestions = trendingPosts.map(post => {
                const preview = post.content.substring(0, 50);
                return {
                    text: post.category,
                    type: 'trending',
                    subtitle: `${preview}... - by ${post.postedBy?.name || 'Unknown'}`
                };
            });

            return res.status(200).json({
                success: true,
                suggestions: trendingSuggestions
            });
        }

        const searchQuery = query.trim().toLowerCase();
        
        // ============================================
        // 💡 GỢI Ý THÔNG MINH (Smart Suggestions)
        // ============================================
        
        // 1. Lấy tất cả posts với user info
        const allPosts = await Post.find()
            .populate('postedBy', 'name')
            .select('category content postedBy likes comments createdAt')
            .lean();

        // 2. Tạo suggestions từ nhiều nguồn
        const suggestions = new Map(); // Dùng Map để tránh trùng lặp

        allPosts.forEach(post => {
            const category = (post.category || '').toLowerCase();
            const content = (post.content || '').toLowerCase();
            const username = (post.postedBy?.name || '').toLowerCase();
            
            // Tính độ phù hợp (similarity score)
            const categoryScore = calculateSimilarity(searchQuery, category);
            const contentScore = calculateSimilarity(searchQuery, content);
            const usernameScore = calculateSimilarity(searchQuery, username);
            
            // Thêm suggestion từ category
            if (categoryScore > 0.3 && post.category) {
                const key = `category:${post.category}`;
                if (!suggestions.has(key)) {
                    suggestions.set(key, {
                        text: post.category,
                        type: 'category',
                        score: categoryScore * 100,
                        subtitle: `${post.likes?.length || 0} likes`
                    });
                }
            }
            
            // Thêm suggestion từ username
            if (usernameScore > 0.3 && post.postedBy?.name) {
                const key = `user:${post.postedBy.name}`;
                if (!suggestions.has(key)) {
                    suggestions.set(key, {
                        text: post.postedBy.name,
                        type: 'user',
                        score: usernameScore * 100,
                        subtitle: 'Author'
                    });
                }
            }
            
            // Thêm suggestion từ content (keywords)
            if (contentScore > 0.2) {
                const words = post.content.split(/\s+/).filter(w => w.length > 3);
                words.forEach(word => {
                    const wordLower = word.toLowerCase();
                    if (wordLower.includes(searchQuery) || searchQuery.includes(wordLower)) {
                        const key = `keyword:${word}`;
                        if (!suggestions.has(key)) {
                            suggestions.set(key, {
                                text: word,
                                type: 'keyword',
                                score: contentScore * 50,
                                subtitle: 'Keyword'
                            });
                        }
                    }
                });
            }
        });

        // 3. Sắp xếp theo score và lấy top suggestions
        const sortedSuggestions = Array.from(suggestions.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        res.status(200).json({
            success: true,
            suggestions: sortedSuggestions
        });

    } catch (error) {
        console.log('Suggestions error:', error);
        next(error);
    }
};

// Helper function: Tính độ tương đồng giữa 2 chuỗi (Simple fuzzy matching)
// cái này có liên quan đến cái tìm kiếm ở trên 
// giúp so sánh mức độ giống nhau giữa hai chuỗi văn bản để hỗ trợ trong việc gợi ý tìm kiếm.
function calculateSimilarity(str1, str2) {
    if (str1 === str2) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;
    
    // Kiểm tra contains
    if (str2.includes(str1)) {
        return 0.8 + (str1.length / str2.length) * 0.2;
    }
    if (str1.includes(str2)) {
        return 0.8 + (str2.length / str1.length) * 0.2;
    }
    
    // Tính Levenshtein distance
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Fill matrix để tính khoảng cách của Levenshtein
    // levenshtein distance là khoảng cách giữa hai chuỗi
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return 1 - (distance / maxLen);
}


// lấy trending topic 
exports.getTrendingTopics = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        
        // Aggregate posts by category with counts and likes
        const trendingTopics = await Post.aggregate([
            {
                $group: {
                    _id: '$category',
                    postCount: { $sum: 1 },
                    totalLikes: { $sum: { $size: '$likes' } },
                    totalComments: { $sum: { $size: '$comments' } },
                    latestPost: { $max: '$createdAt' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    postCount: 1,
                    totalLikes: 1,
                    totalComments: 1,
                    latestPost: 1,
                    // Calculate trending score: likes + comments + recency bonus
                    trendingScore: {
                        $add: [
                            '$totalLikes',
                            { $multiply: ['$totalComments', 0.5] },
                            '$postCount'
                        ]
                    }
                }
            },
            {
                $sort: { trendingScore: -1, postCount: -1 }
            },
            {
                $limit: limit
            }
        ]);

        res.status(200).json({
            success: true,
            topics: trendingTopics
        });

    } catch (error) {
        console.log('Trending topics error:', error);
        next(error);
    }
};


// Get suggested users (most active or newest users)
exports.getSuggestedUsers = async (req, res, next) => {
    try {
        const User = require('../models/userModel');
        const limit = parseInt(req.query.limit) || 5;
        const currentUserId = req.user ? req.user._id : null;
        
        // Get users with their post counts
        const users = await User.aggregate([
            // Exclude current user if logged in
            ...(currentUserId ? [{ $match: { _id: { $ne: currentUserId } } }] : []),
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'postedBy',
                    as: 'posts'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    avatar: 1,
                    createdAt: 1,
                    postCount: { $size: '$posts' },
                    totalLikes: {
                        $sum: {
                            $map: {
                                input: '$posts',
                                as: 'post',
                                in: { $size: '$$post.likes' }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    activityScore: {
                        $add: [
                            { $multiply: ['$postCount', 10] },
                            '$totalLikes'
                        ]
                    }
                }
            },
            {
                $sort: { activityScore: -1, createdAt: -1 }
            },
            {
                $limit: limit
            }
        ]);

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.log('Suggested users error:', error);
        next(error);
    }
};