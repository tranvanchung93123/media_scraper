// models/ImageVideo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import the Sequelize instance

const ImageVideo = sequelize.define('ImageVideo', {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
  },
  src: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ImageVideo;
