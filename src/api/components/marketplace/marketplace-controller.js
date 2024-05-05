const marketplaceService = require('./marketplace-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of products request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    const search = request.query.search;
    const product = await marketplaceService.getProducts(search);
    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get product detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await marketplaceService.getProduct(request.params.id);

    if (!product) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Product not found'
      );
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const name = request.body.name;
    const description = request.body.description;
    const price = request.body.price;
    const stock = request.body.stock;

    // name of product must be unique
    const productIsRegistered =
      await marketplaceService.productIsRegistered(name);
    if (productIsRegistered) {
      throw errorResponder(
        errorTypes.PRODUCT_NAME_ALREADY_TAKEN,
        'Product name is already registered'
      );
    }

    const success = await marketplaceService.createProduct(
      name,
      description,
      price,
      stock
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response.status(200).json({ name, description, price, stock });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const description = request.body.description;
    const price = request.body.price;
    const stock = request.body.stock;

    const success = await marketplaceService.updateProduct(
      id,
      description,
      price,
      stock
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    return response.status(200).json({ id, description, price, stock });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await marketplaceService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
