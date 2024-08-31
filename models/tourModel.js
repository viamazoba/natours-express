/* eslint-disable prettier/prettier */

const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

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
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters'],
        validate: {
            validator: function (value) {
                // Aquí validas con librería de que el nombre no contenga números
                return validator.isAlpha(value.split(' ').join(''));
            },
            message: 'Tour name must only contain characters.'
        }
    },
    slug: String,
    duration: {
        type: Number,
        require: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        require: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // Esta validación sólo sirve para los documentos creados, no para las actualizaciones de documentos
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summery: {
        type: String,
        trim: true,
        require: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        require: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false // Se esconde de la sección por razones de seguridad
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    // Esto es para que las propiedades virtuales (calculadas) se muestren en tus documentos
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

tourSchema.virtual('durationWeeks').get(function () {
    return this.durations / 7
})

// Document middleware: runs before .save()  and .create() (crear un tour)
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Query Middleware
// Puedes utilizar regex por ejmplo para todos los queries que impliquen find (find, findOne, etc.) --> /^find/ en vez de 'find'
tourSchema.pre('find', function (next) {
    this.find({
        secretTour: { $ne: true }
    })
    next();
})

// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: {
            secretTour: { $ne: true }
        }
    });

    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
