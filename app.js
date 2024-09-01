/* eslint-disable no-param-reassign */
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');
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
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Manejador global de errores
// Este middleware maneja todos los errores de la aplicación
app.use(globalErrorHandler);

module.exports = app;
