// utils/validators.js
const { body } = require('express-validator');

const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').exists().withMessage('Password is required')
];

const bookCreateValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('year').isInt({ min: 0 }).withMessage('Valid year is required')
];

const reviewValidation = [
  body('bookId').notEmpty().withMessage('bookId is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be 1-5'),
  body('reviewText').trim().notEmpty().withMessage('reviewText is required')
];

module.exports = {
  signupValidation,
  loginValidation,
  bookCreateValidation,
  reviewValidation
};
