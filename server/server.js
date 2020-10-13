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
                date: new Date(x[0], x[1], x[2]),
                date2: new Date(2020, x[1], x[2])

            }))
            
            var originalData = data;

            // filter data to get only potential years required (prevent filtering each time)
            var latestDay = data.slice(data.length-1);
            var year = latestDay[0].year;
            // define potential years (-2 accounts for across 2 years)
            var years = [year, year-1, year-2, year-10, year-100, year-1000];
            
            var data = data.filter(x => years.includes(x.year));
           
            // define final data
            var finalData = [];
            var fullData = {};

            // get last 7 days of data and calculate average
            var latestData = data.slice(data.length-7);
            console.log(latestData)
            var latestAverage = latestData.map(x => x.ppm).reduce((a, b) => a + b, 0)/latestData.length
            finalData.push({year: year, ppm: latestAverage, text: 'Current CO2 levels (7-day average)', tooltip: 'Latest'});
            
            
            // daily data begins on 11/05/2016
            // weekly data begins on 29/02/1958
            // yearly data begins 1830
            // 5 years data before 1830

            // Get data for 1, 10, 100, and 1000 years ago
            
            // 1 year ago
            // generate ymd ids matching data from last year based on latest data
            var ids = latestData.map((x) => (x.year-1)  + 
                            '_' + (x.month) + '_' + x.day)
            
            // // pull new last year ids out of data and add to latestData
            var temp = data.filter(x => ids.includes(x.ymd));
            var lastAverage = temp.map(x => x.ppm).reduce((a, b) => a + b, 0)/temp.length
            finalData.push({year: temp[0].year, ppm: lastAverage, text: 'This week in ' + temp[0].year, tooltip: 'Last year'});
            
            
            // // update date 2 for last year
            // finalData[1].forEach(x => x.date2 = new Date((x.year + 1), x.month, x.day))
            // // extract needed keys
            // finalData = finalData.map((array) => array.map((x) => ({
            //     date: x.date2,
            //     year: x.year,
            //     ppm: x.ppm

            // })))
            // finalData = finalData.flat()
            

            

           
            
            // 10 years ago
            // data now weekly so match nearest week based on latest day
            // find year and month
            // // filter data based on latestday year-10 then current week
            var temp = data.filter(x => x.year == (latestDay[0].year - 10))
                        .filter(x => x.week == latestDay[0].week)
            finalData.push({year: temp[0].year, ppm: temp[0].ppm, text: 'This week in ' + temp[0].year, tooltip: '10 years ago'})
            
            
            // // 100 years ago
            // // data now yearly so simple year match
            var temp = data.filter(x => x.year == (latestDay[0].year - 100))
            finalData.push({year: temp[0].year, ppm: temp[0].ppm, text: 'This week in ' + temp[0].year, tooltip: '100 years ago'})
    
            
            // round 1000 years ago to nearest 5 years (data only every 5 years)
            function round5(x) {
                return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
            }

            var year = round5((latestDay[0].year - 1000));
            var temp = data.filter(x => x.year == (latestDay[0].year - 1000))
            finalData.push({year: temp[0].year, ppm: temp[0].ppm, text: 'This week in ' + temp[0].year, tooltip: '1000 years ago'});

            // round ppm
            finalData.forEach(x => x.ppm = Math.round(x.ppm *100) / 100)

            // put first data set for horizontal into key
            fullData['first'] = finalData
            
            // weekly totals
            var test  = data.filter(x => x.year == 2020).map(x => ({
                'week': x.week,
                'ppm':x.ppm
            }))

            var total = 0
            //console.log(test.forEach((week) => total += week.ppm ))
            //console.log(test)


            test.forEach(week => {total += week.ppm})

            //console.log(total)
            
            
            fullData['second'] = latestData.map((x) => ({
                'year': x.year,
                'ppm': x.ppm,
                'date': x.date
                //'week': x.week
            }))
            

            // begin data extraction for plot 2
            // if data is 5 yearly or yearly - need to plot according to svg width
            // if data is weekly or daily, can plot according to y axis date
            // get unique years
            var allYears = [... new Set(originalData.map(x => x.year))]
            // for each year new dataset

            var lineData = allYears.map((x) => ({
                'year': x,
                'values': originalData
                            .filter((y) => y.year == x)
                            .map(z => ({
                                'date': z.date2,
                                'ppm': z.ppm
                            }))
            }))

            // split up into 5 yearly/yearly (horizontal line) and then weekly/daily
            // add months for single data
            var months = []
            for (var i=0; i<13; i++) {
                months.push(new Date(2020, i, 0)) // need to add year functionality
            }
            
            lineData.forEach(year => {
                var length = year.values.length;
                if (length > 1){
                    year.class = 'multi'
                }
                else {
                    year.class = 'single';
                    var ppm = year.values[0].ppm;
                    year.values = months.map(month => ({
                        'date': month,
                        'ppm': ppm
                    }))
                    
                }
            })

            

            fullData['third'] = lineData
            

            // write to file
            fullData = JSON.stringify(fullData)
            fs.writeFileSync('data.json', fullData);

            
            
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(fullData)


    })


   

    

        
})
  



 

app.listen(3000, () => {
     console.log('Example app listening on port 3000!')
  });
  

  
