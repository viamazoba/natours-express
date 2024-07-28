const express = require('express');
const colors = require('colors');

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from the server side!', app: 'Natours' });
})

app.post('/', (req, res) => {
    res.send('You post to this endpoint ...')
})

const port = 3000;
app.listen(port, () => {
    console.log(colors.blue.bold(`App runing on port ${port}...`))
})