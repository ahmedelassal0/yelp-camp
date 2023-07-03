const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review');
const Campground = require('../models/campground');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validatereview, isReviewAuthor } = require('../middlewares');

router.post('/', isLoggedIn, validatereview ,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review);
    console.log(req.user);
    review.author = req.user._id;
    const camp = await Campground.findById(id);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'review added');
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('author');
    if(!review.author._id.equals(req.user._id)) {
        req.flash('error', 'you don\'t have the permission to do that')
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'review deleted');
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;