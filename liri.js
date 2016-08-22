var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var twitterKeys = require('./keys.js').twitterKeys;
var command = process.argv[2];

switch(command)
{
    case 'my-tweets':
    {
        myTweets();
    }
        break;
    case 'spotify-this-song':
    {
        var song = process.argv[3];
        spotifyThisSong(song);
    }
        break;
    case 'movie-this':
    {
        var movie = process.argv[3];
        movieThis(movie);
    }
        break;
    case 'do-what-it-says':
    {
        randomCommand()
    }
        break;
}

function myTweets()
{
    var client = new Twitter(
    {
        consumer_key: twitterKeys.consumer_key,
        consumer_secret: twitterKeys.consumer_secret,
        access_token_key: twitterKeys.access_token_key,
        access_token_secret: twitterKeys.access_token_secret
    });

    var params = {screen_name: 'jorgescode'};
    client.get('statuses/user_timeline', params, function(error, tweets, response)
    {
        if (!error)
        {
            var end = tweets.length > 20 ? 20 : tweets.length;
            for(var i = 0; i < end; i++)
            {
                var tweet = tweets[i];
                console.log(tweet.created_at + ': ' + tweet.text);
            }
        }
    });
}

function spotifyThisSong(song)
{
    spotify.search({ type: 'track', query: song}, function(err, data)
    {
        if(err)
        {
            console.log('Error occurred: ' + err);
            return;
        }

        if(data.tracks.items.length == 0)
        {
            spotify.search({ type: 'track', query: 'Never Gonna Give You Up'}, function(err2, data2)
            {
                printSongData(data2);
            });

            return;
        }

        printSongData(data);
    });
}

function printSongData(songObject)
{
    var songData = songObject.tracks.items[0];
    var artist = songData.artists[0].name;
    var songName = songData.name;
    var previewLink = songData.preview_url;
    var album = songData.album.name;
    console.log('Arist: ' + artist);
    console.log('Song Name: ' + songName);
    console.log('Preview Link: ' + previewLink);
    console.log('Album: ' + album);
}

function movieThis(movie)
{
    var requestUrl = 'http://www.omdbapi.com/?t=%MOVIE%&tomatoes=true';
    request(requestUrl.replace('%MOVIE%', movie), function(error, response, body)
    {
        if(!error && response.statusCode == 200)
        {
            if(JSON.parse(body).Response === 'True')
                printMovieData(body);
            else
            {
                request(requestUrl.replace('%MOVIE%', 'The Princess Bride'), function(error, response, body)
                {
                    if(!error && response.statusCode == 200)
                    {
                        printMovieData(body);
                    }
                });
            }
        }
    });
}

function printMovieData(omdbMovieBodyObject)
{
    var data = JSON.parse(omdbMovieBodyObject);
    var title = data.Title;
    var year = data.Year;
    var imdbRating = data.imdbRating;
    var country = data.Country;
    var language = data.Language;
    var plot = data.Plot;
    var actors = data.Actors;
    var rottenTomatoesRating = data.tomatoRating;
    var rottenTomatoesUrl = data.tomatoURL;

    console.log('Title: ' + title);
    console.log('Year: ' + year);
    console.log('IMDB Rating: ' + imdbRating);
    console.log('Country: ' + country);
    console.log('Language: ' + language);
    console.log('Plot: ' + plot);
    console.log('Actors: ' + actors);
    console.log('Rotten Tomatoes Rating: ' + rottenTomatoesRating);
    console.log('Rotten Tomatoes URL: ' + rottenTomatoesUrl);
}

function randomCommand()
{
    fs.readFile('random.txt', 'utf8', function(err, data)
    {
        var dataArr = data.split(',');

        switch(dataArr[0])
        {
            case 'my-tweets':
            {
                myTweets();
            }
                break;
            case 'spotify-this-song':
            {
                spotifyThisSong(dataArr[1]);
            }
                break;
            case 'movie-this':
            {
                movieThis(dataArr[1]);
            }
                break;
        }
    });

   
}

function log(command)
{
    fs.appendFile('random.txt', '\r\n'+command, function(err)
    {
        if(err)
            console.error(err);
        console.log("log.txt was updated");
    });
}