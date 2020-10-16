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
var bubbleRadius = Math.min(xCell, yCell) / 2;



// define function to generate position for given datapoint
function generatePos(index) {
    if(!index) return {x: 0, y: 0};
    
    var nthColumn = index % 8; // find column
    var nthRow = Math.floor(index / 8); // find row

    return {
        x: xCell * nthColumn,
        y: yCell * nthRow
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
        .attr('width', xCell)
        .attr('height', yCell)
        .attr('x', function(d, i) { return generatePos(i).x })
        .attr('y', function(d, i) { return generatePos(i).y })
        .attr('d', d=> d.avgppm)


}







