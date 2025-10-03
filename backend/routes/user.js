// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Book = require('../models/Book');
const Review = require('../models/Review');

router.get('/profile', auth, async (req, res, next) => {
  try { res.json({ id: req.user.id }); } catch (err) { next(err); }
});

router.get('/books', auth, async (req, res, next) => {
  try {
    const books = await Book.find({ addedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) { next(err); }
});

router.get('/reviews', auth, async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).populate('bookId', 'title').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { next(err); }
});

module.exports = router;