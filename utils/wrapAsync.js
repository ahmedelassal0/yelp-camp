const AppError = require("./AppError");

module.exports = wrapAsync = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(new AppError(e, 500)))
    }
}