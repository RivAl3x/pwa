// server.js

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./DB');

const businessRoute = require('./routes/business.route');
const magazineRoute = require('./routes/magazine.route');
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/business', businessRoute);
app.use('/magazine', magazineRoute);
// const port = process.env.PORT || 4000;
const PORT1 = 'http://192.168.100.47:4000'
const port = PORT1 || 4000;
const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
