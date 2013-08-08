var express = require('express');
var fs = require('fs');
var backbone = require('backbone');
//var underscore = require('underscore');
var csv = require('csv');
var sys = require('util');
var XMLHttpRequest = require("./XMLHttpRequest").XMLHttpRequest;


var xhr = new XMLHttpRequest();

var TinCan = require("./tincan");

var infile = "index.html";
var text1 = fs.readFileSync( infile);
var ConfigText = fs.readFileSync( "config.js");
eval( ConfigText);
var Config = require('./config').Config;
/*
//globals: equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start, golfStatements, console
/*jslint bitwise: true, browser: true, plusplus: true, maxerr: 50, indent: 4 * /
function Config() {
	"use strict";
}
Config.endpoint = "https://jointventuregroup.waxlrs.com/TCAPI/";
Config.authUser = "QIIRadPjLX7eP7TX9RyD";
Config.authPassword = "hP2sLO3a3Z0aA6fU3jlC";
Config.actor = { "mbox":["<learner email>"], "name":["<Learner Name>"] };
*/
TinCan.TinCan.DEBUG = true;
/*
var LRS = new TinCan.TinCan.LRS(
                {
                    endpoint: "https://jointventuregroup.waxlrs.com/TCAPI/", //Config.endpoint,
                    username: Config.authUser,
                    password: Config.authPassword
//                    version: this.allVersions[i]
                }
		);
*/		


var tincanapi = new TinCan.TinCan;
tincanapi.addRecordStore( 
                {
                    endpoint: Config.endpoint,
                    username: Config.authUser,
                    password: Config.authPassword
//                    version: this.allVersions[i]
                }
		);
if (false)
{
var statements =
[ 
   { 
      "verb":{ 
         "id":"http://example.com/verbs/sailed", 
         "display":{ 
            "en":"sailed" 
         } 
      }, 
      "result":{ 
         "completion":true, 
         "success":true 
      }, 
      "context":{ 
         "contextActivities":{ 
            "other":{ 
               "id":"http://example.com/activities/oceanrelated" 
            } 
         }, 
         "instructor":{ 
            "mbox":"mailto:sam@example.com", 
            "name":"Sam" 
         } 
      }, 
      "timestamp":"2011-05-25T20:34:05.787000+00:00", 
      "object":{ 
         "id":"http://example.com/activities/sailingcourse" 
      }, 
      "actor":{ 
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
         "name":"Team ABC" 
      } 
   }
];

tincanapi.sendStatements( statements, null);
}

if (true)
{

var app = express(express.logger());
//var app = express.createServer(express.logger());

app
	.use( "/StatementViewer", express.static(__dirname + '/StatementViewer'))
	.get('/config.js', function(request, response) {
	  response.setHeader('Content-Type', 'application/javascript');
	  response.send( ConfigText );
	})
	.get('/', function(request, response) {
	  response.setHeader('Content-Type', 'text/html');
	  response.send(text1);
	});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
}