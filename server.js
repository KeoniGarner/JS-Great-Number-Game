var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    if (!req.session.correct){
        req.session.correct = Math.floor(Math.random() * 101 + 1);
    }
    if (!req.session.answer) {
        req.session.answer = "Take a guess!";
    }
    res.render('index', {answer: req.session.answer});
});

app.post('/guess', function(req, res) {
    if (req.body.guess > req.session.correct){
        req.session.answer = "Too High";
    } else if (req.body.guess < req.session.correct){
        req.session.answer = "Too Low";
    } else {
        req.session.answer = "You got it! Nice guessing!"
    }
    res.redirect('/');
});

app.post('/reset', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});


app.listen(8000, function() {
    console.log("Running in localhost at port 8000");
});