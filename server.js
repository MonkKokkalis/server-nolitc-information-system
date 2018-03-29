const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const fs = require('fs');
const path = require('path');
const functions = require('./functions/getfiles');

const async = require('async');//testing
const rootPath = path.join(path.parse(__dirname).root, 'files/registrar');
functions(rootPath).then(data => console.log (data));
server.listen(80, () => {
    console.log('the server is now listening at port 80');
});

