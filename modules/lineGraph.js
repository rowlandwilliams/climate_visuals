var timeParse = d3.timeFormat('%d %B')
var red = 'rgba(255, 105, 97, 1)'
let lMargin = {top: 50, right: 60, bottom:20, left: 80},

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

let  lYAxis = g => g
    .attr("transform", 'translate(' + lMargin.left +',0)')
    .call(d3.axisLeft(ly0))

  

// define line funciton
let lineGraphLine = d3.line()
    .x(d => lx0(Date.parse(d.date))) 
    .y(d => ly0(d.ppm))

// define voronoi function
var voronoi = d3.voronoi()
    .x(function(d) { return lx0(Date.parse(d.date)) })
    .y(function(d) { return ly0(d.ppm) })
    .extent([[-lMargin.left, -lMargin.top], [lWidth + lMargin.right, lHeight + lMargin.bottom]]) // clip voronoi

var lsvg = d3.select(".lineGraphContainer").append("svg")
    .attr('width', lWidth) // could add padding here
    .attr('height', lHeight)
    .attr('viewBox', [0, 0, lWidth, lHeight])
  
// plot initial line graph // min ppm 275.3 in1620
function plotLineGraph() {
    

    lsvg.append('g')
        .call(lXAxis)
        .call(g => g.selectAll(".domain, line, text") // remove axis line and ticks
        .remove())
        // .call(g => g.selectAll('text')
        // .attr('class', 'lX_text')
        // .attr('dx', '2.8em'))
        // .attr('stroke', '#F4F1F1')
        
    
    lsvg.append('g')
        .call(lYAxis)
        .attr('class', 'lYAxis')
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text')
        .attr('class', 'lX_text') // move labels right
        .attr('dx', 'em'))
        // .attr('class', 'lg_ytext')
        .attr('stroke', '#202020')
        .style('opacity', 0.8)
        

    lsvg.append("text") 
        .attr('class', 'lX_text')            
        .attr("transform",
              "translate(" + (lWidth / 2) + " ," + 
                             (lHeight ) + ")")
        .style("text-anchor", "middle")
        .style('stroke', '#202020')
        .style('opacity', 0.8)
        .text("Months");

    var centuries = lsvg.selectAll('.century.c')
        .data(global.linegraph)
        .enter()    
        .append('g')
        .attr('class', d => 'g century c' + d.century)
        //.attr('id', function(d) { return d.century; })
        
    centuries.selectAll('.y-line')
        .data(d => d.year_values)
    .enter()
        .append('path')
        .attr('class', d => 'y-line ' + d.year)
        .attr('id', d => 'y' + d.year)
        .attr('d', function(d) { return lineGraphLine(d.values); })
        .attr('fill', 'none')
        .style('stroke', '#202020')
        .style('stroke-width', 1)
        .attr('opacity', 1)
        

        
         
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
    

    var voronoiGroup = lsvg.append("g")
      .attr("class", "voronoi");

     
    voronoiGroup.selectAll('path')
        .data(v.polygons())
        .enter().append('path')
            // .attr('d', d => 'M' + (d.join('L') || '0,0') + 'Z')
            .attr('d', function(d) { return d ? "M" + d.join('L') + "Z" : null; })
            .on('mouseover', d => mouseover(d.data))
            .on('mouseout', d => mouseout(d.data))


    // add line to current values
    // define positions
    
    var lastPoint = global.linegraph[global.linegraph.length - 1].year_values.slice(-1)[0].values.slice(-1)[0]
    
    
    
    var pos = d3.select('.db_current').node().getBoundingClientRect()
    var length = d3.select('#y2020').node().getTotalLength()
   

   

    lsvg.append("line")
        .attr('class', 'currentLine2')
        .attr("x1", lx0(Date.parse(lastPoint.date)))
        .attr("x2", pos.x)
        .attr("y1", ly0(lastPoint.ppm))
        .attr("y2", ly0(lastPoint.ppm))
        .style("stroke-width", 1)
        .style("stroke-dasharray", ("3, 3"))
        .style("stroke", "#202020")
        .style("fill", "none"); 

    lsvg.append("line")
        .attr('class', 'currentLine3')
        .attr("x1", pos.x - LEFT_CHARTS_WIDTH - 20)
        .attr("x2", pos.x - LEFT_CHARTS_WIDTH - 20)
        .attr("y1", ly0(lastPoint.ppm))
        .attr("y2", ly0(lastPoint.ppm))
        .style("stroke-width", 1)
        .style("stroke-dasharray", ("3, 3"))
        .style("stroke", "#202020")
        .style("fill", "none"); 
    
    
            
}



