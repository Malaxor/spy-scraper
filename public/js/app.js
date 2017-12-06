
$(document).ready(function() {

	$("#scrape").on("click", function(event) {

		event.preventDefault();
		$(".collection").empty();
		$.get("/scrape");
		window.location.reload(true);
	});

	$(document).on("click", ".save-btn", function() {
	    // store each article's save button data-id in a variable
	    var id = $(this).attr("data-id");
	    // run a POST Ajax method
	    $.ajax({
	      method: "POST",
	      url: "/save/" + id
	    }).done(function(data) {
	      // // using the collection class, remove the saved article from the page
	      // $("div").filter("data-id=" + id).remove(".collection-item");
	    }); 
	    $(this).text("Saved");
	    $(this).css({"background-color": "yellow", "color": "black"});
	});

	$(document).on("click", ".unsave-btn", function() {
	    // store each article's save button data-id in a variable
	    var id = $(this).attr("data-id");
	    // run a POST Ajax method
	    $.ajax({
	      method: "POST",
	      url: "/unsave/" + id
	    }).done(function(data) {
	      // // using the collection class, remove the saved article from the page
	      // $("div").filter("data-id=" + id).remove(".collection-item");
	    }); 
	    window.location.reload(true)
	});

	$(".delete-btn").on("click", function(event) {

		event.preventDefault();
		var queryURL = window.location.href + "/" + $(this).data("id");
		$.ajax({
			method: "delete",
			url: queryURL
		});
		window.location.reload(true);
	});
});