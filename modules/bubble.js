// define plot dimenstions
var bubbleChartWidth = document.querySelector('.leftColumn').offsetWidth -50;
var bubbleChartHeight = document.querySelector('.bubbleContainer').offsetHeight -50//- PADDING;  

let bMargin = {top: 20, right: 20, bottom:-20, left: 20},
    bWidth = bubbleChartWidth - bMargin.left - bMargin.right,
    bHeight = bubbleChartHeight - bMargin.top - bMargin.bottom;


// pack x circles into a container
// 352 data point
var xCell = (bWidth + bMargin.left + bMargin.right) / 22;
var yCell = (bHeight + bMargin.top + bMargin.bottom) / 16;
var bubbleRadius = Math.min(xCell, yCell) / 2;


// append svg
const bsvg = d3.select('.bubbleContainer').append('svg')
    .attr('class', 'bsvg')
    .attr('width', bWidth )
    .attr('height', bHeight )
    .attr('transform', 'translate(' + bMargin.left + ',' + bMargin.top + ')');

   
var rect = bsvg.append('g')
                .attr('class', 'rect')

for (var i=0; i<16; i++) {
    for (var j=0; j<22; j++) {
    rect.append('rect')
    .attr('width', bubbleRadius)
    .attr('height', bubbleRadius)
    .attr('x', xCell / 2 + (xCell * j) + 'px')
    .attr('y', ((yCell / 2) + (yCell*i)) + 'px')
    }
}





