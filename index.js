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

    var query = 'PREFIX  geo:  <http://www.w3.org/2003/01/geo/wgs84_pos#> PREFIX  taxi: <http://taxi.essad.to/taxi.rdf#> PREFIX  rdf:  <http://www.w3.org/2000/01/rdf-schema#> PREFIX  taxiuri: <http://essadtaxi.com/taxi/CarPosition/> SELECT  ?id ?idcar ?dtime ?lat ?long WHERE  { ?y  taxi:id      ?id ;         taxi:car_id  "carId" ;         taxi:dtime   ?dtime ;         geo:lat      ?lat ;         geo:long     ?long   } ';
    var insert = 'PREFIX  geo:  <http://www.w3.org/2003/01/geo/wgs84_pos#> PREFIX  taxi: <http://taxi.essad.to/taxi.rdf#>  PREFIX  rdf:  <http://www.w3.org/2000/01/rdf-schema#> PREFIX  taxiuri: <http://essadtaxi.com/taxi/CarPosition/1> Insert data  {   		taxiuri:1  rdf:type <http://taxi.essad.to/taxi.rdf#CarPosition>.   		taxiuri:1  taxi:id      "id1" .         taxiuri:1  taxi:car_id  "carId" .         taxiuri:1  taxi:dtime   "dtime1" .         taxiuri:1  geo:lat      "lat1".     taxiuri:1  geo:long     "long1".  }';
    var deletequery = "DELETE { ?s ?p ?o }WHERE {?s ?p ?o ; <http://taxi.essad.to/taxi.rdf#car_id> 'carId'}";
    var dataset = 'TaxiEsaadSpatial';
    fuseki.connect(function(err, con) {
        if (err) {
            res.status(err.code || 500).jsonp(err);
        } else {
            con.update(dataset, insert, function(err, data) {
                  console.log(insert);
            });
            con.select(dataset, query, function(err, data) {
                  console.log(err);
                  console.log(data);
                if (err) {
                    res.status(err.code || 500).jsonp(err);
                } else {
                    res.jsonp(data);
                    res.end();
                }
            });
            con.update(dataset, deletequery, function(err, data) {
                  console.log(deletequery);
            });
            
        }
    });
});

var server = app.listen(3000, function () {
    var host = 'localhost',
        port = '3000';

    console.log('Server listening at http://%s:%s', host, port);
});
