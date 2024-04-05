'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  Product.init({
    plu: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    created_user: DataTypes.STRING,
    created_date: DataTypes.DATE,
    updated_user: DataTypes.STRING,
    updated_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};