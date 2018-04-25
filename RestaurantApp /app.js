var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose") ; 

var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var user = require("./models/user");

app.use(require("express-session")({
    secret: "i love dogs so much",
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

mongoose.connect("mongodb://localhost/cs-trash") ;

app.use(bodyParser.urlencoded({extended: true}));

var CURR;

app.use(function(req,res,next){
    CURR = req.user;
    res.locals.currentUser = req.user;
    next();
})


var city ;


//LOGOUT ROUTE

app.get("/logout", function(req,res){

    //res.render("login.ejs");
    req.logout();
    res.redirect("/");


});




//LOGIN ROUTES

app.get("/login", function(req,res){

    res.render("login.ejs");


});



app.post("/login", passport.authenticate("local",{
    successRedirect: "/saved",
    failureRedirect: "/login"

} ),function(req,res){
 
    });





//REGISTER ROUTES


app.get("/register", function(req,res){

    res.render("register.ejs");


});







app.post("/register", function(req,res){

    user.register(new user({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register.ejs');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/");
        });
    });


});




//checking if user is logged in
function isLoggedIn(req,res,next){

    if(req.isAuthenticated()){
        return next(); 
    }

    res.render("login.ejs");

}












app.get("/", function(req,res){

    //console.log("logging get /");
    CURR = req.user; 
  res.render("home.ejs", {currentUser: req.user});

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

       
        res.render("resultpage.ejs", {info:info, currentUser: req.user}) ;



        //res.send(restaurants[index]);

        //name , image_url , is_closed , url(of the place) , rating , price , location-display_address , display_phone 
    })


});

//var restaurants= [ ];
var stringForMong = "mongodb://localhost/" ;
var finalString = stringForMong + CURR;

//mongoose.connect(finalString) ;

  var RestaurantSchema = new mongoose.Schema({
    nameOfRestaurant: String 
}) ; 

var Restaurant = mongoose.model("Restaurant" , RestaurantSchema) ;

app.post("/r", isLoggedIn, function(req,res){



    //user.update(s)



    //city = req.body.cityname;
    //console.log(name);
    //console.log(req.body);
  //  restaurants.push(info);
    //console.log(restaurants);

/*    var newRestaurant = new Restaurant({
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

   /* Restaurant.create({
        nameOfRestaurant: name

    }, function(err,rest){
        if (err) 
        {
            console.log("Could not save restaurant");

        }
        else{

            console.log("Saved Restaurant: ");
            console.log(rest);
*/
        console.log("userrrr: ");
        //console.log(CURR);
        console.log(req.user.username);


        user.update({username : req.user.username}  , {$push: {restaurants  : name}}, function(err,numberAffected , rawResponse){
            if(err)
            {
                console.error("error!!!!!") ; 
            }
            else
            {
                console.log("plz it happened") ;
            }

        }) ;


        res.redirect("/saved");
        //var finaluser = req.user.restaurants ;

       // res.render("saved.ejs" , {finaluser : finaluser});

          /*  Restaurant.find({},function(err  , listOfRestaurants){
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
        */

      
       //}
   // });

    

       
    

    //res.render("saved.ejs", {restaurants:restaurants});

}) ;


app.get("/saved", function(req,res){

  user.find({username : req.user.username},function(err  , person){
            if(err)
            {
                console.log("Could not print out the restaurants") ;
            }
            else
            {
                //console.log("List of restaurants: ");
                console.log(person) ;
                console.log(person[0].restaurants) ; 
                var listOfRestaurants = person[0].restaurants;

                res.render("saved.ejs" , {listOfRestaurants : listOfRestaurants}) ;
            }
        });

});



    //res.redirect("/r");
    //console.log(city) ; 




var port = process.env.PORT || 1234;
app.listen(port, function(){
    console.log("App has started!");
});