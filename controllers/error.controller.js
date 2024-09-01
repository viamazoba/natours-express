/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */

// Como se debe mostrar un error mientras desarrollas
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Como se debe mostrar un error en producción
const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }
};
