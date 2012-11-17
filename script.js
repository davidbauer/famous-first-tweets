// Setup an event listener for the form that will execute findTweet()
// when the form is submitted.
$(function() {
	$('#searchform').submit(function(e) {
		// Stop the form from sending and reloading the page
		e.preventDefault();

		// Find the tweet!
		var myUser = findUser();
		checkUser(myUser);
	});
});

$(function() {
	$('.linkinput').click (function(e) {
		e.preventDefault();
		
		// Get the user from the link
		var myUser = $(this).attr('data-user');
		checkUser(myUser);
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
		if (myUser.length > 16) { // TODO: if true, return error msg and don't continue
			$('#error').html("This doesn't seem to be a username. Too long.");
		}
		else {
			return myUser;
		}
}

// call info about username via twitter api
function checkUser(myUser) {
	$.getJSON('https://api.twitter.com/1/users/show.json?screen_name=' + myUser + '&include_entities=true&callback=?', function(data) {
		var html = "";

		if (false) { // TODO: add condition for if Twitter returns error, if true return error msg and don't continue
			html += "Twitter doesn't know such a username. Try another one.";
		} 
		else {
			var created = new Date(data.created_at);
			var name = data.name;
			var username = data.screen_name;
			var followersNumber = data.followers_count;
			var tweetsNumber = data.statuses_count;	

			html += name + " (@" + username + ") joined Twitter on " + created.toDateString() + ". " + name.split(' ')[0] + " currently has <i>" + followersNumber + " followers</i> and has published a total number of <i>" + tweetsNumber + " tweets</i>."; // test

			// Check if user has more than 3200 tweets which makes first one 
			// inaccessible (only true via search_timeline)
			if (tweetsNumber > 3200) {
				html += "<p>Bummer. @" + username + " has published more than 3200 tweets. This means, Twitter can't find the first tweet :(</p>";
			} else {
				getFirstTweet(myUser, data.status.id);
			}

			$('.userinfo').html(html); // test
		}
	});
}

// Declare a variable to hold the max ID.
var currentMaxId;
var loopCount = 0;

//TODO get ID of first tweet <- currently only goes back 200 tweets
function getFirstTweet(myUser, maxID) {
	// Check that we are not going to hit the twitter rate limit.
	loopCount += 1;
	if (loopCount == 147) {
		// We hit the limit. Show a message and load the oldest tweet we retrieved.
		$('#error').html('We can\'t go right back to the beginning. But here is a pretty old one');

		if (currentMaxId != undefined) {
			generateEmbed(currentMaxId);
		}

		return;
	}

	$.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=false&screen_name=' + myUser + '&since_id=1&max_id=' + maxID + '&count=200&callback=?', function(tweetdata) {
		// If the length is 0 we have gone back as far as possible.
		// Generate the embedded tweet using the currentMaxId.
		if (tweetdata.length == 1) {
			generateEmbed(currentMaxId);
		} else {
			// There may be more tweets so lets keep looping.
			// Save the oldest tweet in this batch by updating the currentMaxId variable
			// with it's ID.
			var pos = tweetdata.length - 1;
			currentMaxId = tweetdata[pos].id_str;

			console.log("Going Again: " + currentMaxId);
			getFirstTweet(myUser, currentMaxId);
		}
	});
}


//create oEmbed of first tweet via ID
function generateEmbed(tweetId) {
	$.getJSON('https://api.twitter.com/1/statuses/oembed.json?id=' + tweetId + '&callback=?', function(embed) {
		html = embed.html;

		$('#thetweetembed').html(html);
	});
}