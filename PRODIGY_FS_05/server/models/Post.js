const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    caption: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mediaType: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: true
    },
    tags: {
        type: DataTypes.JSON, // Store tags as JSON array
        defaultValue: []
    }
}, {
    timestamps: true
});

module.exports = Post;
