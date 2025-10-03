// controllers/bookController.js
const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.createBook = async (req, res, next) => {
  try {
    const { title, author, description, genre, year } = req.body;
    const book = await Book.create({ title, author, description, genre, year, addedBy: req.user.id });
    res.status(201).json(book);
  } catch (err) { next(err); }
};

exports.getBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const genre = req.query.genre;
    const sortBy = req.query.sortBy;

    const filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { author: regex }];
    }
    if (genre) filter.genre = genre;

    const aggPipeline = [
      { $match: filter },
      { $lookup: { from: 'reviews', localField: '_id', foreignField: 'bookId', as: 'reviews' } },
      { $addFields: { reviewCount: { $size: '$reviews' }, averageRating: { $cond: [{ $gt: [{ $size: '$reviews' }, 0] }, { $avg: '$reviews.rating' }, null] } } },
      { $project: { reviews: 0 } }
    ];

    if (sortBy === 'rating') aggPipeline.push({ $sort: { averageRating: -1 } });
    else if (sortBy === 'year') aggPipeline.push({ $sort: { year: -1 } });
    else aggPipeline.push({ $sort: { createdAt: -1 } });

    const countPipeline = [{ $match: filter }, { $count: 'total' }];
    const countRes = await Book.aggregate(countPipeline);
    const totalBooks = countRes.length ? countRes[0].total : 0;
    const totalPages = Math.ceil(totalBooks / limit);

    aggPipeline.push({ $skip: skip }, { $limit: limit });
    const books = await Book.aggregate(aggPipeline);
    res.json({ books, totalPages, currentPage: page, totalBooks });
  } catch (err) { next(err); }
};

exports.getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid book id' });
    const book = await Book.findById(bookId).populate('addedBy', 'name');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const reviews = await Review.find({ bookId }).populate('userId', 'name');
    const averageRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
    res.json({ ...book.toObject(), averageRating, reviewCount: reviews.length, reviews });
  } catch (err) { next(err); }
};

exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (err) { next(err); }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await Book.deleteOne({ _id: req.params.id });
    await Review.deleteMany({ bookId: req.params.id });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) { next(err); }
};