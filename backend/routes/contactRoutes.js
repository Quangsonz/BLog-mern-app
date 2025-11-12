const express = require('express');
const router = express.Router();
const { 
    createContact, 
    getAllContacts, 
    getContact, 
    updateContactStatus, 
    deleteContact 
} = require('../controllers/contactController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public route
router.post('/contact/create', createContact);

// Admin routes
router.get('/contacts', isAuthenticated, isAdmin, getAllContacts);
router.get('/contact/:id', isAuthenticated, isAdmin, getContact);
router.put('/contact/status/:id', isAuthenticated, isAdmin, updateContactStatus);
router.delete('/contact/delete/:id', isAuthenticated, isAdmin, deleteContact);

module.exports = router;
