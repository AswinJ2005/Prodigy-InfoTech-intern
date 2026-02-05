const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, likePost, commentPost, getUserPosts } = require('../controllers/postController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes
router.post('/', auth, upload.single('media'), createPost);
router.get('/', auth, getAllPosts);
router.get('/user/:userId', auth, getUserPosts);
router.put('/like/:id', auth, likePost);
router.post('/comment/:id', auth, commentPost);

module.exports = router;
