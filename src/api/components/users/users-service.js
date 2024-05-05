const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
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
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

/**
 * Pagination dan Filter
 * @param {integer} pageNumber
 * @param {integer} pageSize
 * @param {string} sort
 * @param {string} search
 * @returns {Object}
 */
async function getPaginatedUsers(pageNumber, pageSize, sort, search) {
  const skip = (pageNumber - 1) * pageSize;

  const splitSort = sort.split(':');
  // jika yang diinput asc return 1, jika yang diinput desc return -1, dengan default asc
  const sortOrder =
    splitSort[1] === 'asc' ? 1 : splitSort[1] === 'desc' ? -1 : 1;

  // sorting berdasarkan input user (email/name), dengan default email: 1(asc)
  const sortBy =
    splitSort[0] === 'email'
      ? { email: sortOrder }
      : splitSort[0] === 'name'
        ? { name: sortOrder }
        : { email: 1 };

  // set limit berdasarkan pageSize yang diinput user
  const limit = pageSize;

  const splitSearch = search.split(':');
  // filter data berdasarkan input user (email/name), dengan default semua data akan ditampilkan
  const filterBy =
    splitSearch[0] === 'email'
      ? { email: { $regex: splitSearch[1], $options: 'i' } }
      : splitSearch[0] === 'name'
        ? { name: { $regex: splitSearch[1], $options: 'i' } }
        : {};

  // menghitung total users dan total pages
  const totalUsers = await usersRepository.countUsers(filterBy);
  const totalPages = Math.ceil(totalUsers / pageSize);

  const users = await usersRepository.paginatedUsers(
    skip,
    limit,
    sortBy,
    filterBy
  );

  // return null jika user tidak ditemukan
  if (!users) {
    return null;
  }

  // push data user ke dalam array data
  const data = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    data.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return {
    page_number: pageNumber || 1,
    page_size: pageSize || users.length,
    count: users.length,
    total_pages: totalPages,
    has_previous_page: pageNumber > 1,
    has_next_page: pageNumber < totalPages,
    data: data,
  };
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  getPaginatedUsers,
};
