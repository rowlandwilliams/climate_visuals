var timeParse = d3.timeFormat('%d %B')
var red = 'rgba(255, 105, 97, 1)'
let lMargin = {top: 20, right: 30, bottom:20, left: 30},

lWidth = LGCONT_WIDTH // initially make width / height equal to container width
lHeight = LGCONT_HEIGHT

let lx0 = d3.scaleTime()
    .domain([new Date(2020, 0, 1), new Date(2020, 11, 31)])
    .range([lMargin.left, lWidth - lMargin.right])

let ly0 = d3.scaleLinear()
    .domain([275, 420])
    .range([lHeight - lMargin.bottom, lMargin.top]);

   
let lXAxis = g => g
    .attr("transform", 'translate(0,' + (lHeight - lMargin.bottom) + ')')
    .call(d3.axisBottom(lx0).tickFormat(d3.timeFormat('%b')))


  



// define line funciton
let lineGraphLine = d3.line()
    .x(d => lx0(Date.parse(d.date))) 
    .y(d => ly0(d.ppm))

// define voronoi function
var voronoi = d3.voronoi()
    .x(function(d) { return lx0(Date.parse(d.date)) })
    .y(function(d) { return ly0(d.ppm) })
    // .extent([0, 0], [lWidth, lHeight]); // work on this

var lsvg = d3.select(".lineGraphContainer").append("svg")
    .attr('width', lWidth) // could add padding here
    .attr('height', lHeight)
    .attr('viewBox', [0, 0, lWidth, lHeight])
  
// plot initial line graph // min ppm 275.3 in1620
function plotLineGraph() {
    let  lYAxis = g => g
    .attr("transform", 'translate(' + lMargin.left +',0)')
    .call(d3.axisLeft(ly0)) 

    lsvg.append('g')
        .call(lXAxis)
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text')
        .attr('dx', '2.8em'))
        .attr('stroke', '#F4F1F1')
        
    
    lsvg.append('g')
        .call(lYAxis)
        .attr('class', 'lYAxis')
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text') // move labels right
        .attr('dx', 'em'))
        // .attr('class', 'lg_ytext')
        .attr('stroke', '#F4F1F1')
        

    var centuries = lsvg.selectAll('.century')
        .data(global.linegraph)
        .enter()    
        .append('g')
        .attr('class', 'century')
        .attr('id', function(d) { return d.century; })
        
    centuries.selectAll('.year_line')
        .data(d => d.year_values)
    .enter()
        .append('path')
        .attr('class', 'year_line')
        .attr('id', function(d) { return "year_" + d.year })
        .attr('d', function(d) { return lineGraphLine(d.values); })
        .attr('fill', 'none')
        .style('stroke', '#F4F1F1')
        .style('stroke-width', 1)
            
        
         
    //add focus to hover over grid
    var focus = lsvg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(-100,-100)");

    focus.append("circle")
        .attr("fill", "none")
        .attr("class", "focus_ring")
        .attr('stroke', red)
        .attr("stroke-width", "1.5")
        .attr("r", 5)
        .style('opacity', 0)

    focus.append("text")
        .attr('text-anchor', 'middle')
        .attr("class", "tt_year");

    var crossHair = lsvg.append('g')
        .attr("class", "crossHair")
        .style('opacity', 0)
        // .attr("transform", "translate(-100,-100)");
       
    
    crossHair.append('rect') 
        .attr('id', 'crossHairY')
        .attr('height', 3)
        .attr('width', 100)
        .attr('fill', red)
        
    
    crossHair.append('rect')
        .attr('id', 'crossHairX')
        .attr('fill', red)
        .attr('width', 3)
        .attr('height', 100)
        
    
    

    var v = voronoi(d3.merge(d3.merge(global.linegraph.map(x => x.year_values.map(y => y.values)))))
    //console.log(d3.merge(d3.merge(global.linegraph.map(x => x.year_values.map(y => y.values)))))

    var voronoiGroup = lsvg.append("g")
      .attr("class", "voronoi");

     
    voronoiGroup.selectAll('path')
        .data(v.polygons())
        .enter().append('path')
            .attr('d', function(d) { return d ? "M" + d.join("L") + "Z" : null; })
            .on('mouseover', d => mouseover(d.data))
            .on('mouseout', d => mouseout(d.data))
            
            //.attr('class', function(d) { return d.data.year })

    // add tooltip 
    var site = null;
    const radius = 100


    
    
    function mouseover(d) {
        
        focus
            .select('.focus_ring')
            .style('opacity', 1)
        focus.attr("transform", "translate(" + lx0(Date.parse(d.date)) + "," + ly0(d.ppm) + ")");
       
        d3.select('.db_ytext') // change dashboard text
             .text(timeParse(Date.parse(d.date))+ ' ' + d.year)

        d3.select('.db_ppmtext') // change dashboard text
             .text(d.ppm + ' PPM')

        // d3.select('.db_date')
        //     .text(timeParse(Date.parse(d.date)))
        // adjust crossHair style
        crossHair
                .style('opacity', 1); 
        crossHair.select("#crossHairX")
                .attr("transform", "translate(" + lx0(Date.parse(d.date)) + "," + (ly0(ly0.domain()[0]) - 100) + ")")
        crossHair.select("#crossHairY")
                .attr("transform", "translate(" + lx0(lx0.domain()[0]) + "," + (ly0(d.ppm)) + ")")
        
        // select line
        var year = d.year
        var fill = d3.select('.tile' + year).style('fill');

        d3.selectAll('.year_line')
            .style('opacity', function(d) {
                return d.year == year ? 1 : 0.3  })
            .style('stroke', function(d) {
                return d.year == year ? fill : '#F4F1F1' })
            .style('stroke-width', function(d) {
                return d.year == year ? '3px' : '1px' })
        
        
         

    }

    function mouseout(d) {
        focus
            .select('.focus_ring') // circle
            .style('opacity', 0)
        crossHair
            .style('opacity', 0);

        d3.selectAll('.year_line')
            .style('opacity', 1)
            .style('stroke', '#F4F1F1')
            .style('stroke-width', '1px')
        

    }

    
    
}



