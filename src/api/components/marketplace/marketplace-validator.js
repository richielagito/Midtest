const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      description: joi.string().min(1).max(100).optional().label('Description'),
      price: joi.number().integer().min(1).max(99999).required().label('Price'),
      stock: joi.number().integer().min(0).max(99999).required().label('Stock'),
    },
  },

  updateProduct: {
    body: {
      description: joi.string().min(1).max(100).optional().label('Description'),
      price: joi.number().integer().min(1).max(99999).optional().label('Price'),
      stock: joi.number().integer().min(1).max(99999).optional().label('Stock'),
    },
  },
};
