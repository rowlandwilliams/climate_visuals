





var link = './data.json'
//var link = 'http://localhost:3000/'



fetch(link)
    .then(response => response.json())
    .then(data => {

        // subset average data
        var data1 = data['first']
        
        // define years present in data 
        var years = data1.map(x => x.year)
        var years = [...new Set(years)] 


        // define dimensions
        const width = 500;
        const height = 7000;
        const margin = 5;
        const padding = 10;
        const adj = 30;

        // append svg
        const svg = d3.select(".timelineContainer").append("svg")
            .attr("preserveAspectRatio", "xMidYMid")
            .attr("viewBox", "-"
                + adj + " -"
                + adj + " "
                + (width + adj *3) + " "
                + (height + adj*3))
            .style("padding", padding)
            .style("margin", margin)
            .classed("svg-content", true);

        
        var tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            //.style('position', 'absolute')

        // define base axis 
        const y = d3.scaleLinear().rangeRound([height, 0]);
        
        // define minimum for axis
        var ppm = data1.map((x) => x.ppm);
        var min = Math.floor(d3.min(ppm))
        
        if (min%2 !=0) { //if odd get first even number below
            min = min -1
        }
        
        function sortTicks([...ticks], [...data]) {
            var temp = [];
            for (var i = ticks[0]; i <= ticks[ticks.length-1]; i+=2) {
                temp.push(i) // starting at lowest tick value add each second value in range
            }
            if (temp[0] > data[data.length-1].ppm) { // check if lowest tick is above lowest ppm value (due to rounding)
                temp.unshift(temp[0]-2) // add tick below if needed
            }
            temp.push(data[0].ppm); // add highest value for custom highest tick
            return temp;
            }
        
        
        
        
        // define function for initial axes
        function initialState() {
            // initial axis domain
            y.domain([min, (d3.max(ppm))]);

            //ticks = y.ticks()
            var ticks = sortTicks(y.ticks(), data1);
            var yAxis = d3.axisLeft(y).tickValues(ticks)

            svg.append('g')
            .attr('class', 'line')
            .attr('id', 'yaxis')
            .call(yAxis)
        }   

        // define initial state
        initialState();
        

        // append lines and text
        // inital render function

        function initialRender(d) {
            //var changed = false;
            for (var i=0; i<d.length; i++) {
                var line = svg.append("g")
                line.append('line')
                        .attr('class', 'line')
                        //.attr('id', d[i].year)
                        .attr("x1", 0)
                        .attr("x2", width)
                        .attr("y1", y(d[i].ppm))
                        .attr("y2", y(d[i].ppm))
                        .attr("stroke-width", 1.5)
                        .attr("stroke", "black")
                        
    
                // line2 = svg.append('g')
                line.append('line')
                        //.attr('class', 'line2')
                        .attr('id', d[i].year)
                        .attr("x1", 0)
                        .attr("x2", width)
                        .attr("y1", y(d[i].ppm))
                        .attr("y2", y(d[i].ppm))
                        .attr("stroke-width", 100)
                        .attr("stroke", "transparent")
                        .on('mouseover', mouseover)
                        .on('mouseout', mouseout)
                        .on('click', plotNew)
                        
    
                line.append('text')
                        .attr('class', 'ppm-text')
                        .attr('text-anchor', 'middle')
                        .attr('x', width/2)
                        .attr('y', y(d[i].ppm +0.18))
                        .text(d[i].ppm + ' PPM')
                        
    
                line.append('text')
                        .attr('class', 'comment-text')
                        .attr('text-anchor', 'middle')
                        .attr('x', width/2)
                        .attr('y', y(d[i].ppm -0.3))
                        .text(d[i].text)  
            }
        }
        
        initialRender(data1)
        
       
        function mouseover(d) {
            var me = this.previousElementSibling // grab thinner line
            var ppmText = this.nextElementSibling; // get text
            var commentText = ppmText.nextElementSibling;
            

            d3.selectAll('.line')
            .classed('line--hover', function() {
                return (this === me);
            }).classed("line--fade", function() {
                return (this !== me);
            })  

            d3.selectAll('.ppm-text')
                .classed('text--hover', function() {
                    return (this === ppmText);
                })
                .classed('text--fade', function() {
                    return (this !== ppmText);
                })

            d3.selectAll('.comment-text').classed('text--hover', function() {
                return (this === commentText);
            }).classed('text--fade', function() {
                return (this !== commentText);
            })

            // get position of thin line element
            var pos = me.getBoundingClientRect();
            var id = d3.select(this).attr('id') // match tooltip comment to year id
            

            tooltip
                 .transition()
                 .duration(500)
                 .style('opacity', 1)
            tooltip
                .html(data1.filter((x) => x.year == id)[0].tooltip)
                .style('left', pos.x + pos.width + 5 + 'px')
                .style('top', window.pageYOffset + pos.y + 6.5 + 'px'); // position relative to thin line with window offset
            
            
        }

        function mouseout(d) {
            d3.selectAll('.line')
              .classed("line--hover", false)
              .classed("line--fade", false);

            d3.selectAll('.ppm-text, .comment-text')
              .classed('text--hover', false)
              .classed('text--fade', false)

            // hide tooltip
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
               
          }

        

        function plotNew(d) {
            // get id of clicked transparent line (correponds to year)
            var id = d3.select(this).attr('id') 
           
            // if transparent line hasnt been selected change class to selected, plot new axis and replot initial data
            if (!d3.select('[id="' + id + '"]').classed('selected')) {
                
                // access detailed data
                var plotData = data['second'];
                var ppmNew = plotData.map((x) => x.ppm); // define new max
                
                y.domain([min, (d3.max(ppmNew))]); // reformat domain
                var ticks = sortTicks(y.ticks(), plotData);
                console.log(ticks)
                var yAxis = d3.axisLeft(y).tickValues(ticks) // define new axis to append
                
                const x = d3.scaleTime().range([0, width]);
                // define domains
                x.domain(d3.extent(plotData, function(d){
                    return Date.parse(d.date)
                }))


                var xAxis = d3.axisBottom(x).ticks(7).tickFormat(d3.timeFormat('%b %d')).tickValues(plotData.map(d => Date.parse(d.date)))
                // remove previous axis and lines/text and append new one
                svg.selectAll('#yaxis, .line, .line2, .ppm-text, .comment-text').remove();
                svg.append('g')
                    .attr('class', 'line')
                    .attr('id', 'yaxis')
                    .call(yAxis)

                svg.append('g')
                    .attr('class', 'line')
                    .attr('id', 'xaxis')
                    .call(xAxis)
                // replot initial data
                initialRender(data1);

                // // after render pass selected class to newly rendered line
                d3.select('[id="' + id + '"]').classed('selected', true);
            }
            else   {
                // remove components and replot initial state, remove selected class
                svg.selectAll('#yaxis, .line, .selected, .ppm-text, .comment-text').remove();
                initialState()
                initialRender(data1)
                d3.select('[id="' + id + '"]').classed('selected', false);
            }
            
            
          }


          plotLineGraph()
          
        //   // plot line graph
        //   var lineData = data['third']

        //   // define dimensions
        //   const width2 = 200;
        //   const height2 = 200;
        // //   const margin = 5;
        // //   const padding = 10;
        // //   const adj = 30;

        
        
        
        
        
        // console.log(RIGHT_CHARTS_WIDTH)
          
        // // append svg
        //   const svg2 = d3.select(".lineGraphContainer").append("svg")
        //     .attr("preserveAspectRatio", "xMidYMid")
        //     .attr("viewBox", "-"
        //         + 30 + " -"
        //         + 0 + " "
        //         + (width2 + 0) + " "
        //         + (height2 + 0))
        //     .style("padding", 5)
        //     .style("margin", 2)
        //     .classed("svg-content", true);

        // // define base axis 
        // const y2 = d3.scaleLinear().rangeRound([height2, 0]);
        
        // // define minimum for axis
        // //var ppm = lineData.map((x) => x.ppm);
        // // var min = Math.floor(d3.min(ppm))
        
        // // if (min%2 !=0) { //if odd get first even number below
        // //     min = min -1
        // // }

        // // initial axis domain
        // y2.domain([200, 412]);

        // //ticks = y.ticks()
        // //var ticks = sortTicks(y2.ticks(), plot);
        // var yAxis2 = d3.axisLeft(y2)//.tickValues(ticks)

        // svg2.append('g')
        // .attr('class', 'line')
        // .attr('id', 'yaxis')
        // .call(yAxis2)
            
        
    })


        
        

        

        



        

        
    




























