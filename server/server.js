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
            console.log(data)

            // create array of objects
            data = data.map(x => ({
                year: Number(x[0]),
                month: Number(x[1]) + 1,
                day: Number(x[2]),
                ppm: Number(x[3]),
                week: moment(new Date(x[0], x[1], x[2])).week(),
                ymd: x[0] + '_' + x[1] + '_' + x[2],
                ym: x[0] + '_' + x[1],
                md: x[1] + '_' + x[2]
            }))
            
            
            
            // define final data
            var finalData = [];

            // get last five days of data
            var latestData = data.slice(data.length-5)
            // get all years in latest data (accounts for end/start of years)
            var years = latestData.map(x => x.year);
            var years = [...new Set(years)];
            //console.log(latestData)

            finalData.push(latestData);
            
            // daily data begins on 11/05/2016
            // weekly data begins on 29/02/1958
            // yearly data begins 1830
            // 5 years data before 1830

            //create week id for any data beyond 29/02/1958

            // Get data for 1, 10, 100, and 1000 years ago
            
            // 1 year ago
            // generate ids matching data from last year based on latest data
            var ids = latestData.map((x) => (x.year-1)  + 
            '_' + (x.month) + '_' + x.day)
            
            // pull new last year ids out of data and add to latestData
            finalData.push(data.filter(x => ids.includes(x.ymd)));
            //console.log(test)
            //console.log(ids)
            
            // 10 years ago
            // data now weekly so match nearest week based on latest day
            // find year and month
            // get latest day
            var latestDay = data.slice(data.length-1)
            var yearMonth = (latestDay[0].year-10) + '_' + latestDay[0].month
            console.log(yearMonth)

            // in data find week starts for year-month
            var weekStart = data.filter(x => x.ym == yearMonth).map((x)=> x.day)
            console.log(weekStart)
            // given latestDay find equivalent week from 10 years ago by matching to closest number below
            var num = latestDay[0].day;
            console.log(num)
            // subtract each weekStart from num and choose smallest positive difference
            //var test = Math.min(weekStart.map((x) => num-x).filter(x >= 0))
            
            // function getWeek(num, ...arr) {
            //     var temp = Math.min(arr.map(x => num-x).filter(x >= 0));
            //     // take smallest positive difference and get index

            // }
            
            
            //console.log(test)
            
            
            
            // same five years ago
            // same 10 years ago
            // same 100 years ago
            
            //console.log(latestData)
            //console.log(ids)

        }
        res.send(data)

    })


   

    

        
})
  



 

app.listen(3000, () => {
     console.log('Example app listening on port 3000!')
  });
  

  
