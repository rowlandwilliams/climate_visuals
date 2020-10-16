var link = './data.json'

fetch(link)
    .then(response => response.json())
    .then(data => {
        
        
        plotTile(data['first'])

        //plotLineGraph(data['second'])
       
    })


  // // append svg
        // const svg = d3.select(".timelineContainer").append("svg")
        //     .attr("preserveAspectRatio", "xMidYMid")
        //     .attr("viewBox", "-"
        //         + adj + " -"
        //         + adj + " "
        //         + (width + adj *3) + " "
        //         + (height + adj*3))
        //     .style("padding", padding)
        //     .style("margin", margin)
        //     .classed("svg-content", true);

        
        // var tooltip = d3.select('body').append('div')
        //     .attr('class', 'tooltip')
        //     .style('opacity', 0)
            //.style('position', 'absolute')

        // // define base axis 
        // const y = d3.scaleLinear().rangeRound([height, 0]);
        
        // // define minimum for axis
        // var ppm = data1.map((x) => x.ppm);
        // var min = Math.floor(d3.min(ppm))
        
        // if (min%2 !=0) { //if odd get first even number below
        //     min = min -1
        // }
        
        // function sortTicks([...ticks], [...data]) {
        //     var temp = [];
        //     for (var i = ticks[0]; i <= ticks[ticks.length-1]; i+=2) {
        //         temp.push(i) // starting at lowest tick value add each second value in range
        //     }
        //     if (temp[0] > data[data.length-1].ppm) { // check if lowest tick is above lowest ppm value (due to rounding)
        //         temp.unshift(temp[0]-2) // add tick below if needed
        //     }
        //     temp.push(data[0].ppm); // add highest value for custom highest tick
        //     return temp;
        //     }
        
        
        
        
        // // define function for initial axes
        // function initialState() {
        //     // initial axis domain
        //     y.domain([min, (d3.max(ppm))]);

        //     //ticks = y.ticks()
        //     var ticks = sortTicks(y.ticks(), data1);
        //     var yAxis = d3.axisLeft(y).tickValues(ticks)

        //     svg.append('g')
        //     .attr('class', 'line')
        //     .attr('id', 'yaxis')
        //     .call(yAxis)
        // }   

        // // define initial state
        // initialState();
        

        // // append lines and text
        // // inital render function

        // function initialRender(d) {
        //     //var changed = false;
        //     for (var i=0; i<d.length; i++) {
        //         var line = svg.append("g")
        //         line.append('line')
        //                 .attr('class', 'line')
        //                 //.attr('id', d[i].year)
        //                 .attr("x1", 0)
        //                 .attr("x2", width)
        //                 .attr("y1", y(d[i].ppm))
        //                 .attr("y2", y(d[i].ppm))
        //                 .attr("stroke-width", 1.5)
        //                 .attr("stroke", "black")
                        
    
        //         // line2 = svg.append('g')
        //         line.append('line')
        //                 //.attr('class', 'line2')
        //                 .attr('id', d[i].year)
        //                 .attr("x1", 0)
        //                 .attr("x2", width)
        //                 .attr("y1", y(d[i].ppm))
        //                 .attr("y2", y(d[i].ppm))
        //                 .attr("stroke-width", 100)
        //                 .attr("stroke", "transparent")
        //                 .on('mouseover', mouseover)
        //                 .on('mouseout', mouseout)
        //                 .on('click', plotNew)
                        
    
        //         line.append('text')
        //                 .attr('class', 'ppm-text')
        //                 .attr('text-anchor', 'middle')
        //                 .attr('x', width/2)
        //                 .attr('y', y(d[i].ppm +0.18))
        //                 .text(d[i].ppm + ' PPM')
                        
    
        //         line.append('text')
        //                 .attr('class', 'comment-text')
        //                 .attr('text-anchor', 'middle')
        //                 .attr('x', width/2)
        //                 .attr('y', y(d[i].ppm -0.3))
        //                 .text(d[i].text)  
        //     }
        // }
        
        // initialRender(data1)
        
       
        // function mouseover(d) {
        //     var me = this.previousElementSibling
        //     console.log(me) // grab thinner line
        //     var ppmText = this.nextElementSibling; // get text
        //     var commentText = ppmText.nextElementSibling;
            

        //     d3.selectAll('.line')
        //     .classed('line--hover', function() {
        //         return (this === me);
        //     }).classed("line--fade", function() {
        //         return (this !== me);
        //     })  

        //     d3.selectAll('.ppm-text')
        //         .classed('text--hover', function() {
        //             return (this === ppmText);
        //         })
        //         .classed('text--fade', function() {
        //             return (this !== ppmText);
        //         })

        //     d3.selectAll('.comment-text').classed('text--hover', function() {
        //         return (this === commentText);
        //     }).classed('text--fade', function() {
        //         return (this !== commentText);
        //     })

        //     // get position of thin line element
        //     var pos = me.getBoundingClientRect();
        //     var id = d3.select(this).attr('id') // match tooltip comment to year id
            

        //     tooltip
        //          .transition()
        //          .duration(500)
        //          .style('opacity', 1)
        //     tooltip
        //         .html(data1.filter((x) => x.year == id)[0].tooltip)
        //         .style('left', pos.x + pos.width + 5 + 'px')
        //         .style('top', window.pageYOffset + pos.y + 6.5 + 'px'); // position relative to thin line with window offset
            
            
        // }

        // function mouseout(d) {
        //     d3.selectAll('.line')
        //       .classed("line--hover", false)
        //       .classed("line--fade", false);

        //     d3.selectAll('.ppm-text, .comment-text')
        //       .classed('text--hover', false)
        //       .classed('text--fade', false)

        //     // hide tooltip
        //     tooltip
        //         .transition()
        //         .duration(200)
        //         .style("opacity", 0)
               
        //   }

        

        // function plotNew(d) {
        //     // get id of clicked transparent line (correponds to year)
        //     var id = d3.select(this).attr('id'); 
           
        //     // if transparent line hasnt been selected change class to selected, plot new axis and replot initial data
        //     if (!d3.select('[id="' + id + '"]').classed('selected')) {
                
        //         // access detailed data
        //         var plotData = data['second'];
        //         var ppmNew = plotData.map((x) => x.ppm); // define new max
                
        //         y.domain([min, (d3.max(ppmNew))]); // reformat domain
        //         var ticks = sortTicks(y.ticks(), plotData);
        //         console.log(ticks)
        //         var yAxis = d3.axisLeft(y).tickValues(ticks) // define new axis to append
                
        //         const x = d3.scaleTime().range([0, width]);
        //         // define domains
        //         x.domain(d3.extent(plotData, function(d){
        //             return Date.parse(d.date)
        //         }))


        //         var xAxis = d3.axisBottom(x).ticks(7).tickFormat(d3.timeFormat('%b %d')).tickValues(plotData.map(d => Date.parse(d.date)))
        //         // remove previous axis and lines/text and append new one
        //         svg.selectAll('#yaxis, .line, .line2, .ppm-text, .comment-text').remove();
        //         svg.append('g')
        //             .attr('class', 'line')
        //             .attr('id', 'yaxis')
        //             .call(yAxis)

        //         svg.append('g')
        //             .attr('class', 'line')
        //             .attr('id', 'xaxis')
        //             .call(xAxis)
        //         // replot initial data
        //         initialRender(data1);

        //         // // after render pass selected class to newly rendered line
        //         d3.select('[id="' + id + '"]').classed('selected', true);
        //     }
        //     else   {
        //         // remove components and replot initial state, remove selected class
        //         svg.selectAll('#yaxis, .line, .selected, .ppm-text, .comment-text').remove();
        //         initialState()
        //         initialRender(data1)
        //         d3.select('[id="' + id + '"]').classed('selected', false);
        //     }
            
            
        //   }


        
        

        

        



        

        
    




