// // define app for CO2 dashboard
// const app = document.getElementById('root')
// const container = document.createElement('div');
// container.setAttribute('class', 'container');
// app.appendChild(container);
// // add graph container
// d3.select('body').append('div').attr('class', 'graphContainer');

// // port
// var link = 'http://localhost:3000/'

// // fetch data
// fetch(link)
//     .then(response => response.json())
//     .then(data => {
//         // define current date, month and year
//         var suh = new Date()
//         const month = suh.getMonth()
//         const year = suh.getFullYear();
        
//         // for latest update get day
//         var day = data[year][0]['Day'];
//         var latestDay = day

//         // check data is available for most recent day and if not go back to day with most recent data
//         function checkDay(x) {
//             var temp = data[year].filter((element)=> element['Day'] == x)[0]['PPM'];
//             if (Number(temp)){
//                 return x
//             } else {
//                 return checkDay(x-1)
//             }
//         }

//         // redefine day
//         var day = checkDay(day)
        
//         // go into data and match with checked day
//         var keys = Object.keys(data)
//         // define empty data for dashboard and plots
//         var newData = []
//         var plotData = []
        
//         for (var i=0; i<keys.length; i++) {
//             var temp = data[keys[i]].filter((element) => element['Day'] == day)
//             // if data isnt available take from day before in relevant year
//             if (temp.length == 0) {
//                 var temp = data[keys[i]].filter((element) => element['Day'] == (day-1))
//             }
//             temp[0]['Year'] = Number(keys[i]);
            
