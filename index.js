/**
 * Description of index.js
 *
 * @author K.Christofilos <kostas.christofilos@gmail.com>
 */

'use strict';

/* Express framework */
var express = require('express');
var app = express();

/**
 * Test Fuseki
 *
 * /
 *
 */
app.get('/', function (req, res) {
    var Server = require('./lib/Server');
    var fuseki = new Server();

    var query = '  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>   SELECT * WHERE {     ?sub ?pred ?obj .   }  ';
    var dataset = 'TaxiEsaadSpatial';
    fuseki.connect(function(err, con) {
        if (err) {
            res.status(err.code || 500).jsonp(err);
        } else {
            var insert = 'PREFIX d: <http://learningsparql.com/ns/data#>PREFIX dm: <http://learningsparql.com/ns/demo#>INSERT DATA{d:x dm:tag "3" .}';
            con.update(dataset, insert, function(err, data) {
                console.log(err);
                console.log(data);
            });
            con.select(dataset, query, function(err, data) {
                console.log(err);
                console.log(data);
                if (err) {
                    res.status(err.code || 500).jsonp(err);
                } else {
                    res.jsonp(data);
                }
            });
        }
    });
});

var server = app.listen(3000, function () {
    var host = 'localhost',
        port = '3000';

    console.log('Server listening at http://%s:%s', host, port);
});
