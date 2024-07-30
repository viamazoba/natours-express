const fs = require('fs')
const express = require('express');
const colors = require('colors');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from the middleware :hand:')
    next()
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours = (req, res) => {

    res.status(200).json({
        status: 'success',
        requiredAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
}

const getTourById = (req, res) => {

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status: "fails",
            message: "Invalid ID"
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
}

const createNewTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({
        id: newId
    },
        req.body
    );

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })

}

const updateTour = (req, res) => {

    const id = req.params.id * 1;

    if (id > tours.length) {
        return res.status(404).json({
            status: "fails",
            message: "Invalid ID"
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated tour here ...'
        }
    })
}

const deleteTour = (req, res) => {

    const id = req.params.id * 1;

    if (id > tours.length) {
        return res.status(404).json({
            status: "fails",
            message: "Invalid ID"
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
}

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTourById)
// app.post('/api/v1/tours', createNewTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)


app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createNewTour);

app.route('/api/v1/tours/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour)

const port = 3000;
app.listen(port, () => {
    console.log(colors.blue.bold(`App runing on port ${port}...`))
})