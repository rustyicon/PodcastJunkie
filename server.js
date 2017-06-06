//depandencies
var express = require("express");
//var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//require models 
var Comment = require("./models/Comment.js");
var Podcast = require("./models/Podcast.js");


var request = require("request");
var cheerio = require("cheerio");


var app = express();

var port = process.env.PORT || 3000;


//app use body-parser and morgan 
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));

//access public dir
app.use(express.static("public"));


//handlebars setup
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/********* mongo setup **************
var databaseUrl = "podcast";
var collections = ["casts"];

var db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});
*/

/*

// *********** mongoose heroku setup **************
var uri = 'mongodb://heroku_wws6pdc8:fuuqragm3j0ibecd1dd7h9b2fl@ds161121.mlab.com:61121/heroku_wws6pdc8';
mongoose.connect(uri, function(error) {
  	console.log(error);
})
*/

//mongoose 
mongoose.connect("mongodb://localhost/podcast");
var db = mongoose.connection;

//log mongoose errors
db.on("error", function(error){
	console.log("mongoose error: ", error);
});

//log db successful connection
db.once("open", function(){
	console.log("mongoose connection successful.");
});

//ROUTES

app.get("/", function(res, res){
	Podcast.find({}, function(error, doc){
		if (error){
			console.log(error);
		}
		else{
			var hbsObject = {Podcast: doc};
			console.log(hbsObject);
			res.render("index", hbsObject);
		}
	});
});

app.get("/scrape", function(req, res){
	request("http://www.npr.org/podcasts/2061/technology", //"http://www.npr.org/podcasts/2038/news-politics","http://www.npr.org/podcasts/2051/society-culture","http://www.npr.org/podcasts/2066/tv-film", 
		function(error, response, html){
			var $ = cheerio.load(html);
			
			//Pocasts.drop();
			
			$("div.imagewrap").each(function(i, element) {
				var result = {};

				result.title = $(this).children().children("img").attr("alt");
				result.image = $(this).children().children("img").attr("src");
				result.link = $(this).children("a").attr("href");
				
				var entry = new Podcast(result);

				entry.save(function(err, scraped){
					if (err){
						console.log(err);
					}
					else{
						console.log(scraped);
						
					}
				});
				
			});
				
		});
		console.log("sracped!");
		res.redirect("/");
});

app.get("/podcasts", function(res, res){
	Podcast.find({}, function(error, doc){
		if (error){
			console.log(error);
		}
		else{
			console.log(doc);
			res.json(doc);
		}
	});
});


app.post("/save/:id", function (req, res){
	console.log(req.body);

	Podcast.findOneAndUpdate({"_id": req.params.id}, {"save": true})
	.exec(function(error, saved){
		if (error){
			console.log(error);
		}
		else {
			res.send(saved);
		}
	});
});

app.get("/saved", function(req, res){
	Podcast.find({favorite: true}, function(error, view){
		var hbsObject = {favorite: view};
		if (error){
			console.log(error);
		}
		else{
			res.render("saved", hbsObject);
		}
	});
});

/*
app.get("/delete:id", function(req, res){


	Podcast.remove({"_id": mongojs.ObjectID(req.params.id)
	}, function (err, del){
		if (err){
			res.send(err);
		}
		else{
			res.send(del);
		}
	});
});
*/
app.get("/comments", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Podcast.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("Comment")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


app.post("/comment/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newComment = new Comment(req.body);

  // And save the new note the db
  newComment.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Podcast.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.redirect("/");
        }
      });
    }
  });
});


app.listen(port, function() {
  console.log("App running on port 3000!");
});
