var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var key = require("./key.js")
var fs = require("fs");
var option = process.argv.slice(2);
LIRI(option);

function LIRI(operator)
{
	switch (operator[0]){
		case "my-tweets":{
			showTweets();
			break;
		}
		case "spotify-this-song":{
			var song= getTitle(operator.slice(1),"Purexed")
			songPrint(song);
			break;
		}
		case "movie-this":{
			var movie= getTitle(operator.slice(1),"Princess Bride")
			moviePrint(movie);
			break;
		}
		case "do-what-it-says":{
			tasks();
			break;
		}
	}
}

function getTitle (titleArray,generic){
	var title="";
	if (titleArray[0]!=undefined)
	{
		for (var i = 0; i < titleArray.length; i++) {
			title+=titleArray[i]+" ";
		}
	}
	else
	{
		title=generic
	}
	console.log(title);
	return title;
}

function showTweets(){
	var client= new twitter({
		consumer_key: key.consumer_key,
  		consumer_secret: key.consumer_secret,
  		access_token_key:  key.access_token_key,
  		access_token_secret: key.access_token_secret
	})
	var url="https://api.twitter.com/1.1/statuses/home_timeline.json"
	client.get(url, {count:21},function(error, tweets, response) {
	  if(error) throw error;
	  for (var i = 0; i < 20; i++) {
	  	console.log(tweets[i].user.name + " tweeted: " + tweets[i].text);
	  }
	  console.log("");
	});
}

function songPrint(songTitle) {
	var client = new spotify({	
		  id: "17356ebd079e4014b04ff9920b2591b3",
		  secret: "730422273fe54d239bbe9f470f2342a7"
	});
	client.search({ type: 'track', query: songTitle }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }	 
	console.log("Song Artist:          " + data.tracks.items[0].artists[0].name);
	console.log("Song Title:           " + data.tracks.items[0].name); 
	console.log("You can find it hear: " + data.tracks.items[0].external_urls.spotify);
	console.log("Album Title:          " + data.tracks.items[0].album.name);
	console.log("");
});
}

function moviePrint(movieTitle) {
	request("http://www.omdbapi.com/?apikey=40e9cece&t="+encodeURI(movieTitle),function(error, response, body) {
	if (!error && response.statusCode === 200) {
	  	var movieInfo=JSON.parse(body);
	    console.log("Title:                     "+ movieInfo.Title);
	    console.log("Release Year:              "+movieInfo.Year);
	    console.log("IMDB RAting:               "+movieInfo.Ratings[0].Value);
	    console.log("Rotten Tomatos Rating:     "+movieInfo.Ratings[1].Value);
	    console.log("Country of Origin:         "+movieInfo.Country);
	    console.log("Original Language:         "+movieInfo.Language);
	    console.log("Lead Actors and Actresses: "+movieInfo.Actors);
	    console.log("Plot Summary:              "+movieInfo.Plot);
	    console.log("");
		}
	});	
}
function tasks(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
  			return console.log(error);
  		}
  		var tasks= data.split("\n");
  		tasks.forEach(function(task, index){
  			tasks[index]=task.split(" ");
  			LIRI(tasks[index]);
  		});
	});
}