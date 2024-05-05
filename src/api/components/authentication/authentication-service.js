const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const hasLoginAttempts = {};

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.

  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    // mengecek apakah sudah pernah melakukan attempt login sebelumnya
    if (!hasLoginAttempts[email]) {
      hasLoginAttempts[email] = { attempts: 1, lastAttempt: new Date() };
    } else {
      const currentTime = new Date();
      const lastAttemptTime = new Date(hasLoginAttempts[email].lastAttempt);
      const timeDifference =
        Math.abs(currentTime - lastAttemptTime) / (1000 * 60);
      // mereset attempt login jika sudah lewat 30 menit
      if (timeDifference > 30) {
        hasLoginAttempts[email] = { attempts: 1, lastAttempt: new Date() };
      } else {
        hasLoginAttempts[email].attempts++;
        hasLoginAttempts[email].lastAttempt = new Date();
      }
    }
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
  hasLoginAttempts,
};
