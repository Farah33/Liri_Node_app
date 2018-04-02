// Load the fs package to read and write as well as NPM files
require("dotenv").config();
var fs = require("fs");
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

//pull in keys from environmental variables file (other user's will have to create their own unqiue .env file w/ their own key info for features to work)
var key = require('./keys');

var spotifyKey = new Spotify(key.spotify);
var twitterKey = new Twitter(key.twitter);

// Twitter callback function to show max Tweets
var tweetLimit = 20;


// create a variable for a user input 
//process.argv the value of the user input that hall input will be in the
var liriInput = process.argv[2];

//describe various commands available to user when they run NodeJS (via terminal);
// console will listen in order to run one of these cases based on user's input
switch (liriInput) {
    case "my-tweets":
        console.log('my tweets');
        myTweets();
        break;

    case 'spotify-this-song':
        console.log('spotify my song');
        spotifyRequest();
        break;

    case 'movie-this':
        console.log('OMDB my movie');
        omdbRequest();
        break;

    case 'do-what-i-say':
        console.log('obey my command');
        break;

    default:
        console.log("sory that is not my tweets" +
            '\r\n' + '1) "my-tweets" + read the lates news and updates' +
            '\r\n' + '2) "spotify-this-song" + a song name or lyric' +
            '\r\n' + '3) "movie-this" + a movie title' +
            '\r\n' + '4) "do-what-i-say"');
}



//callback function for Twitter API. show last 20 tweets. 
function myTweets() {
    var tweetsJay = { screen_name: "khadijagani", count: tweetLimit };
    twitterKey.get('statuses/user_timeline', tweetsJay, function(error, tweets, response) { //?twitterKey
        if (error) {
            console.log(error);
            //if error not true
        } else if (!error) {
            console.log("\nThese are your last " + (tweets.length) + " tweets: \n");
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweets " + (i + 1) + ": " + "\n" + tweets[i].text +
                    "\n" + "Created on: " + tweets[i].created_at);
                console.log("\n--------------------\n");
            }
        }
    });
}



// Spotify API
function spotifyRequest() {
    var songRequest = process.argv[3];

    spotifyKey.search({
            type: 'track',
            query: songRequest,
            limit: 15,
        },

        function(err, data) {
            if (err) {
                return console.log('error: ' + err);
            }

            console.log(JSON.stringify(data));
            console.log(data.tracks.items[0].artists);
            for (var i = 0; i < 5; i++) {
                var songData = data.tracks.items;
                var songUrl = songData[i].preview_url;
                var artistName = songData[i].album.artists[0].name;
                var albumTitle = songData[i].album.name;
                var songUrl = " ";

                if (songUrl === null) {
                    songUrl = 'no preview found :-(';
                } else {
                    console.log('\n--------------------------\n');
                    console.log(`Artist Name: ${artistName}`);
                    console.log(`Album Title: ${albumTitle}`);


                    //have to assign preview before loggin it
                    songUrl = songData[i].preview_url;

                    console.log(`Preview URL: ${songUrl}`);


                }
            }

        });


}

// OMDB API
function omdbRequest() {
    var omdbRequest = require("request");
    var movieTitle = process.argv[3];
    var omdbApiKey = 'trilogy';
    var fullRequest = `http://www.omdbapi.com/?i=tt3896198&apikey=1cca94d7`;



    omdbRequest(fullRequest, function(error, response, body) {

        // If the request is successful set equals 200
        if (!error && response.statusCode === 200) {

            console.log("Title: " + JSON.parse(body).Title +
                "\n " + "Genre(s): " + JSON.parse(body).Genre +
                "\n " + "Year Released: " + JSON.parse(body).Released +
                "\n " + "Maturity Rating: " + JSON.parse(body).Rated +
                "\n " + "Original Language: " + JSON.parse(body).Language +
                "\n " + "Actors: " + JSON.parse(body).Actors +
                "\n " + "Plot Summary: " + JSON.parse(body).Plot
            );
            //long way of doing console log
            // console.log("Title " + JSON.parse(body).Title);
            // console.log("Duration " + JSON.parse(body).RunTime);
            // console.log("Genre " + JSON.parse(body).Genre);
            // console.log("Production Year " + JSON.parse(body).Released);
            // console.log("General Rating " + JSON.parse(body).Rated);
            // console.log("Languages used " + JSON.parse(body).Language);
            // console.log("Actors of this Movie " + JSON.parse(body).Actors);
            // console.log("Summary of the Movie " + JSON.parse(body).Plot);
        }

    });
}