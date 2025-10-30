const cloudinary = require('../utils/cloudinary');
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const ErrorResponse = require('../utils/errorResponse');
const { createNotification } = require('./notificationController');

//create post
exports.createPost = async (req, res, next) => {
    const { category, content, postedBy, image, likes, comments } = req.body;

    try {
        //upload image in cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "posts",
            width: 1200,
            crop: "scale"
        })
        const post = await Post.create({
            category,
            content,
            postedBy: req.user._id,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },

        });

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


//show posts
exports.showPost = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name email avatar');
        res.status(201).json({
            success: true,
            posts
        })
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
            image: image || currentPost.image,
        }

        //modify post image conditionally
        if (req.body.image !== '') {

            const ImgId = currentPost.image.public_id;
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
        ).populate('postedBy', '_id name');
        
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
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

        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
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


// Intelligent Search with relevance scoring
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
        // Chỉ dùng regex cơ bản - dễ hiểu, dễ maintain
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


// Get search suggestions based on partial input
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

    // Fill matrix
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