const express = require('express');
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validatereview, isReviewAuthor } = require('../middlewares');

router.post('/', isLoggedIn, validatereview, wrapAsync(reviews.addReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;