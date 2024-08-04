const express = require('express');
const tourController = require('./../controllers/tour.controller');

const router = express.Router();

router.param('id', tourController.checkID);

router
	.route('/')
	.get(tourController.getAllTours)
	.post(tourController.checkBody, tourController.createNewTour);

router
	.route('/:id')
	.get(tourController.getTourById)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

module.exports = router;
