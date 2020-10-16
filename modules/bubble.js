// define plot dimenstions
var bubbleChartWidth = document.querySelector('.leftColumn').offsetWidth ; // removed padding to fill container
var bubbleChartHeight = document.querySelector('.bubbleContainer').offsetHeight //- PADDING;  

let bMargin = {top: 0, right: 0, bottom:0, left: 0},
    bWidth = bubbleChartWidth //- bMargin.left - bMargin.right,
    bHeight = bubbleChartHeight //- bMargin.top - bMargin.bottom;


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


function plotTile(data) {
    // append svg
    const bsvg = d3.select('.bubbleContainer').append('svg')
        .attr('class', 'bsvg')
        .attr('width', bWidth )
        .attr('height', bHeight )

    // append rect and enter data
    bsvg.selectAll('rect')
        .data(data)
            .enter()
        .append('rect')
        .style('opacity', 0)
        .attr('width', xCell)
        .attr('height', yCell)
        .attr('x', function(d, i) { return generatePos(i).x })
        .attr('y', function(d, i) { return generatePos(i).y })
        .attr('d', d=> d.avgppm)
        .attr('class', function(d) { return 'tile' + d.year})
        .transition()
        .delay(function(_, i) {
            return i * 10
        })
        .style('opacity', 1)

    


}







