var express = require('express');
var fs = require('fs');
var app = express();

const request = require("request-promise");
const cheerio = require("cheerio");
//const { listenerCount } = require("process");
const data = require("./noaa_data");

delete(data['2020'])
//console.log(data)

app.get('/', function(req, res){
    url = "https://www.esrl.noaa.gov/gmd/ccgg/trends/monthly.html";

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);
            //console.log($)
            // Finally, we'll define the variables we're going to capture

            var months = {'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
            'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'}

            var years = new Date().getFullYear();      
            var list = [];
            var suh = {};

            $(".text-center").find('tr').each((index, element) => {
                var obj = {};

                // check data is avaialble for give daya
                var ppm = ($($(element).find("td")[1]).text()).trim()
                console.log(ppm);
                
                obj['Year'] = years;
                obj['Month'] = Number(months[($($(element).find("td")[0]).text()).trim().match(/[A-Za-z]+/)[0]])
                obj['Day'] = Number(($($(element).find("td")[0]).text()).trim().match(/[0-9]+/)[0])
                if (ppm == 'Unavailable') {
                    obj['PPM'] = 'Unavailable'
                } else {
                    obj['PPM'] = Number(ppm.match(/\d+\.\d+/)[0]);

                }
                //obj['PPM'] = Number(($($(element).find("td")[1]).text()).trim().match(/\d+\.\d+/)[0]);
                obj['MD'] = ($($(element).find("td")[0]).text()).trim().match(/[A-Za-z]+/)[0] + Number(($($(element).find("td")[0]).text()).trim().match(/[0-9]+/)[0])
                //obj['MD'] = months[($($(element).find("td")[0]).text()).trim().match(/[A-Za-z]+/)[0]] + (($($(element).find("td")[0]).text()).trim().match(/[0-9]+/)[0]) 

                list.push(obj)});
            
            suh[years] = list;
            //console.log(suh)


            var ids = []

            for (var i=0; i<suh[years].length; i++) {
                ids.push((suh[years][i]['MD']));
            }
            console.log(ids)
            // for (var i = 0; i<ids.length; i++) {
            //     ids[i] = "\"" + ids[i] + "\"";
            // }

            var keys = Object.keys(data);


            for (var i=0; i < keys.length; i++) {
                    var temp = data[keys[i]].filter((x) => ids.includes(x['MD']));
                    data[keys[i]] = temp;
            }

            data[years] = suh[years];

            // send suh variable upon request
            //res.send(suh);
        //console.log(suh)
        }

        //console.log(suh)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data)
    })
  
})
 

app.listen(3000, () => {
     console.log('Example app listening on port 3000!')
  });
  

  
//exports = module.exports = app;



