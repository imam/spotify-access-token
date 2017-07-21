/** Settings */
var port = 8000;
var db_file = 'db.json';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var low = require('lowdb');
var db = low(db_file);
var axios = require('axios');
var qs = require('qs');



db.defaults({id:'', secret:''}).write();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'pug');

app.get('/', function(req, res){
	res.render('index', {id: db.get('id'), secret: db.get('secret')});
});

app.post('/app_detail', function(req,res){
	db.set('id', req.body.id).set('secret',req.body.secret).write();
	res.redirect(200,'/');
});

app.get('/token', function(req, response){
	authorization_code = new Buffer(db.get('id')+':'+db.get('secret')).toString('base64');
	axios.post('https://accounts.spotify.com/api/token',qs.stringify({'grant_type': 'client_credentials'}),{
		headers: {
			'Authorization' : ' Basic '+ authorization_code,
			'Content-Type':'application/x-www-form-urlencoded'
		}
	})
		.then(res=>response.json({access_token:res.data.access_token}))
		.catch(error=>response.send('Something went wrong'));
});

app.listen(port, function(){
	console.log('Running on port ' + 8000);
});