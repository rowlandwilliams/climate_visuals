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


let  lYAxis = g => g
    .attr("transform", 'translate(' + lMargin.left +',0)')
    .call(d3.axisLeft(ly0))   


// define line funciton
let lineGraphLine = d3.line()
    .x(d => lx0(Date.parse(d.date))) 
    .y(d => ly0(d.ppm))

// define voronoi function
var voronoi = d3.voronoi()
    .x(function(d) { return lx0(Date.parse(d.date)) })//+ Math.random() -0.5})
    .y(function(d) { return ly0(d.ppm) })//+ Math.random() -0.5})
    // .extent([0, 0], [lWidth, lHeight]); // work on this

var test;

function update(data) {
    test = data  
}
  
// plot initial line graph // min ppm 275.3 in1620
function plotLineGraph(data) {
    var data = data.linegraph

    var lsvg = d3.select(".lineGraphContainer").append("svg")
        .attr('width', lWidth) // could add padding here
        .attr('height', lHeight)
        .attr('viewBox', [0, 0, lWidth, lHeight])
        // .attr('transform', 'translate(' + (lMargin.left) + ',' + (lMargin.top)  + ')')

    
    lsvg.append('g')
        .call(lXAxis)
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text')
        .attr('dx', '2.8em'))
        .attr('stroke', '#F4F1F1')
        
    
    lsvg.append('g')
        .call(lYAxis)
        // .attr('class', 'lYAxis')
        // .call(lYAxis)
        .call(g => g.selectAll(".domain, line") // remove axis line and ticks
        .remove())
        .call(g => g.selectAll('text') // move labels right
        .attr('dx', 'em'))
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
        
    
    

    var v = voronoi(d3.merge(data.map(x => x.values)))
    

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

    passData(data)
    
}

function passData(data) {
    updateLineGraph(data)
}

function updateLineGraph() {
    fetch(link)
        .then(response => response.json())
        .then(data => {
        
        
        
        plotLineGraph(data)
        
        
        
        
       
    })
        
      
}


