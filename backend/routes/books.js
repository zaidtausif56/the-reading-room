// routes/books.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middlewares/auth');
const { bookCreateValidation } = require('../utils/validators');
const validateRequest = require('../middlewares/validateRequest');

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', auth, bookCreateValidation, validateRequest, bookController.createBook);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;