const cloudinary = require('../utils/cloudinary');
const Post = require('../models/postModel');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');

//create post
exports.createPost = async (req, res, next) => {
    const { title, content, postedBy, image, likes, comments } = req.body;

    try {
        //upload image in cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "posts",
            width: 1200,
            crop: "scale"
        })
        const post = await Post.create({
            title,
            content,
            postedBy: req.user._id,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },

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
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
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
        const post = await Post.findById(req.params.id).populate('comments.postedBy', 'name');
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
        const { title, content, image } = req.body;
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
            title: title || currentPost.title,
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
        const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email');
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
        );
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        main.io.emit('add-like', posts);

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
        main.io.emit('remove-like', posts);

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

        // Multi-field search with different strategies
        let posts = [];
        let totalResults = 0;

        // Strategy 1: Full-text search with MongoDB text index
        const textSearchResults = await Post.find(
            { $text: { $search: searchQuery } },
            { score: { $meta: "textScore" } }
        )
        .populate('postedBy', 'name avatar')
        .sort(sortBy === 'relevance' ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        // Strategy 2: Fuzzy search using regex for partial matches
        const regexPattern = searchQuery.split(' ').map(word => 
            `(?=.*${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`
        ).join('');
        
        const fuzzySearchResults = await Post.find({
            $or: [
                { title: { $regex: regexPattern, $options: 'i' } },
                { content: { $regex: regexPattern, $options: 'i' } }
            ]
        })
        .populate('postedBy', 'name avatar')
        .sort(sortBy === 'relevance' ? { createdAt: -1 } : { createdAt: -1 })
        .limit(parseInt(limit));

        // Merge and deduplicate results
        const seenIds = new Set();
        const mergedPosts = [...textSearchResults, ...fuzzySearchResults].filter(post => {
            if (seenIds.has(post._id.toString())) {
                return false;
            }
            seenIds.add(post._id.toString());
            return true;
        });

        // Calculate relevance score for each post
        const scoredPosts = mergedPosts.map(post => {
            let relevanceScore = 0;
            const titleLower = post.title.toLowerCase();
            const contentLower = post.content.toLowerCase();
            const queryLower = searchQuery.toLowerCase();
            const queryWords = queryLower.split(' ');

            // Exact match in title (highest score)
            if (titleLower === queryLower) {
                relevanceScore += 100;
            } else if (titleLower.includes(queryLower)) {
                relevanceScore += 50;
            }

            // Word matches in title
            queryWords.forEach(word => {
                if (titleLower.includes(word)) {
                    relevanceScore += 10;
                }
            });

            // Content matches (lower weight)
            if (contentLower.includes(queryLower)) {
                relevanceScore += 20;
            }
            queryWords.forEach(word => {
                if (contentLower.includes(word)) {
                    relevanceScore += 3;
                }
            });

            // Boost score for more likes (social proof)
            relevanceScore += post.likes.length * 0.5;

            // Boost score for more comments (engagement)
            relevanceScore += post.comments.length * 0.3;

            // Recency boost (newer posts get slight advantage)
            const daysSincePost = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSincePost < 7) {
                relevanceScore += 5;
            } else if (daysSincePost < 30) {
                relevanceScore += 2;
            }

            return {
                ...post.toObject(),
                relevanceScore
            };
        });

        // Sort by relevance score if requested
        if (sortBy === 'relevance') {
            scoredPosts.sort((a, b) => b.relevanceScore - a.relevanceScore);
        } else if (sortBy === 'likes') {
            scoredPosts.sort((a, b) => b.likes.length - a.likes.length);
        } else if (sortBy === 'recent') {
            scoredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Paginate results
        posts = scoredPosts.slice(0, parseInt(limit));
        totalResults = scoredPosts.length;

        res.status(200).json({
            success: true,
            posts,
            totalResults,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalResults / parseInt(limit)),
            query: searchQuery
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
            return res.status(200).json({
                success: true,
                suggestions: []
            });
        }

        const searchQuery = query.trim();
        const regexPattern = new RegExp(searchQuery.split('').join('.*'), 'i');

        // Get unique titles that match
        const titleSuggestions = await Post.find({
            title: { $regex: regexPattern }
        })
        .select('title')
        .limit(5)
        .lean();

        // Get unique words from content
        const contentSuggestions = await Post.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ]
        })
        .select('title')
        .limit(5)
        .lean();

        // Combine and deduplicate suggestions
        const allSuggestions = [...titleSuggestions, ...contentSuggestions];
        const uniqueSuggestions = [...new Set(allSuggestions.map(s => s.title))];

        res.status(200).json({
            success: true,
            suggestions: uniqueSuggestions.slice(0, 8)
        });

    } catch (error) {
        console.log('Suggestions error:', error);
        next(error);
    }
};