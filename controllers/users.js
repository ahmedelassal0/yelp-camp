const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register-form')
};

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login-form');
};

module.exports.login = (req, res) => {
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    delete res.locals.returnTo; 
    req.flash('success', 'welcome back');
    res.redirect(`${redirectUrl}`)
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Good bye');
        res.redirect('login')
    });
};