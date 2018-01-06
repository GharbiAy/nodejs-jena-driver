var http = require('http');
var app = require('./app');

http.createServer(app.handleRequest).listen(8000);
var host = 'localhost',
        port = '3000';

    console.log('Server listening at http://%s:%s', host, 8000);