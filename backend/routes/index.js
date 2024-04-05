const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const {authenticate, authorize} = require('../helpers/auth');

router.use('/user', userRoutes);
router.use(authenticate)
router.use('/product', productRoutes);

module.exports = router;
