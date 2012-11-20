// Setup an event listener for the form that will execute findTweet()
// when the form is submitted.
$(function() {
	
	var hash = window.location.hash,
	    field = document.tweetfinder.user;

	if (hash) {
		hash = hash.substring(1);

		// Fill field
		field.value = hash;

		// Do the magic
		checkUser(hash);
	}
	
	
	$('#searchform').submit(function(e) {
		// Stop the form from sending and reloading the page
		e.preventDefault();
		$('#error').html("");
		$('#thetweetembed').html("");
		$('.userinfo').html("");

		// Find the tweet!
		var myUser = findUser();
		if (myUser == "usernameistoolong") {}
		else {checkUser(myUser);}
		// Update URL
		window.location.hash = myUser;
	});
});

$(function() {
	$('.linkinput').click (function(e) {
		e.preventDefault();
		$('#error').html("");
		$('#thetweetembed').html("");
		$('.userinfo').html("");
		
		// Get the user from the link
		var myUser = $(this).attr('data-user');
		checkUser(myUser);
		// Update URL
		window.location.hash = myUser;
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
			return "usernameistoolong";
		}
		else {
			return myUser;
		}
}

// call info about username via twitter api
function checkUser(myUser) {
		$.ajax({
			url: 'https://api.twitter.com/1/users/show.json', 
			data: {
				screen_name: myUser,
				include_entities: true,
				suppress_response_codes: true
				},
			dataType: 'jsonp',
			success: function(data) {
        var html = "";

        if (data.error) {
            $('#error').html("Twitter doesn't know this username. Try another one.");
        }
		else {
			var created = new Date(data.created_at);
			var name = data.name;
			var username = data.screen_name;
			var followersNumber = data.followers_count;
			var tweetsNumber = data.statuses_count;	

			html += name + " (@" + username + ") joined Twitter on " + created.toDateString() + ". " + name.split(' ')[0] + " currently has <i>" + followersNumber + " followers</i> and has published a total number of <i>" + tweetsNumber + " tweets</i>."; // test

			// Check if user has more than 3200 tweets which makes first one 
			// inaccessible (restrictions of search_timeline)
			if (tweetsNumber > 3200) {
				$('#error').html("<p>Bummer. @" + username + " has published more than 3200 tweets. This means, Twitter can't find the first tweet :(</p>Note to devs: If you know of a way to dig up tweets older than that (we are hitting the limit of search_timeline), please help us out with a <a href='https://github.com/davidbauer/famous-first-tweets/'>pull request on Github</a>.</p>");
			} else {
				getFirstTweet(myUser, data.status.id);
				
			}
			
			$('.userinfo').html(html);
			
		}
	}
	});
}

// Declare a variable to hold the max ID.
var currentMaxId;
var loopCount = 0;

//get ID of first tweet
function getFirstTweet(myUser, maxID) {
	$('#thetweetembed').html("Looking for the tweet...");
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