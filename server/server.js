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
    
            var data = $('body');
            var data = data.text();
            data = data.replace(/\n/g, '')
            data = data.replace(/,\]/g, '');
            data = data.replace(/(Date\.UTC\()/g, '');
            data = data.replace(/\)/g, '');
            data = data.substring(3, data.length-2) + ']'
            data = JSON.parse(data)
            
            // create array of objects
            data = data.map(x => ({
                year: Number(x[0]),
                month: Number(x[1]),
                day: Number(x[2]),
                ppm: Number(x[3]),
                ymd: x[0] + '_' + x[1] + '_' + x[2],
                md: x[1] + '_' + x[2]
            }))
            
            // get last five days of data
            var latestData = data.slice(data.length-5)
            var years = latestData.map(x => x.year);
            var years = [...new Set(years)];
            
            // generate ids for each row of latest data for last year
            //var test = latestData.map(x => x.)


            var ids = latestData.map((x) => (x.year-1)  + 
            '_' + (x.month) + '_' + x. day)
            
            console.log(ids)
            
            //var lastYear = latestData[4].year - 1
            //var test = data.filter(x => years.includes(x.year))
                           
            
            
            //latestData.push(data.filter(x = > ))
            
            
            
            // same week a year ago
            
            // same five years ago
            // same 10 years ago
            // same 100 years ago
            
            console.log(latestData)
            console.log(ids)

        }
        res.send(data)

    })


   

    

        
})
  



 

app.listen(3000, () => {
     console.log('Example app listening on port 3000!')
  });
  

  
