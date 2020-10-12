var PADDING = 0
var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;
var lineChartWidth = document.querySelector('.rightColumn').offsetWidth;
var lineGraphHeight = document.querySelector('.lineGraphContainer').offsetHeight - PADDING  
console.log()

let lMargin = {top: 100, right: 50, bottom:10, left: 20},
    lWidth = lineChartWidth - lMargin.left - lMargin.right,
    lHeight = lineGraphHeight - lMargin.top - lMargin.bottom;




function plotLineGraph() {
    let ly0 = d3.scaleLinear()
        .range([lHeight, 0]);

    

    let lYAxis = d3.axisLeft()
        .scale(ly0)

    const lsvg = d3.select(".lineGraphContainer").append("svg")
        .attr('width', lWidth + lMargin.left + lMargin.right)
        .attr('height', lHeight + lMargin.top + lMargin.bottom)
        .append('g')
        .attr('transform', 'translate(' + lMargin.left + ',' + lMargin.top + ')');


    ly0.domain([200, 400]);
    
   
    lsvg.append('g')
        .attr('class', 'yaxis_linegraph')
        .call(lYAxis)
        .selectAll('text')
        .attr('dx', '3em')
        .selectAll('line')
        .style('display', 'none')

    
    
}


