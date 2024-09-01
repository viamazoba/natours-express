/* eslint-disable no-param-reassign */
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	console.log('Hello from the middleware :hand:');
	next();
});

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// 3) Routes
// Si el proceso es correcto termina en estos endpoints, sino pasa al siguiente middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Este middleware es para enviar mensaje cuando se introduce un endpoint incorrecto
app.all('*', (req, res, next) => {
	// res.status(404).json({
	// 	status: 'fail',
	// 	message: `Can't find ${req.originalUrl} on this server!`
	// });

	const err = new Error(`Can't find ${req.originalUrl} on this server!`);
	err.status = 'fail';
	err.statusCode = 404;

	next(err);
});

// Manejador global de errores
// Este middleware maneja todos los errores de la aplicación
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message
	});
});

module.exports = app;
