const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (req, res) => {

    res.status(200).json({
        status: 'success',
        requiredAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
}

exports.getTourById = (req, res) => {

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

exports.createNewTour = (req, res) => {
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

exports.updateTour = (req, res) => {

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

exports.deleteTour = (req, res) => {

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