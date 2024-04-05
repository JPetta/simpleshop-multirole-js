// productController.js
const { Product, ProductCategory } = require('../models'); // Import the Product model

// Controller functions for CRUD operations on products
const productController = {
  // Create a new product
  async createProduct(req, res) {
    try {
      const { name, description, price } = req.body;
      const product = await Product.create({ name, description, price });
      res.status(201).json({ message: 'Product created successfully', code: 201, data: product });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Failed to create product', code: 500 });
    }
  },

  // Get all products with pagination
  async getAllProducts(req, res) {
    try {
      const { skip = 0, take = 10, page = 1, pageSize = 10 } = req.query;
      const offset = parseInt(skip);
      const limit = parseInt(take);

      const products = await Product.findAndCountAll({
        include: ProductCategory,
        offset,
        limit
      });

      const totalPages = Math.ceil(products.count / pageSize);

      res.json({ 
        message: 'Products fetched successfully', 
        code: 200, 
        data: products.rows,
        pagination: {
          totalItems: products.count,
          totalPages,
          currentPage: parseInt(page),
          pageSize
        }
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products', code: 500 });
    }
  },

  // Get a single product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: ProductCategory
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found', code: 404 });
      }
      res.json({ message: 'Product fetched successfully', code: 200, data: product });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Failed to fetch product', code: 500 });
    }
  },

  // Update a product by ID
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      let product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found', code: 404 });
      }
      product = await product.update({ name, description, price });
      res.json({ message: 'Product updated successfully', code: 200, data: product });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Failed to update product', code: 500 });
    }
  },

  // Delete a product by ID
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      let product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found', code: 404 });
      }
      await product.destroy();
      res.json({ message: 'Product deleted successfully', code: 200, data: product });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Failed to delete product', code: 500 });
    }
  },

  // Soft delete a product by ID
  async softDeleteProduct(req, res) {
    try {
      const { id } = req.params;
      let product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found', code: 404 });
      }
      // Update the active field to false (soft delete)
      await product.update({ active: false });
      res.json({ message: 'Product deleted successfully', code: 200, data: product });
    } catch (error) {
      console.error('Error soft deleting product:', error);
      res.status(500).json({ message: 'Failed to delete product', code: 500 });
    }
  }
};

module.exports = productController;
