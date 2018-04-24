var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");

var city ;

app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res){

  res.render("home.ejs")

});


app.post("/", function(req,res){

    city = req.body.cityname;
    res.redirect("/r");
    //console.log(city) ; 

});

var url ;
var name ; 
var image_url ;
var is_closed ;
var resurl ;
var rating ;
var price ;
var location ;
var phone ;

var info ;

app.get("/r",function(req,res){
    
    //request.get('https://api.yelp.com/v3/businesses/search?term=restaurant&location=Chicago', {
      
    //console.log(city) ; 

    url = 'https://api.yelp.com/v3/businesses/search?term=restaurant&location='+city ;
    
    request.get(url,{
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
 
        name = restaurants[index]["name"] ;
        image_url = restaurants[index]["image_url"] ; 
        is_closed = restaurants[index]["is_closed"] ;
        resurl = restaurants[index]["url"] ;
        rating = restaurants[index]["rating"] ;
        price = restaurants[index]["price"] ;
        location = restaurants[index]["location"]["display_address"] ;
        phone = restaurants[index]["phone"] ;

           var open ;

        if(is_closed==true)
        {
            open = "open" ;
        }
        else
        {
            open = "closed" ;
        }


        info = [   name ,
                image_url ,
                open ,
                resurl,
                rating,
                price,
                location,
                phone
        ] ;

       
        res.render("resultpage.ejs", {info:info}) ;

        //res.send(restaurants[index]);

        //name , image_url , is_closed , url(of the place) , rating , price , location-display_address , display_phone 
    })


   
    
});
var port = process.env.PORT || 1234;
app.listen(port, function(){
    console.log("App has started!");
});