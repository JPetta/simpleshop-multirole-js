'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const filePath = path.join(__dirname, '../seed-data/user.json');
const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedUserData = await Promise.all(userData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword };
    }));

    await User.bulkCreate(hashedUserData);
  },

  async down (queryInterface, Sequelize) {
    await User.destroy({ truncate: true, cascade: true });
  }
};
