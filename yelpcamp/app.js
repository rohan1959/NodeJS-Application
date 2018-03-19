var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.Promise = global.Promise; 


// SCHEMA  SETUP
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

var Campground = mongoose.model("campground",campgroundSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

/*
Campground.create({
    name: "Granite Hill",
    image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
    description:"This is a really good place"
    
    }, function(err, campground){
        if(err){
        console.log(err);
    } else{
        console.log("campground created");
        console.log(campground);
    }
});*/
    

app.get("/", function(req, res){
    res.render("home");
});


app.get("/campgrounds", function(req, res){
    //get all campgrounds from database
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds",{campgrounds:allCampgrounds});
        }
    })
    //res.render("campgrounds",{campgrounds:campgrounds});
});


app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //create new campground objecct.
    var newCampground = {name: name, image: image, description: desc};
    // Create campground and save in db
    Campground.create(newCampground, function(err, newlycreated){
        if(err){
            console.log(err);
        }else{
             //redirect back to campgrounds page
             res.redirect("/campgrounds");
        }
    })
});

app.get("/campgrounds/new", function(req, res){
   res.render("new.ejs"); 
});

// SHOW- show information about campgrounds.
app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show",{campground:foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});