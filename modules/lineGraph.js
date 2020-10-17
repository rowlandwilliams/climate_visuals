// define dimensions for line graph
var PADDING = 30 // PADDING FROM TOP
//var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;
var lineContainerWidth = document.querySelector('.middleColumn').offsetWidth;
var lineContainerHeight = document.querySelector('.middleColumn').offsetHeight - PADDING;  

let lMargin = {top: 50, right: 20, bottom:0, left: 40},
    lWidth = lineContainerWidth - lMargin.left - lMargin.right,
    lHeight = lineContainerHeight - lMargin.top - lMargin.bottom;


let lx0 = d3.scaleTime()
    .domain([new Date(2020, 0, 1), new Date(2020, 11, 31)])
    .range([0, lWidth])

let ly0 = d3.scaleLinear()
    .domain([274, 415])
    .range([lHeight, 0]);

let lXAxis = d3.axisBottom()
    .scale(lx0)
    .tickFormat(d3.timeFormat('%b'))

console.log(new Date(2020, 0, 1))
// define line funciton
let lineGraphLine = d3.line()
    .x(d => lx0(Date.parse(d.date))) 
    .y(d => ly0(d.ppm))

// define voronoi function
var voronoi = d3.voronoi()
    .x(function(d) { return lx0(Date.parse(d.date)) })//+ Math.random() -0.5})
    .y(function(d) { return ly0(d.ppm) })//+ Math.random() -0.5})
    // .extent([0, 0], [lWidth, lHeight]); // work on this

// plot initial line graph // min ppm 275.3 in1620
function plotLineGraph(data) {
    


    let lYAxis = d3.axisLeft()
        .scale(ly0)

    var lsvg = d3.select(".lineGraphContainer").append("svg")
        .attr('width', lWidth)
        .attr('height', lHeight)
        .append('g')
        .attr('transform', 'translate(' + lMargin.left + ',' + lMargin.top + ')');

    
    lsvg.append('g')
        .attr('class', 'lXAxis')
        .attr('transform', 'translate(0, ' + (lHeight -10) + ')')
        .call(lXAxis)
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text')
        .attr('dx', '2.8em'))
        
    
    lsvg.append('g')
        .attr('class', 'lYAxis')
        .call(lYAxis)
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text') // move labels right
        .attr('dx', '0.5em'))
        .attr('class', 'lg_ytext')
        .attr('stroke', '#F4F1F1')


    var year = lsvg.append('g')
        .attr('class', 'year_lines')


    year.selectAll('.year_line')    
        .data(data)
    .enter() // apply path to each year
        .append('path')
        .attr('class', 'year_line')
        .attr('id', function(d,i) {return "year_" + d.year})
        //.attr('id', 'lgline')
        .attr('d', function(d) { return lineGraphLine(d.values); })
        .attr('fill', 'none')
        .style('stroke', '#F4F1F1')
        .style('stroke-width', 1)
     
        
     
        
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
    //test.forEach(year => year.values.forEach(value => value.year = year.year))
    

    var v = voronoi(d3.merge(data.map(x => x.values)))
    

    var voronoiGroup = lsvg.append("g")
      .attr("class", "voronoi");

     
    voronoiGroup.selectAll('path')
        .data(v.polygons())
        .enter().append('path')
            .attr('d', function(d) { return d ? "M" + d.join("L") + "Z" : null; })
            //.attr('class', function(d) { return d.data.year })

    // add tooltip 
    var site = null;
    const radius = 100

    lsvg
        .on("mousemove", function() {
        var mouse = d3.mouse(this);
        var newsite = v.find(mouse[0], mouse[1], radius); // match mouse position to voroni grid
        if (newsite !== site) {
            if (site) mouseout(site);
            site = newsite;
            if (site) mouseover(site);
        }})
        .on('click', updateLineGraph)

    
    
    
    function mouseover(d) {
        console.log(d.data)
        focus.attr("transform", "translate(" + lx0(Date.parse(d.data.date)) + "," + ly0(d.data.ppm) + ")");
        focus.select("text").text(d.data.ppm + ' PPM');
        d3.select('.db_ytext')
            .text(d.data.year)

    }

    function mouseout(d) {
        d3.selectAll('.year_' + d.data.date.substr(0,4)).classed('year--hover', false);
        focus.attr("transform", "translate(-100,-100)");
        d3.select('.db_ytext')
            .text('')

    }

    lsvg.on('click', updateLineGraph)

    function updateLineGraph(data) {
        // define new axis
        let ly1 = d3.scaleLinear()
            .domain([350, 420])
            .range([lHeight, 0]);

        let lYAxis = d3.axisLeft()
            .scale(ly1)

        

        // remove previous axis and lines/text and append new one
        d3.select('.lineGraphContainer svg').remove()


        var lsvg = d3.select(".lineGraphContainer").append("svg")
            .attr('width', lWidth)
            .attr('height', lHeight)
            .append('g')
            .attr('transform', 'translate(' + lMargin.left + ',' + lMargin.top + ')');

        
        lsvg.append('g')
            .attr('class', 'lXAxis')
            .attr('transform', 'translate(0, ' + (lHeight -10) + ')')
            .call(lXAxis)
            .call(g => g.selectAll(".domain, line") // remove axis line and ticks
            .remove())
            .call(g => g.selectAll('text')
            .attr('dx', '2.8em'))

        lsvg.append('g')
            .attr('class', 'lYAxis')
            .call(lYAxis)
            .call(g => g.selectAll(".domain, line") // remove axis line and ticks
            .remove())
            .call(g => g.selectAll('text') // move labels right
            .attr('dx', '0.5em'))
            .attr('class', 'lg_ytext')
            .attr('stroke', '#F4F1F1')

        var year = lsvg.append('g')
            .attr('class', 'year_lines')
    
    
        year.selectAll('.year_line')    
            .data([data])
        .enter() // apply path to each year
            .append('path')
            .attr('class', 'year_line')
            .attr('id', function(d,i) {console.log(d); return "year_" + d.year})
            //.attr('id', 'lgline')
            .attr('d', function(d) { return lineGraphLine(d.values); })
            .attr('fill', 'none')
            .style('stroke', '#F4F1F1')
            .style('stroke-width', 1)
    }
    
}


