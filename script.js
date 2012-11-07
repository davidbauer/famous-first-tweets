// Setup an event listener for the form that will execute findTweet()
// when the form is submitted.
$(function() {
	$('#searchform').submit(function(e) {
		// Stop the form from sending and reloading the page
		e.preventDefault();

		// Find the tweet!
		var myUser = findUser();
		checkUser(myUser);
		getFirstTweet(myUser);
	});
});

// store username given via input
function findUser() {
    var myUser;

    // Get the username value from the form and cleanup the @ if needed
    if (document.tweetfinder.user.value[0] == "@") {
			myUser = document.tweetfinder.user.value.substring(1,20); //get rid of the @
    }
    else { myUser = document.tweetfinder.user.value };

    // Validate length of username
    if (myUser.length > 16) {
	    $('#theusername').html("This doesn't seem to be a username. Too long."); // apply length limit
    }
    else {
    	$('#theusername').html("You entered username: " + myUser + "."); //test
    	return myUser;
    }
}

// call info about username via twitter api
function checkUser(myUser) {
	$.getJSON('https://api.twitter.com/1/users/show.json?screen_name=' + myUser + '&include_entities=true&callback=?', function(data) {
		var html = "";

		if (false) { 
			html += "Twitter doesn't know such a username. Try another one.";
		} // add condition for Twitter returns error
		else {
			var created = data.created_at;
			var name = data.name;
			var username = data.screen_name;
			var followersNumber = data.followers_count;
			var tweetsNumber = data.statuses_count;	
			html += name + " (@" + username + ") joined Twitter on " + created + ". S(he) currently has <i>" + followersNumber + " followers</i> and has published a total number of <i>" + tweetsNumber + " tweets</i>."; // test

			$('.twitterapi').html(html); // test

	  	checkTweetsNumber(tweetsNumber); // check if tweetsNumber > 3200
		}
	});
}

//TODO check if user has more than 3200 tweets which makes first one inaccessible
function checkTweetsNumber(tweetsNumber) {
	if (tweetsNumber > 3200) {
		html += "Bummer. @" + username + " has published more than 3200 fweets. This means, Twitter can't find the first tweet.";
	}
}


//TODO get ID of first tweet
function getFirstTweet(myUser) {
	$.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=' + myUser + '&since_id=1&count=200&callback=?', function(tweetdata) {
		var pos = tweetdata.length - 1;
		var tweetId = tweetdata[pos].id_str;
		var tweetText = tweetdata[pos].text;

		html = "Checked Twitter API: Tweet with ID " + tweetId + " says: " + tweetText; // test

    $('#thetweet').html(html); // test
	});
}


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