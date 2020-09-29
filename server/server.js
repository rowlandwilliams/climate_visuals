var express = require('express');
var fs = require('fs');
var app = express();
const fetch   = require('node-fetch');
const request = require("request-promise");
const cheerio = require("cheerio");

//var url = "https://www.climatelevels.org/graphs/co2-daily_data.php?callback=1"

app.get('/', function(req, res){
    var url = "https://www.climatelevels.org/graphs/co2-daily_data.php?callback=1"

    request(url, function(error, response, html){

        if(!error){
            
            // load html
            var $ = cheerio.load(html);
            console.log($);

            var data = $('body');
            console.log(data.text())

        }

    })


   

    

        
})
  



 

app.listen(3000, () => {
     console.log('Example app listening on port 3000!')
  });
  

  
