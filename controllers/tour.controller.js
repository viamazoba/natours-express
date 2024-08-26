/* eslint-disable prettier/prettier */
const Tour = require('../models/tourModel');


exports.getAllTours = async (req, res) => {
	const queryObj = {
		...req.query
	};

	const excludeFields = ['page', 'sort', 'limit', 'fields'];
	excludeFields.forEach(el => delete queryObj[el])

	try {

		// Built the query
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

		let query = Tour.find(JSON.parse(queryStr));

		// Sorting the results
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			// Puedes seguir usando métodos sobre el query que se obtiene de MongoDB
			query = query.sort(sortBy);
		} else {
			// Así se ordenan por defecto los creados más recientemente
			query = query.sort('-createdAt')
		}

		// Field Limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			// Con el menos sólo se excluye este campo
			query.select('-__v')
		}

		// Pagination
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 100;
		const skip = (page - 1) * limit; // Los valores a ignorar, pagia dos debes ignorar los de la página uno
		query = query.skip(skip).limit(limit);

		// Validación por si se solicitan más registros de lo sque poseen
		if (req.query.page) {
			const numTours = await Tour.countDocuments();
			if (skip >= numTours) throw Error('This page does not exist')
		}

		// Execute Query
		const tours = await query;

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
