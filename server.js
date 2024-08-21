// Esta librería lleva las variables de entorno a las de node
// Así se pueden utilizar en cuelaquier lugar
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
	path: './.env'
});
// console.log(process.env.DATABASE);
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

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		require: [true, 'A tour must have a name'],
		unique: true
	},
	rating: {
		type: Number,
		default: 4.5
	},
	price: {
		type: Number,
		require: [true, 'A tour must have a price']
	}
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
	name: 'The Forest Hiker',
	rating: 4.7,
	price: 497
});

testTour
	.save()
	.then(doc => {
		console.log(doc);
	})
	.catch(err => {
		console.log('Error: ', err);
	});

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const colors = require('colors');
const app = require('./app');

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(colors.blue.bold(`App runing on port ${port}...`));
});
