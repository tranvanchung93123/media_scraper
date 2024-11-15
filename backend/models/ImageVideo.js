const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ImageVideo = sequelize.define('ImageVideo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // 'image' or 'video'
    allowNull: false,
  },
  src: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'ImageVideos', // Match your database table name
  timestamps: false,
});

module.exports = ImageVideo;
