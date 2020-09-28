const express = require('express');
const router = express.Router();
const { auth, users } = require('../controllers');

router.post('/login', auth.middleware.authenticate, users.getUserInfo);
router.post('/register', auth.register);
router.get('/logout', auth.middleware.isAuthenticated, auth.logout);

//???
router.put('/edit', auth.middleware.isAuthenticated, auth.editUser);
router.delete('/delete', auth.middleware.isAuthenticated, auth.deleteAccount);
module.exports = router;
