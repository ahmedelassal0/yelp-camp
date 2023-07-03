const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const wrapAsync = require('../utils/wrapAsync');
const { validateCampground, isLoggedIn, isCampgroundAuthor } = require('../middlewares')

router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('index.ejs', { campgrounds });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new.ejs');
})

router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('edit.ejs', { campground });
}))

router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'campground added');
    res.redirect('/campgrounds');
}))

router.put('/:id', isLoggedIn, isCampgroundAuthor, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'campground edited');
    res.redirect(`/campgrounds/${req.params.id}`);
}))

router.delete('/:id', isLoggedIn, isCampgroundAuthor, wrapAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'campground deleted');
    res.redirect('/campgrounds');
}))

router.get('/:id', wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
        .populate({path: 'reviews', populate:{path: 'author'}})
        .populate('author');
    res.render('campground.ejs', { campground });
}))

module.exports = router;