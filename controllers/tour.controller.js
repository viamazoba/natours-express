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
		const tour = await Tour.findById(req.params.id);

		if (!tour) {
			// Si tomas un ID válido y le cambias una letra, mongo no lo ve como un error
			// Pero te envía un tour en null, por eso es importante este condicional
			const error = new Error('Tour not found with that ID');
			error.statusCode = 404;
			throw error;
		}

		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		})
	} catch (error) {
		res.status(error.statusCode || 500).json({
			status: 'fail',
			message: error.message || 'An error occurred'
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
			runValidators: true // Para que se validen los campos ingresados a MongoDB, los que defines en el schema
		})

		if (!tour) {
			// Si tomas un ID válido y le cambias una letra, mongo no lo ve como un error
			// Pero te envía un tour en null, por eso es importante este condicional
			const error = new Error('Tour not found with that ID');
			error.statusCode = 404;
			throw error;
		}

		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		});
	} catch (error) {

		res.status(error.statusCode || 500).json({
			status: 'fail',
			message: error.message || 'An error occurred'
		})
	}
};

exports.deleteTour = async (req, res) => {
	try {

		const tour = await Tour.findByIdAndDelete(req.params.id);

		if (!tour) {
			// Si tomas un ID válido y le cambias una letra, mongo no lo ve como un error
			// Pero te envía un tour en null, por eso es importante este condicional
			const error = new Error('Tour not found with that ID');
			error.statusCode = 404;
			throw error;
		}

		res.status(204).json({
			status: 'success',
			data: null
		});

	} catch (error) {
		res.status(error.statusCode || 500).json({
			status: 'fail',
			message: error.message || 'An error occurred'
		})
	}
};

exports.getTourStats = async (req, res) => {
	try {
		const stats = await Tour.aggregate([
			{
				$match: {
					ratingsAverage: { $gte: 4.5 }
				}
			},
			{
				$group: {
					_id: '$difficulty',
					numTours: {
						$sum: 1
					},
					numRatings: {
						$sum: '$ratingsQuantity'
					},
					avgRating: {
						$avg: '$ratingsAverage'
					},
					avgPrice: {
						$avg: '$price'
					},
					minPrice: {
						$min: 'price'
					},
					maxPrice: {
						$max: '$price'
					}
				}
			},
			{
				$sort: {
					avgPrice: 1
				}
			}
		]);

		res.status(200).json({
			status: 'success',
			data: {
				stats
			}
		});

	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error
		})
	}
}

exports.getMonthyPlan = async (req, res) => {
	try {
		const year = req.params.year * 1;

		const plan = await Tour.aggregate([
			{
				$unwind: '$startDates' // Así descomprime el array de valores
			},
			{
				$match: {
					startDates: {
						$gte: new Date(`${year}-01-01`),
						$lte: new Date(`${year}-12-31`),
					}
				}
			},
			{
				$group: {
					_id: {
						$month: '$startDates'
					},
					numTourStarts: {
						$sum: 1
					},
					tours: {
						$push: '$name'
					}
				}
			},
			{
				$addFields: {
					month: '$_id'
				}
			},
			{
				$project: {
					_id: 0
				}
			},
			{
				$sort: {
					numTourStarts: -1
				}
			},
			{
				$limit: 12
			}
		]);

		res.status(200).json({
			status: 'success',
			data: {
				plan
			}
		});

	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error
		})
	}
}