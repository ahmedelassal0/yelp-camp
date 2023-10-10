if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const campgroundRouter = require('./routes/campground')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/user')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local')
const User = require('./models/user')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('CONNECTION OPENED TO DATABASE');
    })
    .catch(e => {
        console.log(e);
    })

app.listen(3000, () => {
    console.log('SERVING ON PORT 3000');
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
const sessionConfig = {
    secret: 'thisismyverystrongsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})


app.set('views', path.join(__dirname, 'views'))
app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRouter)
app.use('/', userRouter)

app.all('*', (req, res) => {
    throw new AppError('404 page not found', 404);
})

app.use((err, req, res, next) => {
    console.log(err);
    const { message, status } = err;
    res.status(status);
    res.render('error.ejs', { message });
})
