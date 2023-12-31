const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
    }).required(),
    deletedImages: Joi.array(),
})
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
        
    }).required()
})