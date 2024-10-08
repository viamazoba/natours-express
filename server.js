// Esta librería lleva las variables de entorno a las de node
// Así se pueden utilizar en cuelaquier lugar
const dotenv = require('dotenv');
// const mongoose = require('mongoose');

dotenv.config({
	path: './.env'
});
// console.log(process.env.DATABASE);

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const colors = require('colors');
const app = require('./app');

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(colors.blue.bold(`App runing on port ${port}...`));
});
