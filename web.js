var express = require('express');
var fs = require('fs');
var infile = "index.html";
var text1 = fs.readFileSync( infile);

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.setHeader('Content-Type', 'text/html');
  response.send(text1);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
