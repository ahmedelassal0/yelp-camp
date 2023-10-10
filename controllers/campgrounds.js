const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('index.ejs', { campgrounds });
}

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author');
    res.render('campground.ejs', { campground });
}

module.exports.renderNewForm = (req, res) => {
    res.render('new.ejs');
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('edit.ejs', { campground })
}

module.exports.createCampground = async (req, res) => {
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f => ({ url: f.path, name: f.originalname }));
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'campground added');
    res.redirect('/campgrounds');
}

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'campground deleted');
    res.redirect('/campgrounds');
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    const imgs = req.files.map(f => ({ url: f.path, name: f.originalname }))
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'campground edited');
    res.redirect(`/campgrounds/${id}`);
    res.send(req.body)
}