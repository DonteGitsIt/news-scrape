var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URI);

var express = require("express");

var PORT = process.env.PORT || 3000;

var app = express();


//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

app.use(express.static("public"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});