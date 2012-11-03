// from click to result
function findTweet() { 
	findUser();
}


// store username given via input
function findUser() {
    var myUser = document.tweetfinder.user.value;
    console.log(myUser); //test
    thetweet.innerHTML = "You entered username: " + myUser; //test
    return myUser
}

//call info about username via twitter api

//extract relevant data to get to first tweet of username

//get ID of first tweet

//create oEmbed of first tweet via ID
function generateEmbed() {
	
	
	tweet = "";
	return tweet
}


//send embed code of first tweet back to html
function displayTweet() {
	thetweet.innerHTML = tweet;
}

//API testground
$(document).ready(function() {
	$.getJSON('http://search.twitter.com/search.json?q=davidbauer&callback=?', function(data) {
		var data = data.results;
		var html = "<ul>";	
		for(var i=0; i<data.length; i++) {
	    	html += "<li><a href='http://twitter.com/" + data[i].from_user + "'>@" 
                      + data[i].from_user + "</a>: " + data[i].text + "</li>";
		}
		html += "</ul>"
    	$('#twitterapi').html(html);
	});
});
