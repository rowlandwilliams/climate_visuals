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
            
            ///// PROCESS API DATA /////
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
                date2: new Date(2020, x[1], x[2]),
                century: Math.floor(((Number(x[0]) - 1) / 100) + 1)

            }))
            

            ///// BEGIN DATA FORMATTING ///// 
            var latestData = data.slice(data.length-7);
            var latestYear = latestData[latestData.length - 1].year
            var fullData = {}; // data to send

            

            // filter data from 1500
            var data = data.filter(x => x.year <= latestYear && x.year >= 1520)


            ///// TILES /////
            // average ppm for each year
            var allYears = [... new Set(data.map(x => x.year))]
            var bubbleData = allYears.map(year => ({
                'year': year,
                'avgppm': data.filter(x => x.year == year)
                        .map(x => x.ppm)
                        .reduce((a, b) => a + b, 0) / data.filter(x => x.year == year).length
            }))

            // generate century id for donut
            bubbleData.forEach(year => year.century = Math.floor((year.year-1) / 100) + 1)

            // round avg ppm
            bubbleData.forEach(year => (year.avgppm = Math.round(year.avgppm * 100) / 100))
            fullData['bubble'] = bubbleData;
            //console.log(bubbleData.length)
            
            
            

            ///// LINEGRAPH DATA /////
            // if data is 5 yearly or yearly - need to plot according to svg width
            // if data is weekly or daily, can plot according to y axis date
            // get unique years
            // get last 7 days of data and calculate average
            var allCent = [... new Set(data.map(x => x.century))]//.map(x => 'c' + x)
            //console.log(allCent.map(x => Number(x.substr(1,2))))

            var allYears = [... new Set(data.map(x => x.year))]
            // for each year new dataset

            
            // allYear.map(year => .filter(x => ))
            var months = []
            for (var i=0; i<13; i++) {
                months.push(new Date(2020, i, 0)) // need to add year functionality
            }
            

            // first extract required data from raw and add century (now a flat array)
            var lineData = allYears.map(year => ({
                'century': Math.floor(((year - 1) / 100) + 1),
                'year': year,
                'values': data
                    .filter(x => x.year == year)
                    .map(y => ({
                        'date': y.date2,
                        'ppm': y.ppm,
                        'year': year

                    }))
            }))
            
            // if only yearly data available, add month data to help plotting/voronoi
            lineData.forEach(year => {
                    var length = year.values.length;
                    if (length == 1){
                        var ppm = year.values[0].ppm;
                        year.values = months.map(month => ({
                            'date': month,
                            'ppm': ppm,
                            'year': year.year // add year for voronoi lg
                        }))
                    }
                    
                        
                    })

            // convert flat array to array of arrays nested by century        
            var lineData = allCent.map(cent => 
                   lineData
                        .filter((y) => y.century == cent))

            var final = []
            
            // pull century out of each year object and use it as a grouping variable
            lineData.forEach(arr => {
                var temp = {};
                temp['century'] = arr[0].century
                temp['year_values'] = []
                arr.forEach(obj => {
                    delete obj.century
                    temp['year_values'].push(obj)
                })
                final.push(temp)
            })
                        
            // add to data to send
            fullData['linegraph'] = final
            
        

            // ///// CENTURIES /////
            // // calculate change 
            // // difference between start and end of century
            // var centuries = bubbleData.map(x => x.century)
            // var centuries = [... new Set(centuries)]
            // //var totalChange =      
            
            // var change = centuries.map(cent => 
            //         bubbleData // yearly averages
            //             .filter((x) => x.century == cent))
            //         .map(y => ({
            //             'century': y[0].century,
            //             'change': y[y.length-1].avgppm - y[0].avgppm
            //         }))
                    
            // var changeSum = change.map(x=>x.change).filter(x => x >= 0).reduce((a,b) => a + b, 0) // % of the increase - neg values 0
            
            // //var totalChange = change
            // for (var i=0; i<change.length; i++) {
            //     change[i].change = change[i].change < 0 ? 0 : change[i].change;
            //     change[i].changepc = change[i].change/changeSum * 100
            // }
            
            // aggregate the change from 1500 - 1700
            var test_cent = [{'century': 21, 'changepc': 30}, {'century': 20, 'changepc': 30},
             {'century': 19, 'changepc': 10}, {'century': 18, 'changepc': 10}, {'century': 17, 'changepc': 10},
             {'century': 16, 'changepc': 10}]
            
            

            fullData['centuries'] = test_cent //change.shift(); // remove 16th    
    
            //write to file
            fullData = JSON.stringify(fullData)
            fs.writeFileSync('data.json', fullData);
            
            

        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        //res.send(originalData);
        res.send(final)


    })


   

    

        
})
  



 

