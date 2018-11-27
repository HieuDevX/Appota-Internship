var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var todos = [{
  id: 0,
  description: 'Build a simple API - nodejs',
  completed: false
}, {
  id: 1,
  description: 'Go to T-beer - team building',
  completed: false
}, {
  id: 2,
  description: 'Feed the dog ',
  completed: true
}];

var todoNextId = 3;


//khai báo cổng chạy server
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('<h1>Todo RESTful</h1>');
});

app.get('/todos', function (req, res) {
  res.json(todos);
});

app.get('/todo/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  console.log(todoId);
  var matchedTodo;

  todos.forEach(function (todo) {
    if (todoId == todo.id) {
      matchedTodo = todo;
      console.log(matchedTodo);
    }
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

app.post('/todo', function (req, res) {
  var body = req.body;
  body.id = todoNextId++;

  todos.push(body);

  res.json(body);
});

app.delete('/todo', function (req, res) {
  var todoId = parseInt(req.body.id, 10);
  console.log(todoId);
  var matchedTodo;

  todos.forEach(function (todo) {
    if (todoId == todo.id) {
      matchedTodo = todo;
      console.log(matchedTodo);
      todos.splice(todoId, 1);
    }
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

app.put('/todo', function (req, res) {
  var todoId = parseInt(req.body.id, 10);
  console.log(todoId);
  var matchedTodo;

  todos.forEach(function (todo) {
    if (todoId == todo.id) {
      matchedTodo = todo;
      console.log(matchedTodo);
      todo.description = req.body.description;
      todo.completed = req.body.completed;
    }
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

app.listen(PORT, function () {
  console.log('Server listening on port ' + PORT + '!');
});
