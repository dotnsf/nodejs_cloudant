// app.js

var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var app = express();

var data = [];

app.use( express.static( __dirname + '/public' ) );
//app.use( bodyParser.urlencoded( { extended: true, limit: '10mb' } ) );
app.use( bodyParser.urlencoded() );
app.use( bodyParser.json() );

app.get( '/hello', function( req, res ){
  res.write( 'Hello World.' );
  res.end();
});

app.post( '/mypost', function( req, res ){
//  console.log( req.body );
  data.push( req.body );
  res.write( JSON.stringify( req.body ) );
  res.end();
});

app.get( '/mydata', function( req, res ){
  res.write( JSON.stringify( data ) );
  res.end();
});

var port = 3000;
app.listen( port );
console.log( 'server started on ' + port );
