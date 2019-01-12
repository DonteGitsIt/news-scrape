$(function () {
    
    populateArticles()

    function populateArticles() {
        $("#articles").html("")

        $.ajax({
            method: "GET",
            url: "/articles"
        }).then(data => {
            // console.log(data)
            for (var i = 0; i < data.length; i++) {
                // Display the apropriate information on the page

                var newArticle = "<h5 data-id=" + data[i]._id + ">" + data[i].title + "</h5>"

                var newLink = "<a href=" + data[i].link + ">" + "View Full Article" + "</a>"
                var newRow = $("<div>").attr("class", "row")
                newRow.append("<div class='col'>"+newArticle+"</div>")
                newRow.append("<div class='col'>"+newLink+"</div>")
                $("#articles").prepend(newRow);
            }
        })
    }

    function scrapeArticles() {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(data => {
            console.log(data)

            populateArticles()
            
            // if(parseInt(data) > 0){
            //     populateArticles()
            //     $("#scrape-message").html(data + "new articles scraped!")
            // }else{
            //     populateArticles()
            //     $("#scrape-message").html("No new articles found.")
            // }
        })
    }

    $("#scrape").on("click", () => scrapeArticles())
});