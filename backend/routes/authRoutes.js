const express = require('express');
const router = express.Router();
const { signup, signin, logout, userProfile, updateAvatar, getAllUsers, deleteUser, updateUserRole } = require('../controllers/authController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

//auth routes
// /api/signup
router.post('/signup', signup);
// /api/signin
router.post('/signin', signin);
// /api/logout
router.get('/logout', logout);
// /api/me
router.get('/me', isAuthenticated, userProfile);
// /api/update/avatar
router.put('/update/avatar', isAuthenticated, updateAvatar);
// /api/users
router.get('/users', isAuthenticated, isAdmin, getAllUsers);
// /api/user/delete/:id
router.delete('/user/delete/:id', isAuthenticated, isAdmin, deleteUser);
// /api/user/role/:id
router.put('/user/role/:id', isAuthenticated, isAdmin, updateUserRole);

module.exports = router;