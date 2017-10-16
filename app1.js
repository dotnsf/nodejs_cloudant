// app.js

var Cloudantlib = require( 'cloudant' );
var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var app = express();

var settings = require( './settings' );
var cloudant = Cloudantlib( { account: settings.cloudant_username, password: settings.cloudant_password } );
var db = cloudant.db.use( settings.cloudant_db );

app.use( express.static( __dirname + '/public' ) );
//app.use( bodyParser.urlencoded( { extended: true, limit: '10mb' } ) );
app.use( bodyParser.urlencoded() );
app.use( bodyParser.json() );

app.post( '/mypost', function( req, res ){
  console.log( 'POST /mypost' );
  console.log( req.body );
  db.insert( req.body, function( err, body, header ){
    if( err ){
      res.status( 400 );
      res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
      res.end();
    }else{
      res.write( JSON.stringify( { status: true, doc: req.body }, 2, null ) );
      res.end();
    }
  });
});

app.get( '/mydata', function( req, res ){
  console.log( 'GET /mydata' );
  db.list( { include_docs: true }, function( err, body ){
    if( err ){
      res.status( 400 );
      res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
      res.end();
    }else{
      var docs = [];
      for( var i = 0; i < body.rows.length; i ++ ){
        docs.push( body.rows[i].doc );
      }
      res.write( JSON.stringify( { status: true, docs: docs }, 2, null ) );
      res.end();
    }
  });
});

app.delete( '/mydelete/:id', function( req, res ){
  var id = req.params.id;
  console.log( 'DELETE /mydelete/' + id );
  db.get( id, function( err, data ){
    if( err ){
      res.status( 400 );
      res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
      res.end();
    }else{
      db.destroy( id, data._rev, function( err, body ){
        if( err ){
          res.status( 400 );
          res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
          res.end();
        }else{
          res.write( JSON.stringify( { status: true }, 2, null ) );
          res.end();
        }
      });
    }
  });
});

var port = 3000;
app.listen( port );
console.log( 'server started on ' + port );
