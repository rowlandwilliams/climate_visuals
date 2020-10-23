var timeParse = d3.timeFormat('%d %B')
var red = 'rgba(255, 105, 97, 1)'
let lMargin = {top: 50, right: 30, bottom:20, left: 30},

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

  
var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    //.text('suh')
    .style('stroke', 'white')

tooltip.select('test')
    .append('div')
    .attr('class', 'test')

tooltip.select('test2')
    .append('div')
    .attr('class', 'test2')

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
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text')
        .attr('class', 'lX_text')
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
        .style('stroke', '#F4F1F1')
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

    focus.append("text")
        .attr('text-anchor', 'middle')
        .attr("class", "tt_year")
        .text('SUHUHU')
        

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
            
}



function updateLineGraph(century) {
    if (century == 'all') {
        var temp = global.linegraph
    }
    else {
        var temp = global.linegraph.filter(x => x.century == century)
    }

    lsvg.attr('height', lHeight + 50) // expand y axis to bottom
        .transition().duration(1400).delay(500)

    //var temp = global.linegraph.filter(x => x.century == century)
    var values =  d3.merge(d3.merge(temp.map(x => x.year_values.map(y => y.values.map(z => z.ppm)))))
    
    // redefine y domain
    ly0.domain([(d3.min(values) - 1), (d3.max(values) + 1)])
        .range([lHeight, 0]);

    // transition y Axis
    d3.selectAll('.lYAxis')
    .transition().duration(1400).delay(500)
    .call(lYAxis)

    d3.selectAll('.lX_text')
        .style('opacity', 0)
    
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
    var fill = d3.select('.tile' + year).style('fill');

    d3.selectAll('.y-line')
        .style('opacity', function(d) {
            return d.year == year ? 1 : 0.3  })
        .style('stroke', function(d) {
            return d.year == year ? fill : '#F4F1F1' })
        .style('stroke-width', function(d) {
            return d.year == year ? '3px' : '1px' })
    
    d3.select('.db_ytext') // change dashboard text
        .text(timeParse(Date.parse(d.date))+ ' ' + d.year)
   
    d3.select('.db_ppmtext') // change dashboard text
        .text(d.ppm + ' PPM')

    // add text to end of line
    var pos = d3.select('#y' + year).node().getBoundingClientRect()
    var pos2 = d3.select('.db_current').node().getBoundingClientRect()

    d3.select('.db_text')
                .transition()
                .duration(200)
                .style('opacity', 1)
                .style('left', pos2.x + 'px')
                .style('top', pos.y + 'px')
    
    // d3.select('.test')
    //         .text(timeParse(Date.parse(d.date))+ ' ' + d.year)
                //.text(function(d) { console.log(d); return "<tspan x='0' dy='1.2em'>" + 
                                            // timeParse(Date.parse(d.date)) + d.year + "</tspan>" +
                                            // "<tspan x='0' dy='1.2em'>" + "</tspan>"; } )
                      
                    
                    // timeParse(Date.parse(d.date))+ ' ' + d.year)
                

    // lsvg.select('.focus')   
    //     .select('.tt_year')
    //     .attr("transform", "translate(" + lWidth + "," + ly0(d.ppm) + ")");
    //     //.attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     // .style('left', pos.x + pos.width + 10 + 'px')
    //     // .style('top', pos.y + 'px')
        
    
}

function mouseout(d) {
    lsvg.select('.focus')
        .select('.focus_ring') // circle
        .style('opacity', 0)
    
    lsvg.select('.crossHair')
        .style('opacity', 0);

    d3.selectAll('.y-line')
        .style('opacity', 1)
        .style('stroke', '#F4F1F1')
        .style('stroke-width', '1px')
    
    d3.selectAll('.db_ytext, .db_ppmtext')
        .text('') // remove text

    d3.select('.tooltip')
        .text(' ')
}

function updateVoronoi(century) {
        var temp = global.linegraph.filter(x => x.century == century)
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

