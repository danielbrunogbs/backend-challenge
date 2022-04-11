const express = require('express');
const Route = require('./route/api.js');
const cors = require('cors');

/* ENV */
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', Route);

app.use((err, req, res, next) => {

	res.status(err.http_code ? err.http_code : 500);

	res.header('Content-Type', 'application/json');

	res.send({ message: err.message });

	console.log(err);

});

app.listen(8080);