const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedHelper');
const cities = require('./cities');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('CONNECTION OPENED TO DATABASE');
    })
    .catch(e => {
        console.log(e);
    })

const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${randomElement(descriptors)} ${randomElement(places)}`,
            location: `${cities[random1000].city} - ${cities[random1000].state}`
        });
        await camp.save();
        console.log(camp);
    }
}

seedDb()
    .then(() => {
        mongoose.connection.close();
    });