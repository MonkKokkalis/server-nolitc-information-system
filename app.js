const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const downloadRoute = require('./api/routes/download');
const filesRoute = require('./api/routes/files');
const serverLog = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Expose-Headers', 'X-Token, Content-Disposition, FileName');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})
app.use(morgan('common', {stream: serverLog}, {flags: 'a'}));
app.use('/api/files/download', downloadRoute);
app.use('/api/files/get', filesRoute);  
module.exports = app;