//             newData[keys[i]] = temp;
//             plotData.push(temp[0])

//          }

        
//         // in each row create column showing pecrntage change from present
//         var current  = newData[year][0]['PPM']
    
//         for (var i=0; i<keys.length; i++) {
//             var temp = newData[keys[i]][0]['PPM']
//             newData[keys[i]][0]['PC'] = Math.floor(((current - temp) / temp  *100) * 100) / 100
//         }



//         // display in html current reading
//         // create box
//         const box = document.createElement('div');
//             box.setAttribute('class', 'box');

//         // Write title of each location
//         const h1 = document.createElement('p');
//         h1.setAttribute('class', 'h1');
//         h1.innerHTML = 'Latest CO<sub>2</sub> levels: ' + '<br>' + newData['2020'][0]['PPM'] + '<small class=\'ppm\'> PPM</small>' + '<br>' + ' <small class=\'update\'>' + '(last update: ' + suh.toLocaleString('default', { month: 'long' }) + ' ' + latestDay + ')</small>'

//         const inc = document.createElement('p1');
//         inc.setAttribute('class', 'inc');
//         inc.innerHTML = '% increase from this day in...'

//         // create div for lists
//         const listContainer = document.createElement('div');
//         listContainer.setAttribute('class', 'lists');

//         var notThis = newData;
//         delete notThis['2020'];
//         var newDataKeys = Object.keys(notThis);
        
//         for (var i=0; i<newDataKeys.length; i++) {
//             const list = document.createElement('ul');
//             list.setAttribute('class', newDataKeys[i]);
//             list.setAttribute('style', 'list-style:none')
//             var liYear = document.createElement('li');
//             liYear.innerHTML = newDataKeys[i];
//             var liPC = document.createElement('li');
//             liPC.innerHTML = newData[newDataKeys[i]][0]['PC'] + '%';
//             var liPPM = document.createElement('li');
//             liPPM.innerHTML = '(' + newData[newDataKeys[i]][0]['PPM'] + ' PPM)'

