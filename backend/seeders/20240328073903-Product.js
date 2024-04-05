'use strict';
const fs = require('fs');
const path = require('path');
const { Product } = require('../models');

const filePath = path.join(__dirname, '../seed-data/product-data.json');
const productData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Product.bulkCreate(productData)
  },

  async down (queryInterface, Sequelize) {
    await Product.destroy({ truncate: true, cascade: true });
  }
};
