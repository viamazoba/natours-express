const app = require('./app');
const colors = require('colors');

const port = 3000;
app.listen(port, () => {
    console.log(colors.blue.bold(`App runing on port ${port}...`))
})