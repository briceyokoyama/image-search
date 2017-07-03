var express = require('express');
var mongoose = require('mongoose');
var request = require('request');

var app = express();

var PastSearches = require('./models/models.js');

//Connect to search-history database
mongoose.connect('mongodb://localhost/search-history');

//check if connection successful
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected Successfully");
});

//create schema
var searchSchema = mongoose.Schema({
    searchtext: {type: String},
    dateSearched: {type: Date, required: true, default: Date.now}
});

//compile schema into a Model
var Search = mongoose.model('Search',searchSchema);

app.get('/', function(req, res) {
    res.send("Make a search!");
});

app.get('/imagesearch/*', function(req, res) {
    var search = req.params[0].replace(/ /g,"%20");
    var offset = req.query.offset;
    
    var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyDrr2VwzzalsWGvkt94u2e6yEr8KNxXV6o&cx=002205177524306559022:irnlsyerp64&searchType=image&q="+search+"&start="+offset;

    request({
        url: url,
        json: true
    }, function(error, response, body) {
        if(!error && response.statusCode ===200) {
            
            var results = [];
            for(var i = 0; i<body.items.length;i++) {
                var obj = {
                    url: body.items[i].link,
                    snippet: body.items[i].snippet,
                    thumbnail: body.items[i].image.thumbnailLink,
                    context: body.items[i].image.contextLink
                };
                results.push(obj);
            }
            res.send(results);
        }
    });
    
    //append search to recent searches
    var lastSearch = new Search({searchtext: req.params[0]})
    lastSearch.save(function (err) {
        if(err) return handleError(err);
    });
    
});

app.get('/latest/', function(req,res) {
    var results = [];
    Search.find({}).sort('date').limit(10).exec(function(err, docs) {
        docs.forEach(function(a) {
            results.push({
                "Search" : a.searchtext,
                "When" : a.dateSearched
            });
            console.log(results);
        });
        res.send(results);
    });
})

var server = app.listen(8080);