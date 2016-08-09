var fs = require('fs'),
  Twitter = require('twitter');
  
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

// Array to store ammassed tweets
var allTweets = [];
getTweet();

function getTweet(id){

  var options = { screen_name: 'RealDonaldTrump', count: 200 };

  // If we've sent an ID to page from, use it
  if(id) 
    options.max_id = id;
  
  client.get('statuses/user_timeline', options, function(err, tweets, response){
    if(err) console.log(err);
  
    // If we're past the first request, we'll need to shift off the first element,
    // because it's duplicated from the final item of the previous request
    if(id)
      tweets.shift()
  
    // Add new tweets to ammassed array    
    allTweets = allTweets.concat(tweets);
    console.log(allTweets.length);
    
    // If we've hit the limit, shut it down
    if(allTweets.length > 3200)
      return true;

    // Write to file
    fs.writeFileSync("culmulative.json", JSON.stringify(allTweets));
   
    // Dive back in
    getTweet(tweets[tweets.length - 1].id_str);
  });
}
