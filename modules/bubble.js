
let bMargin = {top: 20, right: 0, bottom:20, left: 0},
bHeight = BUBBLE_HEIGHT - bMargin.top - bMargin.bottom,
bWidth = LEFT_CHARTS_WIDTH //- bMargin.left - bMargin.right,


    
// console.log('bubble', bHeight)

// pack x circles into a container
// 352 data point

// NEED TO ADD VERSION THAT SCALES WITH ADDED YEARS
var xCell = (bWidth ) / 8;
var yCell = (bHeight ) / 44;


// define function to generate position for given datapoint
function generatePos(index) {
    var firstPos = {x:0, y: yCell*43};

    if(!index) return firstPos;
    

    // index 1 = go -1 in x direction and 0 in y
    var nColumn = index % 8
    var nRow = Math.floor(index / 8)
    
    
    return {
        x: firstPos.x + (nColumn * xCell),
        y: firstPos.y - (nRow * yCell) 
    }

}

// Build color scale


function plotTile(data) {
    // append svg
    const bsvg = d3.select('.bubbleContainer').append('svg')
        .attr('class', 'bsvg')
        .attr('width', bWidth  )
        .attr('height', bHeight + bMargin.top + bMargin.bottom)
        .attr('transform', 'translate(' + bMargin.left + ',' + bMargin.top + ')')

    var color = d3.scaleLinear()
        .domain([d3.min(data.map(x => x.avgppm)), d3.max(data.map(x => x.avgppm))])
        .range(['rgba(255, 105, 97, 0.5)', 'rgba(255, 105, 97, 1)'])
// red = 'rgba(255, 105, 97, 1)', rgb(58,58,71) black
    // append rect and enter data
    bsvg.selectAll('rect')
        .data(data)
            .enter()
        .append('rect')
        .style('opacity', 1)
        .attr('width', xCell)
        .attr('height', yCell)
        .attr('x', function(d, i) { return generatePos(i).x })
        .attr('y', function(d, i) { return generatePos(i).y })
        .attr('d', d=> d.avgppm)
        .style('fill', function(d) { return color(d.avgppm) })
        .attr('class', function(d) { return 'tile' + d.year})
        .attr("rx", 2)
        .attr("ry", 2)
        .on('mouseover', bmouseover)
        .on('mouseout', bmouseout)
        
        // .transition()
        // .delay(function(_, i) {
        //     return i * 10
        // })
        // .style('opacity', 1)

    function bmouseover() {
        // define initial colour
        var fill = d3.select(this).style('fill');

        // define linegraph line class and apply respective tile colour
        var lClass =  d3.select(this).attr('class').substring(4)
        
        d3.selectAll('.year_line')
            .style('opacity', function(d) {
                return d.year == lClass ? 1 : 0.3  })
            .style('stroke', function(d) {
                return d.year == lClass ? fill : '#F4F1F1' })
            .style('stroke-width', function(d) {
                return d.year == lClass ? '3px' : '1px' })

        d3.selectAll('.lg_ytext')
                .style('opacity', 0.3) // fade y ticks

        d3.select('.db_ytext')
                .text(lClass) // year to dashboard
        
        
        
    } 

    function bmouseout() {
        d3.selectAll('.year_line')
            .style('opacity', 1)
            .style('stroke', '#F4F1F1')
            .style('stroke-width', '1px')

        d3.selectAll('.lg_ytext')
            .style('opacity', 1)

        d3.select('.db_ytext')
            .text('') // remove text
    }


}







