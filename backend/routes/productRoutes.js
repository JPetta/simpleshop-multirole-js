const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { authorize } = require('../helpers/auth');

router.post('/', authorize(['admin']), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', authorize(['admin']), productController.getProductById);
router.put('/:id', authorize(['admin']), productController.updateProduct);
router.delete('/:id', authorize(['admin']), productController.deleteProduct);

module.exports = router;
