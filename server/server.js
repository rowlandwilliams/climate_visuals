var express = require('express');
var fs = require('fs');
var app = express();
const fetch   = require('node-fetch');
const request = require("request-promise");
const cheerio = require("cheerio");
const moment = require('moment');



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
                week: moment(new Date(x[0], x[1], x[2])).week(),
                ymd: x[0] + '_' + x[1] + '_' + x[2],
                date: new Date(x[0], x[1], x[2])
            }))
            
            // filter data to get only potential years required (prevent filtering each time)
            var latestDay = data.slice(data.length-1);
            var year = latestDay[0].year;
            // define potential years (-2 accounts for across 2 years)
            var years = [year, year-1, year-2, year-10, year-100, year-1000];
            
            var data = data.filter(x => years.includes(x.year));
           

            // define final data
            var finalData = [];

            // get last 7 days of data
            var latestData = data.slice(data.length-7)
            finalData.push(latestData);
            
            // daily data begins on 11/05/2016
            // weekly data begins on 29/02/1958
            // yearly data begins 1830
            // 5 years data before 1830

            // Get data for 1, 10, 100, and 1000 years ago
            
            // 1 year ago
            // generate ymd ids matching data from last year based on latest data
            var ids = latestData.map((x) => (x.year-1)  + 
                            '_' + (x.month) + '_' + x.day)
            
            // pull new last year ids out of data and add to latestData
            var temp = data.filter(x => ids.includes(x.ymd));
            finalData.push(temp);
            
            // 10 years ago
            // data now weekly so match nearest week based on latest day
            // find year and month
            // filter data based on latestday year-10 then current week
            finalData.push(data.filter(x => x.year == (latestDay[0].year - 10))
                    .filter(x => x.week == latestDay[0].week))
            
            
            // 100 years ago
            // data now yearly so simple year match
            finalData.push(data.filter(x => x.year == (latestDay[0].year - 100)))            
            
            // round 1000 years ago to nearest 5 years (data only every 5 years)
            function round5(x) {
                return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
            }

            var year = round5((latestDay[0].year - 1000));
            finalData.push(data.filter(x => x.year == (latestDay[0].year - 1000)));

            // calculate difference between today and day x
            var latestPPM = latestDay[0].ppm;
            console.log(latestPPM)
            finalData.map((array) => array.map((x) => x.diff = Math.round((latestPPM - x.ppm) * 100) / 100));
            

        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(finalData)

    })


   

    

        
})
  



 

app.listen(3000, () => {
     console.log('Example app listening on port 3000!')
  });
  

  
