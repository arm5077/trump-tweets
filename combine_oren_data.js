var fs = require('fs'), 
  async = require('async')

// Holder array for all the tweets
var trump_tweets = []


fs.readdir("data", function(err, filenames){
  if(err) throw err;

  // Run through each file in series so we don't have too many files open at once for Node
  async.eachSeries(filenames, function(filename, callback){
    console.log(filename);

    // Doublecheck it's a text file
    if( filename.indexOf(".txt") != -1 ){

      // If it is, let's grab the data in utf-8 format
      fs.readFile("data/" + filename, 'utf8', function(err, data){
        if(err) throw err;
       
       // Replace linebreaks with commas to help confirm to JSON standard
        data = data.replace(/\n/g, ',');   
        data = JSON.parse("[" + data.slice(0, -1) + "]");

        // Filter to just Trump
        data = data.filter(function(d){
          return d.user.id == 25073877
        });
        
        // Add to existing store
        trump_tweets = trump_tweets.concat(data);
        console.log(trump_tweets.length)

        // Hit the next file
        callback();
      });
    }
    else {
      // This isn't a text file, so hit the next file
      callback();
    }
  }, function(){
    // Write the combined array to a JSON file
    fs.writeFileSync("trump_tweets.json", JSON.stringify(trump_tweets));
    console.log("all done!");
  });

});

