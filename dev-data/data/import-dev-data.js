/* eslint-disable prettier/prettier */
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config({
    path: `${__dirname}/../../.env`
});

const Tour = require('./../../models/tourModel');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('DB conecction successful!');
    });

// Read Json File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

// Delete all data from collections
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!')
        process.exit()
    } catch (error) {
        console.log(error);
    }
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}