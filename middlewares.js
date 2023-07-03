const { campgroundSchema } = require('./schemas');
const { reviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const AppError = require('./utils/AppError');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must sign in first')
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new AppError(msg, 400);
    }
    next();
}

module.exports.isCampgroundAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('author');
    if (!campground.author._id.equals(req.user._id)) {
        req.flash('error', 'you are not allowed to edit this campground')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('author');
    if (!review.author._id.equals(req.user._id)) {
        req.flash('error', 'you don\'t have the permission to do that')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new AppError(msg, 400);
    }
    next();
}