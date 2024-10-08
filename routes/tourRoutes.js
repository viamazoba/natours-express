const express = require('express');
const tourController = require('./../controllers/tour.controller');

const router = express.Router();

// router.param('id', tourController.checkID);

// La siguiente ruta es para aliasing, para enviar info muy solicitada
router
	.route('/top-5-cheap')
	.get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthy-plan/:year').get(tourController.getMonthyPlan);
router
	.route('/')
	.get(tourController.getAllTours)
	.post(tourController.createNewTour);

router
	.route('/:id')
	.get(tourController.getTourById)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

module.exports = router;
