const { Marketplace } = require('../../../models');

/**
 * Get a list of Products by filter if inputed
 * @returns {Promise}
 */
async function getProducts(filter) {
  return Marketplace.find(filter);
}

/**
 * Get products detail
 * @param {string} id - Products ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Marketplace.findById(id);
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {string} description - description
 * @param {string} price - price
 * @param {string} stock - stock
 * @returns {Promise}
 */
async function createProduct(name, description, price, stock) {
  return Marketplace.create({
    name,
    description,
    price,
    stock,
  });
}

/**
 * Update existing product
 * @param {string} id - Products ID
 * @param {string} description - description
 * @param {string} price - price
 * @param {string} stock - stock
 * @returns {Promise}
 */
async function updateProduct(id, description, price, stock) {
  return Marketplace.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        description,
        price,
        stock,
      },
    }
  );
}

/**
 * Delete a product
 * @param {string} id - Products ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Marketplace.deleteOne({ _id: id });
}

/**
 * Get product by name to prevent duplicate name
 * @param {string} name - Name
 * @returns {Promise}
 */
async function getProductsByName(name) {
  return Marketplace.findOne({ name });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByName,
};
