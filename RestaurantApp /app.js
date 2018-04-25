var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");

var mongoose = require("mongoose") ; 
mongoose.connect("mongodb://localhost/cs-trash") ;

var city ;

app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res){

    //console.log("logging get /");
  res.render("home.ejs");

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

//var restaurants= [ ];

var RestaurantSchema = new mongoose.Schema({
    nameOfRestaurant:String 
}) ; 

var Restaurant = mongoose.model("Restaurant" , RestaurantSchema) ;

app.post("/r", function(req,res){

    //city = req.body.cityname;
    //console.log(name);
    //console.log(req.body);
  //  restaurants.push(info);
    //console.log(restaurants);

    /*var newRestaurant = new Restaurant({
    nameofRestaurant: name 
    }) ;

    newRestaurant.save(function(err , Restaurant){
    if(err){
        console.log("Could not save to the database") ; 
    }
    else
    {
        console.log("Saved")  ;
        console.log(Restaurant) ; 
    }*/

    Restaurant.create({
        nameOfRestaurant: name

    }, function(err,rest){
        if (err) 
        {
            console.log("Could not save restaurant");

        }
        else{

            console.log("Saved Restaurant: ");
            console.log(rest);
            Restaurant.find({},function(err  , listOfRestaurants){
            if(err)
            {
                console.log("Could not print out the restaurants") ;
            }
            else
            {
                //console.log("List of restaurants: ");
                //console.log(listOfRestaurants[1]) ; 

                res.render("saved.ejs" , { listOfRestaurants : listOfRestaurants}) ;
            }
        });
        

       /* var propArray = [] ;
        Restaurant.find().toArray(function(err, listOfRestaurants){
            var i , count ;
            for(i=0 , count = listOfRestaurants.length ; i<count ; i++)
            {
                propArray.push(new models.propertyModel(listOfRestaurants[i])) ;
            }
            var finallist = propArray; 
            res.render("saved.ejs" , { finallist:finallist}) ;
        })
*/
        }
    });

    

       
    

    //res.render("saved.ejs", {restaurants:restaurants});

}) ;

    //res.redirect("/r");
    //console.log(city) ; 




var port = process.env.PORT || 1234;
app.listen(port, function(){
    console.log("App has started!");
});