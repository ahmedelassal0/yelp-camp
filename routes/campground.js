const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const wrapAsync = require('../utils/wrapAsync');
const { validateCampground, isLoggedIn, isCampgroundAuthor } = require('../middlewares')
const multer  = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isCampgroundAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isCampgroundAuthor, wrapAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, wrapAsync(campgrounds.renderEditForm));

module.exports = router;