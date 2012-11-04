// from click to result
function findTweet() { 
	findUser();
	checkUser();
	checkTweetsNumber();
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
		var html = "";
		if (false) {html += "Twitter doesn't know such a username. Try another one.";} // add condition for Twitter returns error
		else {
			var created = data.created_at;
			var name = data.name;
			var username = data.screen_name;
			var followersNumber = data.followers_count;
			var tweetsNumber = data.statuses_count;	
			html += name + " (@" + username + ") joined Twitter on " + created + ". S(he) currently has <i>" + followersNumber + " followers</i> and has published a total number of <i>" + tweetsNumber + " tweets</i>."; // test
		}
    	$('.twitterapi').html(html); // test
    	return tweetsNumber; // need that for later to check if tweetsNumber > 3200
    	return html;
    	
	});
});
}

//TODO check if user has more than 3200 tweets which makes first one inaccessible
function checkTweetsNumber(tweetsNumber) {
	if (tweetsNumber > 3200) {
		html += "Bummer. @" + username + " has published more than 3200 fweets. This means, Twitter can't find the first tweet.";
	}
	$('.twitterapi').html(html);
}


//TODO get ID of first tweet
$(document).ready(function() {
	$.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=davidbauer&since_id=1&count=1&callback=?', function(tweetdata) {
		var tweetId = tweetdata[0].id_str;
		var tweetText = tweetdata[0].text;
		html += "Checked Twitter API: Tweet with ID " + tweetId + " says: " + tweetText; // test
    	$('.twitterapi').html(html); // test
	});
});


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