//             list.append(liYear, liPC, liPPM) 
//             listContainer.append(list);  
//         }

        
//         container.appendChild(box);
//         box.appendChild(h1);
//         box.appendChild(inc)
//         box.appendChild(listContainer);
       

//         /////// define graph container
        
//         // define dimensions
//         const width = 500;
//         const height = 300;
//         const margin = 5;
//         const padding = 10;
//         const adj = 30;

        
        
//         // append svg
//         const svg = d3.select(".graphContainer").append("svg")
//             .attr("preserveAspectRatio", "xMidYMid")
//             .attr("viewBox", "-"
//                 + adj + " -"
//                 + adj + " "
//                 + (width + adj *3) + " "
//                 + (height + adj*3))
//             .style("padding", padding)
//             .style("margin", margin)
//             .classed("svg-content", true);
        


//         // prepare scales
//         const x = d3.scaleTime().range([0, width]);
//         const y = d3.scaleLinear().rangeRound([height, 0]);



//         // define domains
//         x.domain(d3.extent(plotData, function(d){
//             return d.Year
//         }));

//         var ppm = plotData.map(x => x.PPM)
//         y.domain([Math.round((d3.min(ppm)-1)), Math.round((d3.max(ppm)+1))]);
//         console.log(d3.min(ppm))

//         // define axes
//         var xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.format('d')).tickValues(plotData.map(d => d.Year))
//         var yAxis = d3.axisLeft(y)
        

//         // add axes
//         svg.append('g')
//             .attr('class', 'x axis')
//             .attr('transform', 'translate(0,' + height + ')')
//             .call(xAxis)

//         svg.append('g')
//             .attr('class', 'axis')
//             .call(yAxis)


//         // define line and add
//         var valueline = d3.line()
//                 .x(function(d) {return x(d.Year);})
//                 .y(function(d) {return y(d.PPM);});

//         svg.append('path')
//             .data([plotData])
//             .attr('class', 'line')
//             .attr('d', valueline)
//             .attr("stroke", "black")
//             .attr("stroke-width", 1)
//             .attr("fill", "none");

        
        
//         // create circle to travel along line
//         var focus = svg.append('g')
//                        .append('circle')
//                             .style('fill', 'skyblue')
//                             .attr('stroke', 'black')
//                             .attr('r', 8.5)
//                             .style('display', 'none')

        
//         // Create the text that travels along the curve of chart
//         var focusText = svg
//             .append('g')
//             .append('text') 
//                 .style("display", 'none')
//                 .attr("text-anchor", "left")
//                 .attr("alignment-baseline", "middle")


        
                    
//         // Create a rect on top of the svg area: this rectangle recovers mouse position
//         svg
//             .append('rect')
//             .style("fill", "none")
//             .style("pointer-events", "all")
//             .attr('width', width+100)
//             .attr('height', height+100)
//             .on('mouseover', mouseover)
//             .on('mousemove', mousemove)
//             .on('mouseout', mouseout);

     
//         // display tooltip on mouseover
//         function mouseover() {
//                 focus.style("display", null)
//                 focusText.style("display", null)
//             }
    
    
//         //  find the closest X index of the mouse:
//         var bisectYear = d3.bisector(d => d.Year).left;
//         //var bisectPPM = d3.biserctor(d => d.PPM).right;


//         function mousemove() {
//                 // take x mouse position and convert to equivalent date
//                 var x0 = x.invert(d3.mouse(this)[0]);
//                 // find index of plotData array that is closest to mouse
//                 var i = bisectYear(plotData, x0, 1);
//                 d0 = plotData[i-1],
//                 d1 = plotData[i],                                 
//                 d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
                
//                 focus
//                   .attr("cx", x(d.Year))
//                   .attr("cy", y(d.PPM))
//                 focusText
//                   .html(d.Year + "  :  " + d.PPM + "PPM")
//                   .attr("x", x(d.Year)+15)
//                   .attr("y", y(d.PPM))
//                 }
    
//             function mouseout() {
//                     focus.style("display", 'none')
//                     focusText.style("display", 'none')
//                   } 
       
        


        
//     });