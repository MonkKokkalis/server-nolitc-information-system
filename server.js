const http = require('http');
const app = require('./app');
const server = http.createServer(app);
server.listen(80, () => {
    console.log('the server is now listening at port 80');
});