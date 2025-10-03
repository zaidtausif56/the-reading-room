// routes/reviews.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middlewares/auth');
const { reviewValidation } = require('../utils/validators');
const validateRequest = require('../middlewares/validateRequest');

router.get('/book/:bookId', reviewController.getReviewsByBook);
router.post('/', auth, reviewValidation, validateRequest, reviewController.createReview);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;