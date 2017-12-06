
// DEPENDENCIES
//========================================================================
var cheerio = require("cheerio");
var request = require("request");

// IMPORTS
//========================================================================
var Comment = require("../models/comment.js");
var Article = require("../models/article.js");

//ROUTES
//========================================================================

// export this function, and use it in the server.js file
module.exports = function(app) {
	// home page will render the index.handlebars page
	app.get("/", function(req, res) {
		
		res.render("articles");
	});
	// this path will display the scraped articles stored in the database collection named "Articles"
	app.get("/propaganda", function(req, res) {
		// find all articles
		Article.find({}, function(err, data) {
			// log errors
			if(err) {

				console.log(err);
			}
			else {
				// if there are no errors, display the database collection(data) named "Articles" on the articles.handlebars page 
				res.render("articles", {article: data});
			} // sort the documents in ascending order
		}).sort({"_id": 1});
	});

	// GET method will encapsulate our scrape method
	app.get("/scrape", function(req, res) {
		// we'll use cheerio to scrape this website
		request("https://www.nytimes.com", function(error, response, html) {
			// load the html body into cheerio and save it in a variable
			var $ = cheerio.load(html);
			//  // With cheerio, find each p-tag with the "title" class
  			// (i: iterator; element: the current element)
  			$("article.story.theme-summary").each(function(i, element) {
  				// we'll use this object to store the title and link, then we're gonna push the object to the database
  				var result = {};
  				// save each element's text  into a variable
  				result.title = $(this).children(".story-heading").children("a").text().trim();
  				// save each element's  link  into a variable
  				result.link = $(this).children(".story-heading").children("a").attr('href');
  				// save each element's  summary  into a variable
  				result.summary = $(this).children("p.summary").text().trim();
  				// create a new entry, using the article constructor
  				var entry = new Article(result);
  				// push the entry variable to the database
  				entry.save(function(err, data) {
  					// log errors; if there aren't any, log the collections(data) pushed to the database
  					if(err) {
  						console.log(err);
  					}
  					else {
  						console.log(data);
  					}
  				});
  			});
		});
	});
	// POST method for saving a particular article
	app.post("/save/:id", function(req, res) {
		// in the Article collection, locate the document by its unique id, then change the saved parameter to "true"
		Article.update({"_id": req.params.id}, {$set: {saved: true}}).then(function(data) {
		// store the data in json 
		res.json(data);
		}).catch(function(err) {
			res.json(err);
		});
	});

	// POST method for un-saving a particular article
	app.post("/unsave/:id", function(req, res) {
		// in the Article collection, locate the document by its unique id, then change the saved parameter to "true"
		Article.update({"_id": req.params.id}, {$set: {saved: false}}).then(function(data) {
		// store the data in json 
		res.json(data);
		}).catch(function(err) {
			res.json(err);
		});
	});

	app.get("/saved", function(req, res) {
		// find all articles
		Article.find({saved: true}, function(err, data) {
			// log errors
			if(err) {

				console.log(err);
			}
			else {
				// if there are no errors, display the database collection(data) named "Articles" on the articles.handlebars page 
				res.render("saved", {article: data});
			} // sort the documents in ascending order
		}).sort({"_id": 1});
	});

	// GET method for grabbing a unique id
	app.get("/:id", function(req, res) {
		// using our database Article schema, populate all the comments associated with a particular article's id; execute the function
		Article.findOne({"_id": req.params.id}).populate("comment").exec(function(err, data) {
			// log any errors
			if(err) {
				console.log(err);
			}
			else {
				// render the comments handlebars page, and use "data" to infuse into that page any info stored in our Article collection 
				res.render("comments", {article: data});
			}
		});
	});

	// POST method for creating new comments
	app.post("/:id", function(req, res) {
		// create a new comment, using the Comment constructor
		var newComment = new Comment(req.body);
		// save it to the database
		newComment.save(function(err, data) {
			// log any errors
			if(err) {
				console.log(err);
			}
			else {
				// locate an article by its unique id; once found, push the comment into the comment array
				Article.findOneAndUpdate({"_id": req.params.id}, {$push: {"comment": data._id}}, {new: true})
				.exec(function(err, doc) {

					if(err) {
						console.log(err);
					}
					else {
						// reload the current page
						res.redirect("/" + req.params.id);
					}
				});
			}
		});
	});	

	// method to delete comments
	app.delete("/:id/:comment", function(req, res) {

		Comment.findByIdAndRemove(req.params.comment, function(err, data) {

			if(err) {
				console.log(err);
			}
			else {

				Article.findOneAndUpdate({"_id": req.params.id}, {$pull: {"comment": data._id}}).exec(function(error, doc) {

					if(error) return error;
				});
			}
		});
	});
}


