
var PADDING = 10
var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;
var lineChartWidth = document.querySelector('.rightColumn').offsetWidth;
var lineGraphHeight = document.querySelector('.lineGraphContainer').offsetHeight - PADDING  
console.log()

let lMargin = {top: 100, right: 20, bottom:40, left: 40},
    lWidth = lineChartWidth - lMargin.left - lMargin.right,
    lHeight = lineGraphHeight - lMargin.top - lMargin.bottom;




function plotLineGraph(data) {
    let lx0 = d3.scaleTime()
        .domain([new Date(2020, 0, 1), new Date(2020, 11, 31)])
        .range([0, lWidth])
    
    let ly0 = d3.scaleLinear()
        .domain([200, 420])
        // .domain([d3.min(data, function(d) { return d3.min(d.values.ppm) }),
        //          d3.max(data, function(d) { return d3.max(d.values.ppm) })])
        .range([lHeight, 0]);
    
    let lXAxis = d3.axisBottom()
        .scale(lx0)
        .tickFormat(d3.timeFormat('%b'))

    let lYAxis = d3.axisLeft()
        .scale(ly0)


    const lsvg = d3.select(".lineGraphContainer").append("svg")
        .attr('width', lWidth + lMargin.left + lMargin.right)
        .attr('height', lHeight + lMargin.top + lMargin.bottom)
        .append('g')
        .attr('transform', 'translate(' + lMargin.left + ',' + lMargin.top + ')');

    //ly0.domain([200, 420]);
    
    lsvg.append('g')
        .attr('class', 'xaxis')
        .attr('transform', 'translate(0, ' + (lHeight + 12) + ')')
        .call(lXAxis)
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text')
        .attr('dx', '2.8em'))
    
    lsvg.append('g')
        .attr('class', 'yaxis_linegraph')
        .call(lYAxis)
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text') // move labels right
        .attr('dx', '0.5em'))

    
    // define single line function
    let singleLine = d3.line()
        .x(d => lx0(d.date))

    // define multi line funciton
    let multiLine = d3.line()
        .x(d => lx0(Date.parse(d.date))) // maybe map here
        .y(d => ly0(d.ppm))


    var year = lsvg.selectAll('.year')
        .data(data)
    .enter()
        .append('g')
        .attr('class', 'year');

    year.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { return multiLine(d.values); })
        // .style('stroke', 'black')
        // .attr('stroke-width', 0.0001)
        .attr('fill', 'none')
        .style('stroke', '#9c9c9c')
        //.attr('stroke-width', 0.01)
    


    
        
        

    
}


