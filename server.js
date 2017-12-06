
// DEPENDENCIES
//===============================================================================================
const express = require("express");
const body = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
//===============================================================================================

// Using ES6 promise
mongoose.Promise = Promise;

// Initialize Express
const app = express();

// Set Handlebars as the default templating engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(body.json()); // support json encoded bodies
app.use(body.urlencoded({ extended: false })); // support encoded bodies

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/homework";
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// require the API routes
require("./controllers/routes.js")(app);


// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port 3000!");
});