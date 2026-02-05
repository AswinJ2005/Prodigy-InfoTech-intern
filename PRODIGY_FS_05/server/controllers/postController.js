const { Post, User, Like, Comment } = require('../models');
const fs = require('fs');
const path = require('path');

exports.createPost = async (req, res) => {
    try {
        const { caption, tags } = req.body;
        let mediaUrl = '';
        let mediaType = '';

        if (req.file) {
            mediaUrl = `/uploads/${req.file.filename}`;
            mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
        }

        const newPost = await Post.create({
            caption,
            mediaUrl,
            mediaType,
            tags: tags ? JSON.parse(tags) : [],
            userId: req.user.id
        });

        const post = await Post.findByPk(newPost.id, {
            include: [{ model: User, attributes: ['username', 'profilePic'] }]
        });

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['username', 'profilePic'] },
                { model: Like },
                { model: Comment, include: [{ model: User, attributes: ['username'] }] }
            ]
        });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['username', 'profilePic'] },
                { model: Like },
                { model: Comment }
            ]
        });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const like = await Like.findOne({
            where: { postId: id, userId: req.user.id }
        });

        if (like) {
            await like.destroy();
            return res.json({ msg: 'Post unliked' });
        }

        await Like.create({
            postId: id,
            userId: req.user.id
        });

        res.json({ msg: 'Post liked' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const newComment = await Comment.create({
            text,
            postId: id,
            userId: req.user.id
        });

        const comment = await Comment.findByPk(newComment.id, {
            include: [{ model: User, attributes: ['username', 'profilePic'] }]
        });

        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
