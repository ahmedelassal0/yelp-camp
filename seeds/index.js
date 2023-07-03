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
        const price = Math.floor(Math.random() * 90) + 10
        const camp = new Campground({
            title: `${randomElement(descriptors)} ${randomElement(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            price: price,
            description: 
            `Lorem ipsum dolor sit amet consectetur adipisicing elit. Non nam repellat eveniet, fugit nemo sapiente aliquid at assumenda ea magnam nostrum laboriosam ipsa beatae sint mollitia enim consequuntur error optio.
            Aliquid quisquam consequatur sapiente incidunt. Alias nobis totam omnis magni? Dolore, ut. Enim porro quae aperiam quis omnis temporibus a totam eum ea consectetur, hic, veritatis voluptatibus quibusdam doloribus corrupti!
            Rerum illum magnam autem eius debitis soluta et corporis, eum ducimus cum maiores est, quasi neque dolor distinctio id impedit laudantium. Blanditiis id quam, veniam numquam qui deleniti? Esse, similique?`,
            location: `${cities[random1000].city} - ${cities[random1000].state}`,
            author: '64a2570f40fa716f9194daff'
        });
        await camp.save();
        console.log(camp);
    }
}

seedDb()
    .then(() => {
        mongoose.connection.close();
    });