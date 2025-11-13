const express = require('express');
const router = express.Router();
const { createPost, showPost, showSinglePost, deletePost, updatePost, addComment, addLike, removeLike, searchPosts, getSearchSuggestions } = require('../controllers/postController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

//blog routes
router.post('/post/create', isAuthenticated, createPost);
router.get('/posts/show', showPost);
router.get('/post/:id', showSinglePost);
router.delete('/post/delete/:id', isAuthenticated, deletePost); // Changed: removed isAdmin, now checks ownership in controller
router.put('/post/update/:id', isAuthenticated, updatePost); // Changed: removed isAdmin, now checks ownership in controller
router.put('/comment/post/:id', isAuthenticated, addComment);
router.put('/addlike/post/:id', isAuthenticated, addLike);
router.put('/removelike/post/:id', isAuthenticated, removeLike);

// Search routes
router.get('/posts/search', searchPosts);
router.get('/posts/suggestions', getSearchSuggestions);

// Trending and suggestions routes
router.get('/posts/trending-topics', require('../controllers/postController').getTrendingTopics);
router.get('/posts/suggested-users', require('../controllers/postController').getSuggestedUsers);
router.get('/posts/category-counts', require('../controllers/postController').getCategoryCounts);

// Admin routes
router.get('/posts/admin/all', isAuthenticated, isAdmin, require('../controllers/postController').getAllPostsForAdmin);
router.get('/posts/admin/dashboard-stats', isAuthenticated, isAdmin, require('../controllers/postController').getDashboardStats);

module.exports = router;