const marketplaceRepository = require('./marketplace-repository');

/**
 * Get list of products
 * @param {string} filter
 * @returns {Array}
 */
async function getProducts(filter) {
  const filterBy = filter ? { name: { $regex: filter, $options: 'i' } } : {};
  const products = await marketplaceRepository.getProducts(filterBy);

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  }

  return results;
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Object}
 */
async function getProduct(id) {
  const product = await productsRepository.getProduct(id);

  // product not found
  if (!product) {
    return null;
  }

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
  };
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {string} description - description
 * @param {string} price - price
 * @param {string} stock - stock
 * @returns {boolean}
 */
async function createProduct(name, description, price, stock) {
  try {
    await marketplaceRepository.createProduct(name, description, price, stock);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {string} description - description
 * @param {string} price - price
 * @param {string} stock - stock
 * @returns {boolean}
 */
async function updateProduct(id, description, price, stock) {
  const product = await marketplaceRepository.getProduct(id);

  // product not found
  if (!product) {
    return null;
  }

  try {
    await marketplaceRepository.updateProduct(id, description, price, stock);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await marketplaceRepository.getProduct(id);

  // product not found
  if (!product) {
    return null;
  }

  try {
    await marketplaceRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the name is registered
 * @param {string} name - Email
 * @returns {boolean}
 */
async function productIsRegistered(name) {
  const product = await marketplaceRepository.getProductsByName(name);

  if (product) {
    return true;
  }

  return false;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productIsRegistered,
};