app.listen(3000, () => {
     console.log('Example app listening on port 3000!')
  });
  

  
///// TIMELINE GRAPH /////
            // filter data to get only potential years required (prevent filtering each time)
            // var latestDay = data.slice(data.length-1);
            // var year = latestDay[0].year;
            // // define potential years (-2 accounts for across 2 years)
            // var years = [year, year-1, year-2, year-10, year-100, year-1000];
            
            // var data = data.filter(x => years.includes(x.year));
           
            // // define final data
            // var finalData = [];

            // //console.log(latestData)
            // var latestAverage = latestData.map(x => x.ppm).reduce((a, b) => a + b, 0)/latestData.length
            // finalData.push({year: year, ppm: latestAverage, text: 'Current CO2 levels (7-day average)', tooltip: 'Latest'});
            
            
            // // daily data begins on 11/05/2016
            // // weekly data begins on 29/02/1958
            // // yearly data begins 1830
            // // 5 years data before 1830

            // // Get data for 1, 10, 100, and 1000 years ago
            
            // // 1 year ago
            // // generate ymd ids matching data from last year based on latest data
            // var ids = latestData.map((x) => (x.year-1)  + 
            //                 '_' + (x.month) + '_' + x.day)
            
            // // // pull new last year ids out of data and add to latestData
            // var temp = data.filter(x => ids.includes(x.ymd));
            // var lastAverage = temp.map(x => x.ppm).reduce((a, b) => a + b, 0)/temp.length
            // finalData.push({year: temp[0].year, ppm: lastAverage, text: 'This week in ' + temp[0].year, tooltip: 'Last year'});
            
            
            // // 10 years ago
            // // data now weekly so match nearest week based on latest day
            // // find year and month
            // // // filter data based on latestday year-10 then current week
            // var temp = data.filter(x => x.year == (latestDay[0].year - 10))
            //             .filter(x => x.week == latestDay[0].week)
            // finalData.push({year: temp[0].year, ppm: temp[0].ppm, text: 'This week in ' + temp[0].year, tooltip: '10 years ago'})
            
            
            // // // 100 years ago
            // // // data now yearly so simple year match
            // var temp = data.filter(x => x.year == (latestDay[0].year - 100))
            // finalData.push({year: temp[0].year, ppm: temp[0].ppm, text: 'This week in ' + temp[0].year, tooltip: '100 years ago'})
    
            
            // // round 1000 years ago to nearest 5 years (data only every 5 years)
            // function round5(x) {
            //     return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
            // }

            // var year = round5((latestDay[0].year - 1000));
            // var temp = data.filter(x => x.year == (latestDay[0].year - 1000))
            // finalData.push({year: temp[0].year, ppm: temp[0].ppm, text: 'This week in ' + temp[0].year, tooltip: '1000 years ago'});

            // // round ppm
            // finalData.forEach(x => x.ppm = Math.round(x.ppm *100) / 100)

            // // put first data set for horizontal into key
            // fullData['first'] = finalData
            
            // weekly totals
            // var test  = data.filter(x => x.year == 2020).map(x => ({
            //     'week': x.week,
            //     'ppm':x.ppm
            // }))

            // var total = 0
            // test.forEach(week => {total += week.ppm})

            // fullData['second'] = latestData.map((x) => ({
            //     'year': x.year,
            //     'ppm': x.ppm,
            //     'date': x.date
            //     //'week': x.week
            // }))
            