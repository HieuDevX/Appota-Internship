var express = require('express');
var app = express();

//khai báo cổng chạy server
var PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('<h1>Todo RESTful</h1>');
});

app.listen(PORT, function () {
  console.log('Server listening on port ' + PORT + '!');
});
