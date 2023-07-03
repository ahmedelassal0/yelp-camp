const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const campGroundSchema = new Schema({
    title: String,
    image: String,
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

campGroundSchema.post('findOneAndDelete', async (campground) => {
    if (campground.reviews)
        await Review.deleteMany({_id: {$in: campground.reviews}});
})
module.exports = mongoose.model('CampGround', campGroundSchema);