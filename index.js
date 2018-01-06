'use strict';

/* Express framework */
var express = require('express'),
path     = require('path'),
bodyParser = require('body-parser'),
app = express(),
expressValidator = require('express-validator');
var app = express();
var Server = require('./lib/Server');
var fuseki = new Server();
var dataset = 'TaxiEsaadSpatial';

/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());
/**
 * Test Fuseki
 *
 * /
 *
 */
app.get('/', function (req, res) {
    res.send('Welcome');
});

var router = express.Router();
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/user');
curut.get(function(req,res,next){
    //res.send('user get.')
    var selectquery = 'PREFIX  geo:  <http://www.w3.org/2003/01/geo/wgs84_pos#> PREFIX  taxi: <http://taxi.essad.to/taxi.rdf#> PREFIX  rdf:  <http://www.w3.org/2000/01/rdf-schema#> PREFIX  taxiuri: <http://essadtaxi.com/taxi/CarPosition/> SELECT  ?id ?idcar ?dtime ?lat ?long WHERE  { ?y  taxi:id      ?id ;         taxi:car_id ?idcar  ;         taxi:dtime   ?dtime ;         geo:lat      ?lat ;         geo:long     ?long   } ';
    fuseki.connect(function(err, con) {
        if (err) {
            res.status(err.code || 500).jsonp(err);
        } else {
            con.select(dataset, selectquery, function(err, data1) {
                  console.log(err);
                  console.log(data1);
                if (err) {
                    res.status(err.code || 500).jsonp(err);
                } else {
                    var data= data1.results.bindings;
                    //res.jsonp(data);
                    //res.end();
                    //var data= data1.results.bindings;
                    //console.log()
                    res.render('user',{title:"RESTful Crud Example",data});
                }
            });
        }
    });

});

//post data to DB | POST
curut.post(function(req,res,next){

    //validation
    //req.assert('time','time is required').notEmpty();
    //req.assert('lat','Enter a longitude 4 - 6').len(4,6)
    //req.assert('lng','Enter a latitude 4 - 6').len(4,6);
    var rand= Math.random();
    var insertquery = 'PREFIX  geo:  <http://www.w3.org/2003/01/geo/wgs84_pos#> PREFIX  taxi: <http://taxi.essad.to/taxi.rdf#>  PREFIX  rdf:<http://www.w3.org/2000/01/rdf-schema#> PREFIX  taxiuri: <http://essadtaxi.com/taxi/CarPosition/'+rand+'> Insert data  { taxiuri:1  rdf:type <http://taxi.essad.to/taxi.rdf#CarPosition>.               taxiuri:1  taxi:id      "'+rand+'" .         taxiuri:1  taxi:car_id  "'+req.body.time+'" . taxiuri:1  taxi:dtime   "'+req.body.time+'" . taxiuri:1  geo:lat      "'+req.body.lat+'".     taxiuri:1  geo:long     "'+req.body.lng+'".  }';
     //console.log(insertquery)
    //var errors = req.validationErrors();
    //if(errors){
     //  res.status(422).json(errors);
       // return;
    //}
    fuseki.connect(function(err, con) {
        if (err) {
            res.status(err.code || 500).jsonp(err);
        } else {
            con.update(dataset, insertquery, function(err, data) {
                  console.log(insertquery);
                  res.sendStatus(200);
            });
            
        }
    });
    

});
//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/user/:user_id');
curut2.all(function(req,res,next){
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//delete data
curut2.delete(function(req,res,next){
    
    var user_id = req.params.user_id;
    var deletequery = "DELETE { ?s ?p ?o }WHERE {?s ?p ?o ; <http://taxi.essad.to/taxi.rdf#id> '"+user_id+"'}";
    fuseki.connect(function(err, con) {
        if (err) {
            res.status(err.code || 500).jsonp(err);
        } else {
    
            con.update(dataset, deletequery, function(err, data) {
                  console.log(deletequery);
                  res.sendStatus(200);
            });
            
        }
    });
});

app.use('/api', router);



/***************************************************************************************************/
var server = app.listen(3000, function () {
    var host = 'localhost',
        port = '3000';

    console.log('Server listening at http://%s:%s', host, port);
});
