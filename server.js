var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


var logger = require("morgan");

var express = require("express");

var PORT = process.env.PORT || 3000;

var app = express();
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");


app.use(express.static("public"));

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Require all models
var db = require("./models");

//Scrape Routes
var scrapedArticles = []
// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://politics.theonion.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
        counter = 0;
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h1").each(function (i, element) {
      // Save an empty result object
      var result = {};
      
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        
        .children("a")
        // .has($(".js_entry-link"))
        .text();
      result.link = $(this)
        
        .children("a")
        // .has($(".js_entry-link"))
        .attr("href");

      // result.summary = $(this)
      // .children(".item__content .excerpt p")
      // .text()

      // Create a new Article using the `result` object built from scraping
      db.Article.findOne({ title: result.title })
        .then(function (dbArticle) {
          if (dbArticle) {
            return false
          } else {
            db.Article.create(result)
              .then(function (dbArticle) {
                // View the added result in the console
                // console.log(dbArticle);
                counter++
                console.log(counter)
                
              })
              .catch(function (err) {
                // If an error occurred, send it to the client
                return res.json(err);
              });
          }
        })
        
    }, foundArticles()
    
    );

    // If we were able to successfully scrape and save an Article, send a message to the client
    function foundArticles(){
      console.log(counter)
      res.send(String(counter))
    }
    
  });
});

app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
//html routes
app.get("/", (req, res) => {
  res.render("index")
})


app.listen(PORT, function () {
  console.log("App now listening at localhost:" + PORT);
});