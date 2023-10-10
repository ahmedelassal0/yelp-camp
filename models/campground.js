const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { func } = require('joi');
const imageSchema = new Schema({
    url: String,
    name: String
})

const campGroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/h_300/w_300');
})

campGroundSchema.post('findOneAndDelete', async (campground) => {
    if (campground.reviews)
        await Review.deleteMany({_id: {$in: campground.reviews}});
})
module.exports = mongoose.model('CampGround', campGroundSchema);