var EventEmitter = require("events").EventEmitter;
var https = require("https");
var util = require("util");

/**
 * An EventEmitter to get lorem ipsums
 * @param username
 * @constructor
 */
function Ipsum(paragraphs, sentences) {

    EventEmitter.call(this);

    var ipsumEmitter = this;

    let url = '';
    if (paragraphs) {
      url = `https://baconipsum.com/api/?type=meat-and-filler&paras=${paragraphs}`
    } else if (sentences) {
     url = `https://baconipsum.com/api/?type=meat-and-filler&sentences=${sentences}` 
    }

    var request = https.get(url, function(response) {
        var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            //Status Code Error
            profileEmitter.emit("error", new Error("An error occured while getting"));
        }

        //Read the data
        response.on('data', function (chunk) {
            body += chunk;
            ipsumEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    //Parse the data
                    var loremIpsum = JSON.parse(body);
                    ipsumEmitter.emit("end", loremIpsum);
                } catch (error) {
                  ipsumEmitter.emit("error", error);
                }
            }
        }).on("error", function(error){
          ipsumEmitter.emit("error", error);
        });
    });
}

util.inherits( Ipsum, EventEmitter );

module.exports = Ipsum;