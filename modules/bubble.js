// define plot dimenstions
var bubbleChartWidth = document.querySelector('.leftColumn').offsetWidth;
var bubbleChartHeight = document.querySelector('.bubbleContainer').offsetHeight //- PADDING;  

let bMargin = {top: 0, right: 20, bottom:0, left: 20},
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
    .attr('width', bWidth + bMargin.left + bMargin.right)
    .attr('height', bHeight + bMargin.top + bMargin.bottom)
   
var circle = bsvg.append('g')
                .attr('class', 'circle')

for (var i=0; i<16; i++) {
    for (var j=0; j<22; j++) {
    circle.append('circle')
    .attr('r', bubbleRadius*0.5)
    .attr('cx', xCell / 2 + (xCell * j) + 'px')
    .attr('cy', ((yCell / 2) + (yCell*i)) + 'px')
    }
}





