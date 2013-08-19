var express = require('express');
var fs = require('fs');
var path = require('path');
var backbone = require('backbone');
//var underscore = require('underscore')+_;
var csv = require('csv');
var sys = require('util');
var XMLHttpRequest = require("./XMLHttpRequest").XMLHttpRequest;
var sys = require('util');
var Tabletop = require('tabletop');
var xhr = new XMLHttpRequest();

var TinCan = require("./tincan");

var ConfigText = fs.readFileSync( "config.js");
var StatementText = fs.readFileSync( "statements.json");
eval( ConfigText);
var Config = require('./config').Config;
TinCan.TinCan.DEBUG = true;
var tincanapi = new TinCan.TinCan;
tincanapi.addRecordStore( 
                {
                    endpoint: Config.endpoint,
                    username: Config.authUser,
                    password: Config.authPassword
//                    version: this.allVersions[i]
                }
		);

function ToBool( val)
{
    var val1 = String(val).toLowerCase();
    if ( val1 == 'true')
	    return true;
    if ( val1 == 'yes')
	    return true;
    if ( val1 == '1')
	    return true;
    if ( val1 == 'correct')
	    return true;
    if ( val1 == 'done')
	    return true;
    return false;
}

function RowToStatement( row)
{
    var d = new Date();
    var d = new Date( d.getTime() + row.time * 60000);

    var statement = 
    { 
	"verb":
	{ 
	    "id":"http://example.com/verbs/" + row.verb, 
	    "display":
	    { 
		"en":row.verb
	    } 
	}, 
	"result":
	{ 
	    "completion": ToBool(row.completion), 
	    "success": ToBool(row.success) 
	}, 
	"context":
	{ 
	    /*
	    "contextActivities":{ 
	    "other":{ 
	    "id": row.Object 
	    } 
	    }*/
	    /*, 
	    "instructor":{ 
	    "mbox":"mailto:sam@example.com", 
	    "name":"Sam" 
	    } */
	}, 
	"timestamp": d.toISOString(), // "2011-05-25T20:34:05.787000+00:00", 
	"object":
	{ 
	    // TBC Must be URI
	    "id": row.object
	}, 
	"actor":
	{ 
	    "objectType":"Agent", 
	    // "openid":"https://africanoreuropean.com", 
	    "mbox": row.email, 
	    /*
	    "objectType":"Group", 
	    "member":[ 
	    { 
	    "mbox":"mailto:a@b.com", 
	    "name":"Bob" 
	    }, 
	    { 
	    "mbox":"mailto:b@c.com", 
	    "name":"Jones" 
	    } 
	    ], 
	    */
	    "name": row.actor 
	}
	// for(prop in row) 
	// {
        //     html = html + "&nbsp;-&nbsp;" + row[prop];
        // }
    }
    return statement;
};

function ArrayToStatements( Data, atEnd)
{
    var statements = [];
    for ( i = 0; i < Data.length; i++)
    {
	var statement = RowToStatement( Data[ i]);
	statements.push( statement);
    }
    atEnd( statements);
    return statements;
}

function keysToLowerCase (obj) {
  var keys = Object.keys(obj);
  var n = keys.length;
  while (n--) {
    var key = keys[n]; // "cache" it, for less lookups to the array
    if (key !== key.toLowerCase()) { // might already be in its lower case version
        obj[key.toLowerCase()] = obj[key] // swap the value to a new lower case key
        delete obj[key] // delete the old key
    }
  }
  return (obj);
}

function CSVToStatements( csvpath, atEnd)
{
    var statements = [];
    var Headers;
    csv()
    .from.path(csvpath, 
	{
	    columns: true,
	    relax: true
	}
	)
    .on('record', function(row, index) 
    {
	// .to(function(row) {
	// due to columns: true, row is now an object
	// if (index == 0)
	//    Headers = row;
	// else
	// var shares = Math.round(marketCapFloat(row[2])/row[3], 0);
	// var eps = (row[3]/row[4]).toFixed(3);
	// var earnings = accounting.formatMoney(eps * shares);
	// outrow = row.concat([shares, eps, earnings]);
	//				console.log(row.join("\t"));
	console.log("got one row");
	keysToLowerCase( row);
	var statement = RowToStatement( row);
	statements.push( statement);
    })
    .on('end', function()
    {
	atEnd( statements);
    }
    )
    ;
    return statements;
}

if (false)
{
    var statements = CSVToStatements( __dirname + "/CSVSample.csv"
    , function(statements){ 
    var Buffer = JSON.stringify( statements);
    console.log( Buffer);
    tincanapi.sendStatements( statements);
    }
    );
}

if (true)
{
    var app = express(express.logger());
    app.configure(function () {
	app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.static( path.join(__dirname, "media")));
	app.use(express.bodyParser({
	      keepExtensions: true
	}));
    })

    app
	.use( "/StatementViewer", express.static(__dirname + '/StatementViewer'))
	.get('/config.js', function(request, response) {
	  response.setHeader('Content-Type', 'application/javascript');
	  response.send( ConfigText );
	})
	.get('/CSVSample.csv', function(request, response) {
	  var text1 = fs.readFileSync( "CSVSample.csv");
	  response.setHeader('Content-Type', 'text/csv');
	  response.send( text1 );
	})
	.get('/Test', function(request, response){
		var statements = JSON.parse( StatementText);
		// 
		tincanapi.sendStatements( statements, function( api, statements1){
		        var Buffer = "Sending statements below \n" + JSON.stringify( statements);
			response.setHeader('Content-Type', 'text/plain');
			response.send( Buffer );
		});
  	   
	})
	.get('/Upload', function(request, response) {
	  var text1 = fs.readFileSync( "upload.html");
	  response.setHeader('Content-Type', 'text/html');
	  response.send(text1);
	})
	.post('/Upload', function(request, response) {
	        var csvpath = request.files.csvfile.path;
		var csvfile = fs.readFileSync( csvpath);
		var statements = CSVToStatements( csvpath,
			function( statements)
			{
				tincanapi.sendStatements( statements
					, function( api, statements1)
					{
						var Buffer = "Sending statements below \n" + JSON.stringify( statements) + "\n From \n" + csvfile;
						response.setHeader('Content-Type', 'text/plain');
					//	  var text1 = fs.readFileSync( "upload.html");
						response.send( Buffer );
					}
					);
			}
			);
	}
	)
	.post('/LinkToDoc', function(request, response) {
	        var GoogleURI = request.body.GoogleURI;
			console.log( GoogleURI);
		var options = {
		  key: GoogleURI,
		  simpleSheet: true,
		  callback: function (data, tabletop) 
		  {
			console.log( data);
			var statements = ArrayToStatements( data,
				function( statements)
				{
					tincanapi.sendStatements( statements
						, function( api, statements1)
						{
							var Buffer = "Sending statements below \n" + JSON.stringify( statements) + "\n From \n" + GoogleURI;
							response.setHeader('Content-Type', 'text/plain');
						//	  var text1 = fs.readFileSync( "upload.html");
							response.send( Buffer );
						}
						);
				}
				);
		}
		};

		Tabletop.init(options);
	}
	)
	.get('/', function(request, response) {
	  var infile = "index.html";
	  var text1 = fs.readFileSync( infile);
	  response.setHeader('Content-Type', 'text/html');
	  response.send(text1);
	})
	;

    var port = process.env.PORT || 8080;
    app.listen(port, function() {
      console.log("Listening on " + port);
    });
}