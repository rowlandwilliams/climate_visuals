// define dimensions for line graph
var PADDING = 0 // PADDING FROM TOP
//var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;
var lineContainerWidth = document.querySelector('.lineGraphContainer').offsetWidth;
var lineContainerHeight = document.querySelector('.lineGraphContainer').offsetHeight - PADDING;  

let lMargin = {top: 40, right: 20, bottom:30, left: 40},
    lWidth = lineContainerWidth - lMargin.left - lMargin.right,
    lHeight = lineContainerHeight - lMargin.bottom;



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
        .attr('width', lWidth)
        .attr('height', lHeight)
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
        .x(d => lx0(Date.parse(d.date))) 
        .y(d => ly0(d.ppm))

    // define voronoi function
    var voronoi = d3.voronoi()
        .x(function(d) { return lx0(Date.parse(d.date)) + Math.random() -0.5})
        .y(function(d) { return ly0(d.ppm) + Math.random() -0.5})
        //.extent([0, 0], [lWidth, lHeight]); // work on this


    var year = lsvg.selectAll('.year')
        .data(data)
    .enter() // apply g path to each year
        .append('g')
        .attr('class', function(d,i) {return "line_" + d.year}); // add custom year for voronoi

    year.append('path')
        .attr('class', function(d,i) {return "year_" + d.year})
        .attr('d', function(d) { d.line = this; return lineGraphLine(d.values); })
        .attr('fill', 'none')
        .style('stroke', '#F4F1F1')
     
        
    // add focus to hover over grid
    var focus = lsvg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(-100,-100)");

    focus.append("circle")
        .attr("fill", "white")
        .attr("class", "notation")
        .attr("stroke-width", "1.5")
        .attr("r", 5);

    focus.append("text")
        .attr('text-anchor', 'middle')
        .attr("class", "tt_year");

    // define voronoi grid
    var v = voronoi(d3.merge(data.map(x => x.values)))
    

    var voronoiGroup = lsvg.append("g")
      .attr("class", "voronoi");

    voronoiGroup.selectAll('path')
        .data(v.polygons())
        .enter().append('path')
            .attr('d', function(d) { return d ? "M" + d.join("L") + "Z" : null; })
            

    // add tooltip 
    var site = null;
    const radius = 100

    lsvg.on("mousemove", function() {
        var mouse = d3.mouse(this);
        var newsite = v.find(mouse[0], mouse[1], radius); // match mouse position to voroni grid
        if (newsite !== site) {
            if (site) mouseout(site);
            site = newsite;
            if (site) mouseover(site);
        }

    function mouseover(d) {
        
        focus.attr("transform", "translate(" + lx0(Date.parse(d.data.date)) + "," + ly0(d.data.ppm) + ")");
        focus.select("text").text(d.data.ppm + ' PPM');

    }

    function mouseout(d) {
        d3.selectAll('.year_' + d.data.date.substr(0,4)).classed('year--hover', false);

        focus.attr("transform", "translate(-100,-100)");
      }
    
    });

    // grab 2020 line position and append tooltip
    //var lineContainer = d3.select('.lineGraphContainer').node().getBoundingClientRect();
    var line2020 = d3.select('.line_2020').node().getBoundingClientRect();

    //var boxWidth = 
    var ltooltip = d3.select('body').append('div')
        .attr('class', 'latest-tooltip')
        .style('opacity', 1)

    // // define right padding
    // var rightPadding = document.querySelector('.rightColumn')
    // //var rightPadding = rightPadding.currentStyle
    // console.log(window.getComputedStyle(rightPadding).getPropertyValue('padding-right')) 
    
    ltooltip
        .html('suhdude')
        .style('left', line2020.x + line2020.width + 'px') //30 = paddingf
        .style('top', window.pageYOffset + line2020.y - lMargin.top + 'px')
        .style('height', lMargin.top + 'px')
    
    
    
}


