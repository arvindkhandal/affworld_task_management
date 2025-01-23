const express = require('express');
const multer = require('multer');
const protect = require('../middlewares/auth.middleware');
// const { checkPermission } = require('../middlewares/auth.middleware');
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/post.controller');
const router = express.Router();
console.log("post route called");
const upload = multer();

// router.route('/createPost/:id').post(protect.verifyJWT, checkPermission('create_post'), upload.single('photo'), createPost);
router.route('/createPost/:id').post(protect.verifyJWT, upload.single('photo'), createPost);

router.route('/getAllPost').get(protect.verifyJWT, getAllPosts);

router.route('/postById/:id').get(protect.verifyJWT, getPostById).put(protect.verifyJWT, upload.single('photo'), updatePost).delete(protect.verifyJWT, deletePost);

module.exports = router;