function updateLineGraph(century) {
    var temp = global.linegraph.filter(x => x.century == century)
    var values =  d3.merge(d3.merge(temp.map(x => x.year_values.map(y => y.values.map(z => z.ppm)))))
    console.log((d3.min(values) - 1))
    
    // redefine y domain
    ly0.domain([(d3.min(values) - 1), (d3.max(values) + 1)]);
//     my0.domain([SPECIAL.Mn.boundMin, SPECIAL.Mn.boundMax]);
    let  lYAxis = g => g
    .attr("transform", 'translate(' + lMargin.left +',0)')
    .call(d3.axisLeft(ly0))

    d3.selectAll('.lYAxis')
    .transition().duration(300).delay(500)
    .call(lYAxis)
    // .call(g => g.selectAll(".domain, line") // remove axis line and ticks
    // .remove())
    // .call(g => g.selectAll('text') // move labels right
    // .attr('dx', 'em'))
    // // .attr('class', 'lg_ytext')
    // .attr('stroke', '#F4F1F1')


    


//   console.log(W_BEAMS)
//   wGroup.selectAll('path')
//       .data(d => d.values)
//       .transition().duration(500)
//       .attr('opacity', mFilterOpacity)
//       // .attr('stroke', mFilterStroke)
//       // .attr('stroke-width', mFilterStrokeWidth);

//   wGroup.selectAll('path')
//       .data(d => d.values)
//       .transition().duration(TRANSITION_TIME).delay(500)
//       .attr('d', d => mLine(d.MnValues));
    
    
//     var centuries = lsvg.selectAll('.century')
//         .data(global.linegraph)

//     centuries.selectAll('path')
//     .data(d => d.year_values)
//     .enter()    
//         // .append('g')
//         // .attr('class', 'century')
//         // .attr('id', function(d) { return d.century; })
        
//     centuries.selectAll('.year_line')
//         .data(d => d.year_values)
//     .enter()
//         .append('path')
//         .attr('class', 'year_line')
//         .attr('id', function(d) { return "year_" + d.year })
//         .attr('d', function(d) { return lineGraphLine(d.values); })
//         .attr('fill', 'none')
//         .style('stroke', '#F4F1F1')
//         .style('stroke-width', 1)

//     centuries.selectAll('.century')
//         .data(temp)
//         .exit()
//         .remove()

//     console.log(centuries)
    //centuries.selectAll('.century')

//     d3.selectAll(".century")
//     .data(temp, function(d) { return d.century })
//     .transition().duration(1000)
    

//     var centuries = lsvg.selectAll('.century')
//     console.log(centuries)
//     //     .data(temp, function(d) { return d.century; })
//     //     .exit()
//     //     .remove()

//     var test = lsvg.selectAll('.century')
//         .data(temp, function(d) { return d.century })
        
//     test    
//         .exit()
//         .remove();

//     console.log(test)
//     test.selectAll('.century')
//         .data(temp, function(d) { return d.century})
//         .enter()
//         .append('g')

//     // call this whenever the filter changes
//   function applyFilter(value) {
//     // filter the data
//     var data = tsv.filter(function(d) {return d.group === value;})

//     // update the bars
//     d3.selectAll(".bar")
//       .data(data)
//       .transition().duration(1000)
//       .attr("x", function(d) { return x(d.letter); })
//       .attr("y", function(d) { return y(d.frequency); })
//       .attr("height", function(d) { return height - y(d.frequency); });

//   }

//     console.log(test)

    // test.enter()
    //     .append()



    // centuries.selectAll('.year_line')
    //     .data(d => d.year_values)
    //     .enter()
    //     .append('path')
    //     .attr('class', 'year_line')
    //     .attr('id', function(d) { return "year_" + d.year })
    //     .attr('d', function(d) { return lineGraphLine(d.values); })
    //     .attr('fill', 'none')
    //     .style('stroke', '#F4F1F1')
    //     .style('stroke-width', 1)  

    

    
}
        
      



