// from click to result
function findTweet() { 
	findUser();
	checkUser();
}


// store username given via input
function findUser() {
    var myUser;
    if (document.tweetfinder.user.value[0] == "@") {
		myUser = document.tweetfinder.user.value.substring(1,20); //get rid of the @
    }
    else {myUser = document.tweetfinder.user.value};
    if (myUser.length > 16) {
	    thetweet.innerHTML = "This doesn't seem to be a username. Too long." // apply length limit
    }
    else {
    	thetweet.innerHTML = "You entered username: " + myUser + "."; //test
    	return myUser;
    }
    
}

//TODO call info about username via twitter api
function checkUser(myUser) {
$(document).ready(function() {
	$.getJSON('https://api.twitter.com/1/users/show.json?screen_name=' + myUser + '&include_entities=true&callback=?', function(data) {
		var created = data.created_at;
		var name = data.name;
		var username = data.screen_name;
		var html = "";
		html += "Checked Twitter API for @" + username + "(" + name + "). This account was created on " + created; // test
    	$('.twitterapi').html(html); // test
	});
});
}


		// thetweet.innerHTML = "Sorry, no such username found. Please try another one." // error msg if twitter returns error

//TODO extract relevant data to get to first tweet of username

//TODO get ID of first tweet

//TODO create oEmbed of first tweet via ID
/* function generateEmbed() {
	var tweet = "";
	
	
	return tweet;

}
*/

//send embed code of first tweet back to html
/*function displayTweet() {
	thetweet.innerHTML = tweet;

}
*/

//API testground
/* $(document).ready(function() {
	$.getJSON('https://api.twitter.com/1/users/show.json?screen_name=davidbauer&include_entities=true&callback=?', function(data) {
		var html = "<ul>";	
	    html += data.created_at;
		html += "</ul>"
    	$('.twitterapi').html(html);
	});
});
*/

