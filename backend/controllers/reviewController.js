// controllers/reviewController.js
const Review = require('../models/Review');
const Book = require('../models/Book');
const mongoose = require('mongoose');

exports.getReviewsByBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid book id' });
    const reviews = await Review.find({ bookId }).populate('userId', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { next(err); }
};

exports.createReview = async (req, res, next) => {
  try {
    const { bookId, rating, reviewText } = req.body;
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid book id' });
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const review = await Review.create({ bookId, userId: req.user.id, rating, reviewText });
    res.status(201).json(review);
  } catch (err) { next(err); }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(review, req.body);
    await review.save();
    res.json(review);
  } catch (err) { next(err); }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await review.remove();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) { next(err); }
};