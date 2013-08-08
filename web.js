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

var Config = require('./config');

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
                    endpoint: "https://jointventuregroup.waxlrs.com/TCAPI/", //Config.endpoint,
                    username: "QIIRadPjLX7eP7TX9RyD", // Config.authUser,
                    password: "hP2sLO3a3Z0aA6fU3jlC", // Config.authPassword
//                    version: this.allVersions[i]
                }
		);
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

if (false)
{

var app = express(express.logger());
//var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.setHeader('Content-Type', 'text/html');
  response.send(text1);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
}