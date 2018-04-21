var express = require("express");
var app = express();
var request = require("request");






app.get("/",function(req,res){
    
    request.get('https://api.yelp.com/v3/businesses/search?term=restaurant&location=Chicago', {
    'auth': {
    'bearer': 'e7shJO7nDf4pCsHUaONMUFjkprFgIeA4-oRryI7U7e6kr1QLjlKR6b21t89eRj7_qSjWLDpzguM_sCU7zKyZd_bKs7WcqsmHOdRWAWg-JIrjKWQK9lY8OjtkRLfWWnYx'
        }
    }, function(error, response, body){
        var results = JSON.parse(body);
        var restaurants = results["businesses"];

        var count = 0;

        for(var rest in restaurants)
        {
          count++;
        }

        var index = Math.round(Math.random()*(count-1));
        res.send(restaurants[index]);

    })


   
    
});

app.listen(1234, function(){
    console.log("App has started!");
});