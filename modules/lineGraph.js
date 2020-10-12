// define dimensions for line graph
var PADDING = 10
var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;
var lineChartWidth = document.querySelector('.rightColumn').offsetWidth;
var lineGraphHeight = document.querySelector('.lineGraphContainer').offsetHeight - PADDING;  

let lMargin = {top: 100, right: 20, bottom:40, left: 40},
    lWidth = lineChartWidth - lMargin.left - lMargin.right,
    lHeight = lineGraphHeight - lMargin.top - lMargin.bottom;


// plot initial line graph

function plotLineGraph(data) {
    let lx0 = d3.scaleTime()
        .domain([new Date(2020, 0, 1), new Date(2020, 11, 31)])
        .range([0, lWidth])
    
    let ly0 = d3.scaleLinear()
        .domain([275, 420])
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

    
    lsvg.append('g')
        .attr('class', 'lXAxis')
        .attr('transform', 'translate(0, ' + (lHeight + 12) + ')')
        .call(lXAxis)
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text')
        .attr('dx', '2.8em'))
    
    lsvg.append('g')
        .attr('class', 'lXAxis')
        .call(lYAxis)
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text') // move labels right
        .attr('dx', '0.5em'))


    // define line funciton
    let lineGraphLine = d3.line()
        .x(d => lx0(Date.parse(d.date))) // maybe map here
        .y(d => ly0(d.ppm))


    var year = lsvg.selectAll('.year')
        .data(data)
    .enter() // apply g path to each year
        .append('g')
        .attr('class', function(d,i) {return "year_" + d.year}); // add custom year for voronoi

    year.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { return lineGraphLine(d.values); })
        .attr('fill', 'none')
        .style('stroke', '#9c9c9c')
           
    // initiate voronoi
    var voronoi = d3.voronoi()
        .x(function(d) { return lx0(Date.parse(d.date))})
        .y(function(d) { return ly0(d.ppm)})
        .extent([0,0], [lWidth, lHeight]);

    // create the grid
    lsvg.selectAll('path')
        .data(voronoi(data))
        .enter().append('path')
        .attr('d', (function(d, i) { return 'M' + d.join('l') + 'Z'; }))
        .datum(function(d, i) { return d.point; })
        .attr("class", function(d,i) { return "voronoi " + d.year; })
         //.style("stroke", "#2074A0") //If you want to look at the cells
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", showTooltip)
        .on("mouseout",  removeTooltip);

    function showTooltip(d) {
        console.log('suh')
            $(this).popover({
                placement: 'auto top', //place the tooltip above the item
                container: '#chart', //the name (class or id) of the container
                trigger: 'manual',
                html : true,
                content: function() { return d.year; } //the content inside the tooltip
            });
            $(this).popover('show');
        }
    
    function removeTooltip() {
            //Hide the tooltip
            $('.popover').each(function() {
                $(this).remove();
            });
        }

    
}