function updateLineGraph(century) {
    d3.selectAll('.lX_text, .currentLine2')
        .transition().duration(1400).delay(500)
        .style('opacity', 0)

    // d3.select('.currentLine')

    
    if (century == 'all') {
        var temp = global.linegraph
        ly0.domain([275, 420])
            .range([lHeight - lMargin.bottom, lMargin.top]);
        lsvg.attr('height', lHeight) // expand y axis to bottom
            .transition().duration(1400).delay(500)
        d3.selectAll('.lX_text, .currentLine2')
            .transition().duration(1400).delay(500)
            .style('opacity', 1)
            
    }
    else {
        var temp = global.linegraph.filter(x => x.century == century)
        var values =  d3.merge(d3.merge(temp.map(x => x.year_values.map(y => y.values.map(z => z.ppm)))))
        ly0.domain([(d3.min(values) - 1), (d3.max(values) + 1)])
        .range([lHeight, 0]);
        lsvg.attr('height', lHeight + 50) // expand y axis to bottom
        .transition().duration(1400).delay(500)
        
    }

    d3.selectAll('.lYAxis')
    .transition().duration(1400).delay(500)
    .call(lYAxis)

    
    // grab all g century paths
    const centuries = lsvg.selectAll('.century')
        .data(global.linegraph)

    // for all the paths plot again for changed domain    
    centuries.selectAll('path')
        .data(d => d.year_values)
        .transition().duration(1400).delay(500)
        .attr('d', d => lineGraphLine(d.values));
   
    
    // Wait until the transition is done to recalculate and update the voronoi
    setTimeout(() => updateVoronoi(century), 1400 + 550);
    
    
    
}
        
      

function mouseover(d) {
     lsvg.select('.focus')   
        .select('.focus_ring')
        .style('opacity', 1)
    
    
    lsvg.select('.focus')
        .attr("transform", "translate(" + lx0(Date.parse(d.date)) + "," + ly0(d.ppm) + ")");
   

    var crossHair = lsvg.select('.crossHair')      
    crossHair.style('opacity', 1); 
    crossHair.select("#crossHairX")
            .attr("transform", "translate(" + lx0(Date.parse(d.date)) + "," + (ly0(ly0.domain()[0]) - 100) + ")")
    crossHair.select("#crossHairY")
            .attr("transform", "translate(" + lx0(lx0.domain()[0]) + "," + (ly0(d.ppm)) + ")")

    
    
    // select line and colour with corresponding tile shade
    var year = d.year

    d3.selectAll('.y-line')
        .style('opacity', function(d) {
            return d.year == year ? 1 : 0.3  })
        .style('stroke', function(d) {
            return d.year == year ? 'rgba(255, 105, 97, 1)' : '#202020' })
        .style('stroke-width', function(d) {
            return d.year == year ? '3px' : '1px' })
    
    d3.selectAll('.lX_text')
            .style('opacity', 0.3)

    // add text to end of lin
    var length = d3.select('#y' + year).node().getTotalLength()
    var end = d3.select('#y' + year).node().getPointAtLength(length) // get point at end of selected line
    var pos2 = d3.select('.db_current').node().getBoundingClientRect() // align with dashboard current text
    var tH = d3.select('.db_text').node().getBoundingClientRect() // tooltip height

    d3.select('.db_ytext') // change dashboard text
        .text(timeParse(Date.parse(d.date))+ ' ' + d.year)

    d3.selectAll('.db_ticker')
            .style('opacity', 1)

    d3.select('.db_ppmtext') // change dashboard text
        .text(d.ppm + ' PPM')

    d3.select('.db_text')
                .transition()
                .duration(200)
                // .style('left', pos2.x - 12 + 'px') // position x in line with dashboard text
                .style('top', end.y + 'px')//- (tH.height / 2) + 'px') // position y realtive to end of line
    
    d3.select('.currentLine3')
            .attr('y2', end.y + 'px')

    d3.select('.ppm_change')
            .text( Math.round(d3.select('.latest_ppm').text() - d.ppm) + ' PPM')

        
    
}

function mouseout(d) {
    lsvg
        .selectAll('.focus_ring, .crossHair') // circle
        .style('opacity', 0)
    
    // lsvg.select('.crossHair')
    //     .style('opacity', 0);

    d3.selectAll('.y-line')
        .style('opacity', 1)
        .style('stroke', '#202020')
        .style('stroke-width', '1px')
    
    d3.select('.db_ticker')
        .style('opacity', 0)

    d3.selectAll('.db_ytext, .db_ppmtext')
        .text('') // remove text

    var pos = d3.select('.db_current').node().getBoundingClientRect()
    
    d3.select('.currentLine3')
        .attr('y2', pos.y + pos.height)

    d3.select('.ppm_change')
        .text(' ')
    
    d3.selectAll('.lX_text')
        .style('opacity', 0.8)

    
}

function updateVoronoi(century) {
        if (century == 'all') {
            var temp = global.linegraph
        }
        else {
            var temp = global.linegraph.filter(x => x.century == century)
        }
        
        var v = voronoi(d3.merge(d3.merge(temp.map(y => y.year_values.map(x => x.values)))))
        
        // join century data
        const voronoiGroup = lsvg.selectAll('.voronoi')
                                 .selectAll('path')
                                 .data(v.polygons())
        // remove any data not in centruy
        voronoiGroup.exit().remove()
        
        // update -> transition between old and new state
        voronoiGroup
            .attr('d', function(d) { return d ? "M" + d.join('L') + "Z" : null; })
    
        // append new paths
        voronoiGroup
            .enter().append('path')
                .attr('d', function(d) { return d ? "M" + d.join('L') + "Z" : null; })
                .on('mouseover', d => mouseover(d.data))
                .on('mouseout', d => mouseout(d.data))
    
}

