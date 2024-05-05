const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const marketplaceControllers = require('./marketplace-controller');
const marketplaceValidator = require('./marketplace-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/marketplace', route);

  // Get list of products
  route.get('/', authenticationMiddleware, marketplaceControllers.getProducts);

  // Create products
  route.post(
    '/product',
    authenticationMiddleware,
    celebrate(marketplaceValidator.createProduct),
    marketplaceControllers.createProduct
  );

  // Update products
  route.put(
    '/:id/update-product',
    authenticationMiddleware,
    celebrate(marketplaceValidator.updateProduct),
    marketplaceControllers.updateProduct
  );

  // Delete products
  route.delete(
    '/:id/delete-product',
    authenticationMiddleware,
    marketplaceControllers.deleteProduct
  );
};
