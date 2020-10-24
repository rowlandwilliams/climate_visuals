let cMargin = {top: 20, right: 30, bottom:20, left: 30},

cWidth = (CENTCONT_WIDTH * 0.4) - cMargin.right - cMargin.left// initially make width / height equal to container width
cHeight = CENTCONT_HEIGHT - cMargin.top - cMargin.bottom

var csvg = d3.select(".centuriesContainer").append("svg")
        .attr('width', cWidth) // could add padding here
        .attr('height', cHeight)
        .attr('viewBox', [0, 0, cWidth, cHeight])
        .attr('class', 'centSVG')
        .attr('transform', 'translate(' + (CENTCONT_WIDTH * 0.7) + ',' + cMargin.top + ')')



function plotCenturies() {
//colour scale 
    var colorScale = d3.scaleLinear()
        .domain([d3.min(global.centuries.map(x => x.changepc)), d3.max(global.centuries.map(x => x.changepc))])
        .range(['rgba(255, 105, 97, 0.1)', 'rgba(255, 105, 97, 1)'])

    var data =  global.centuries.reverse()
    
    
    var start = 0
    for (var i=0; i < data.length; i++) {
          
        data[i]['height'] = (data[i].changepc / 100) * cHeight;
            data[i].pos = start
            start = start + data[i].height
        }
        
   
    csvg.selectAll('rect')
        .data(data)
            .enter()
        .append('rect')
        .style('opacity', 1)
        .attr('width', cWidth)
        .attr('height', d => d.height)
        .attr('x', 0)
        .attr('y', d=>d.pos)
        .attr('d', d=> d.avgppm)
        .style('fill', function(d) { return colorScale(d.changepc) })
        .on('click', d => updateLineGraph(d.century))



}

function cmouseover() {
    var id = d3.select(this).attr('class')
    d3.select('.century')
}

