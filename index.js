const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas');
const AppError = require('./utils/AppError');
const wrapAsync = require('./utils/wrapAsync');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('CONNECTION OPENED TO DATABASE');
    })
    .catch(e => {
        console.log(e);
    })

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log('SERVING ON PORT 3000');
})

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new AppError(msg, 400);
    }
    next();
}
const validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new AppError(msg, 400);
    }
    next();
}

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('index.ejs', { campgrounds });
})

app.get('/campgrounds/new', async (req, res) => {
    res.render('new.ejs');
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    console.log(campground);
    res.render('edit.ejs', { campground });
})

app.post('/campgrounds', validateCampground, async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect('/campgrounds');
})

app.put('/campgrounds/:id', validateCampground, async (req, res) => {
    console.log(req.body.Campground);
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${req.params.id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    console.log('deleted');
    res.redirect('/campgrounds');
})

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    for(let review of campground.reviews){
        console.log(review.title);
    }
    res.render('campground.ejs', { campground });
})

app.post('/campgrounds/:id/reviews',validatereview ,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review);
    const camp = await Campground.findById(id);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
})

app.all('*', (req, res) => {
    throw new AppError('404 page not found', 404);
})

app.use((err, req, res, next) => {
    console.log(err);
    const { message, status } = err;
    res.status(status);
    res.render('error.ejs', { message });
})
