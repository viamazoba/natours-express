/* eslint-disable prettier/prettier */
const Tour = require('../models/tourModel');


exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		requiredAt: req.requestTime,
		// results: tours.length,
		// data: {
		// 	tours
		// }
	});
};

exports.getTourById = (req, res) => {
	// const id = req.params.id * 1;
	// const tour = tours.find(el => el.id === id);

	// res.status(200).json({
	// 	status: 'success',
	// 	data: {
	// 		tour
	// 	}
	// });
};

exports.createNewTour = async (req, res) => {

	try {

		const newTour = await Tour.create(req.body)

		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour
			}
		});

	} catch (error) {
		res.status(400).json({
			status: 'fails',
			message: 'Invalid data sent!'
		})
	}


};

exports.updateTour = (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			tour: 'Updated tour here ...'
		}
	});
};

exports.deleteTour = (req, res) => {
	res.status(204).json({
		status: 'success',
		data: null
	});
};
