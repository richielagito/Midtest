const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

const { hasLoginAttempts } = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // jika attempt login melebihi 5, throw error 403 FORBIDDEN
      if (hasLoginAttempts[email].attempts >= 5) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Limit has reached. Too many failed login attempts'
        );
      }
      // jika gagal login, throw error 403 INVALID_CREDENTIALS
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
