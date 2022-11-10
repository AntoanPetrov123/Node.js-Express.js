const express = require('express');

const routes = require('./routes');
const initDatabase = require('./configuration/mongoose');

const app = express();

require('./configuration/hbs')(app);
require('./configuration/express')(app);

app.use(routes);

initDatabase()
    .then(() => {
        app.listen(3000, () => console.log(`The app is running on http://localhost:3000`));
    })
    .catch((err) => {
        console.log('Cannot connect database: ', err)
    })