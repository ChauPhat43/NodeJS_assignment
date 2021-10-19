const httpStatus = require('http-status');
const { Book } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a class
 * @param {Object} bookBody
 * @returns {Promise<Book>}
 */
const createBook = async (bookBody) => {
  if (await Book.isNameTaken(bookBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken!');
  }
  return Book.create(bookBody);
};

/**
 * Query for classs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBooks = async (filter, options) => {
  const books = await Book.paginate(filter, options);
  return books;
};

/**
 * Get class by id
 * @param {ObjectId} id
 * @returns {Promise<Book>}
 */
const getBookById = async (id) => {
  return Book.findById(id);
};

/**
 * Get class by email
 * @param {string} email
 * @returns {Promise<Book>}
 */
const getBookByName = async (name) => {
  return Book.findOne({ name });
};

/**
 * Update class by id
 * @param {ObjectId} classId
 * @param {Object} updateBody
 * @returns {Promise<Book>}
 */
const updateBookById = async (classId, updateBody) => {
  const book = await getBookById(classId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  if (updateBody.name && (await Book.isNameTaken(updateBody.name, classId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(book, updateBody);
  await book.save();
  return book;
};

/**
 * Delete class by id
 * @param {ObjectId} classId
 * @returns {Promise<Book>}
 */
const deleteBookById = async (classId) => {
  const book = await getBookById(classId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  await book.remove();
  return book;
};

module.exports = {
  createBook,
  queryBooks,
  getBookById,
  getBookByName,
  updateBookById,
  deleteBookById,
};
