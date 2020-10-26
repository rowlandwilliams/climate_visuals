
let bMargin = {top: 0, right: 0, bottom:20, left: 0},
bHeight = BUBBLE_HEIGHT //- bMargin.top - bMargin.bottom,
bWidth = LEFT_CHARTS_WIDTH //- bMargin.left - bMargin.right,


    
// console.log('bubble', bHeight)

// pack x circles into a container
// 352 data point
// 254 from 1500, 250 from 1520

// NEED TO ADD VERSION THAT SCALES WITH ADDED YEARS
var xCell = (bWidth ) / 5;
var yCell = (bHeight ) / 50;


// define function to generate position for given datapoint
function generatePos(index) {
    var firstPos = {x:0, y: yCell*49};

    if(!index) return firstPos;
    

    // index 1 = go -1 in x direction and 0 in y
    var nColumn = index % 5
    var nRow = Math.floor(index / 5)
    
    
    return {
        x: firstPos.x + (nColumn * xCell),
        y: firstPos.y - (nRow * yCell) 
    }

}




function plotTile() {
    // append svg
    const bsvg = d3.select('.bubbleContainer').append('svg')
        .attr('class', 'bsvg')
        .attr('width', bWidth  )
        .attr('height', bHeight)// + bMargin.top + bMargin.bottom)
        .attr('transform', 'translate(' + bMargin.left + ',' + bMargin.top + ')')

    var color = d3.scaleLinear()
        .domain([d3.min(global.bubble.map(x => x.avgppm)), d3.max(global.bubble.map(x => x.avgppm))])
        .range(['rgba(32, 32, 32, 0.5)', 'rgba(32, 32, 32, 1)'])

        
        //.range(['rgba(255, 105, 97, 0.5)', 'rgba(255, 105, 97, 1)'])

    bsvg.selectAll('rect')
        .data(global.bubble)
            .enter()
        .append('rect')
        .style('opacity', 1)
        .attr('width', xCell)
        .attr('height', yCell)
        .attr('x', function(d, i) { return generatePos(i).x })
        .attr('y', function(d, i) { return generatePos(i).y })
        .attr('d', d=> d.avgppm)
        .style('fill', function(d) { return color(d.avgppm) })
        .style('stroke', '#909089')
        .style('stroke-width', '7')
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

    

}


function bmouseover() {
    // define initial colour
    
    // var fill = d3.select(this).style('fill');
    d3.select(this)
        .style('fill', '#FF6666')
    // define linegraph line class and apply respective tile colour
    var year =  d3.select(this).attr('class').substring(4)
    
    d3.selectAll('.y-line')
        .style('opacity', function(d) {
            return d.year == year ? 1 : 0.3  })
        .style('stroke', function(d) {
            return d.year == year ? '#FF6666' : '#202020' })
        .style('stroke-width', function(d) {
            return d.year == year ? '3px' : '1px' })



    d3.selectAll('.lg_ytext')
            .style('opacity', 0.3) // fade y ticks

    d3.select('.db_ytext')
            .text(year) // year to dashboard
    
    d3.select('.db_ppmtext')
            .text(d3.select(this).attr('d') + ' PPM')
    d3.select('.db_yaverage')
            .text('(yearly average)')

    d3.selectAll('.db_ticker')
            .style('opacity', 1)

    d3.select('.ppm_change')
            .text( Math.round(d3.select('.latest_ppm').text() - d3.select(this).attr('d')) + ' PPM')

    d3.selectAll('.lX_text')
            .style('opacity', 0.3)

    // add text to end of lin
    var length = d3.select('#y' + year).node().getTotalLength()
    var end = d3.select('#y' + year).node().getPointAtLength(length) // get point at end of selected line
    var tH = d3.select('.db_text').node().getBoundingClientRect() // tooltip height
    var lowest = d3.select('#y1620').node().getBoundingClientRect() // lowest line 1620
    // if end of line plus tooltip is furthr than lowest line reposition tooltip to other side of line
    if (end.y + tH.y > lowest.y) {
        var textPos = end.y - tH.height
    }
    else {
        var textPos = end.y
    }


    d3.select('.db_text')
                .transition()
                .duration(200)
                // .style('left', pos2.x - 12 + 'px') // position x in line with dashboard text
                .style('top', textPos + 'px')//- (tH.height / 2) + 'px') // position y realtive to end of line
    
    d3.select('.currentLine3')
            .attr('y2', end.y + 'px')
    
} 

function bmouseout() {
    var color = d3.scaleLinear()
        .domain([d3.min(global.bubble.map(x => x.avgppm)), d3.max(global.bubble.map(x => x.avgppm))])
        .range(['rgba(32, 32, 32, 0.5)', 'rgba(32, 32, 32, 1)'])

    d3.select(this)
        .style('opacity', 1)
        .style('fill', function(d) { return color(d.avgppm) })
    
    d3.selectAll('.y-line')
        .style('opacity', 1)
        .style('stroke', '#202020')
        .style('stroke-width', '1px')

    d3.selectAll('.lg_ytext')
        .style('opacity', 1)

    d3.selectAll('.db_ticker')
        .style('opacity', 0)  

    d3.selectAll('.db_ytext, .db_ppmtext, .db_yaverage, .ppm_change')
        .text('') // remove text


    // d3.select('.ppm_change')
    //     .text(' ')

    d3.selectAll('.lX_text')
        .style('opacity', 0.8)

    var pos = d3.select('.db_current').node().getBoundingClientRect()
    
    d3.select('.currentLine3')
        .attr('y2', pos.y + pos.height)

}