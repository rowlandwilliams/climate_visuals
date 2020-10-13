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
        .x(d => lx0(Date.parse(d.date))) 
        .y(d => ly0(d.ppm))

    // define voronoi function
    // initiate voronoi
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
        .style('stroke', '#9c9c9c')
     
        
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
        // var test = '.year_' + d.data.date.substr(0,4)
        // //test = test.getFullYear();
        // console.log(test)
        // console.log(d3.selectAll(test))
        // d3.selectAll('.year_' + d.data.date.substr(0,4)).classed('year--hover', true);
        //d.data.ppm.parentNode.appendChild(d.data.ppm);
        focus.attr("transform", "translate(" + lx0(Date.parse(d.data.date)) + "," + ly0(d.data.ppm) + ")");
        focus.select("text").text(d.data.ppm + ' PPM');

    }

    function mouseout(d) {
        d3.selectAll('.year_' + d.data.date.substr(0,4)).classed('year--hover', false);

        focus.attr("transform", "translate(-100,-100)");
      }
    
    });
    
}


