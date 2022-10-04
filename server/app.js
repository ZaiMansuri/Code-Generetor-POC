const express = require('express');
const cors = require('cors');
const multer = require('multer')
let bodyParser = require('body-parser');
const app = express();
const webRoutes = require('./routes/web');

app.use(cors());
app.use(express.static('public'))
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Front Routes handling
app.use(webRoutes);


app.use('/sourceCode', express.static('server'));

app.listen(5000);