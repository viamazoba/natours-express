/* eslint-disable prettier/prettier */
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');


exports.aliasTopTours = async (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
}


exports.getAllTours = async (req, res) => {

	try {
		// Execute Query
		const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
		const tours = await features.query;

		// Send Response
		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: {
				tours
			}
		});

	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error
		})
	}
};

exports.getTourById = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id)
		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		})
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error
		})
	}
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
			message: error
		})
	}


};

exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true // Para que se validen los campos ingresados a MongoDB
		})

		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		});
	} catch (error) {

		res.status(404).json({
			status: 'fail',
			message: error
		})
	}
};

exports.deleteTour = async (req, res) => {
	try {

		await Tour.findByIdAndDelete(req.params.id)
		res.status(204).json({
			status: 'success',
			data: null
		});

	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error
		})
	}
};
