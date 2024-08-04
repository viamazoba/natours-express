// Esta librería lleva las variables de entorno a las de node
// Así se pueden utilizar en cuelaquier lugar
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

const app = require('./app');
const colors = require('colors');

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(colors.blue.bold(`App runing on port ${port}...`))
})