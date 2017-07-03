var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
//create schema for search/date
var pastSearchesSchema = Schema({
    search: {type: String, required: true},
    search_date: {Date, default: Date.now}
    
});

var PastSearches = module.exports = mongoose.model('search',pastSearchesSchema)

//get Searches
module.exports.getSearches = function(callback) {
    PastSearches.find(callback).limit(10);
}

//add Searches
module.exports.addSearch = function(addthis, callback) {
    PastSearches.create(addthis, callback);
}
*/