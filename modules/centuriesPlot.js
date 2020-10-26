let cMargin = {top: 20, right: 30, bottom:20, left: 30},

cWidth = (CENTCONT_WIDTH * 0.8) - cMargin.right - cMargin.left// initially make width / height equal to container width
cHeight = CENTCONT_HEIGHT - cMargin.top - cMargin.bottom

var csvg = d3.select(".centuriesContainer").append("svg")
        .attr('width', cWidth) // could add padding here
        .attr('height', cHeight)
        .attr('viewBox', [0, 0, cWidth, cHeight])
        .attr('class', 'centSVG')
        .attr('transform', 'translate(' + (CENTCONT_WIDTH * 0.3) + ',' + cMargin.top + ')')



function plotCenturies() {
//colour scale 
    var colorScale = d3.scaleLinear()
        .domain([d3.min(global.centuries.map(x => x.changepc)), d3.max(global.centuries.map(x => x.changepc))])
        .range(['rgba(32, 32, 32, 0.5)', 'rgba(32, 32, 32, 1)'])
        // .range(['rgba(255, 105, 97, 0.1)', 'rgba(255, 105, 97, 1)'])

    var data =  global.centuries.reverse()
    var labels = ['21st: ', '20th: ', '19th: ', '18th: ', '17th: '];
    var labelpos = [18,16,10,2,0]
    var start = 0
    for (var i=0; i < data.length; i++) {
          
        data[i]['height'] = (data[i].changepc / 100) * cHeight;
            data[i].pos = start
            start = start + data[i].height
            data[i].label = labels[i]
            data[i].labelpos = labelpos[i]
        }
        
   
    csvg.selectAll('rect')
        .data(data)
            .enter()
        .append('rect')
        .style('opacity', 1)
        .attr('class', d => d.century)
        .attr('width', cWidth * 0.4)
        .attr('height', d => (d.height - 2)) // gap between bars
        .attr('x', cWidth * 0.6)
        .attr('y', d=>d.pos)
        .attr('d', d=> d.avgppm)
        .style('fill', function(d) { return colorScale(d.changepc) })
        .on('click', d => updateLineGraph(d.century))
        .on('mouseover', cmouseover)
        .on('mouseout', cmouseout)

    csvg.selectAll('text')
        .data(data)
            .enter()
        .append('text')
        .style('opacity', 0)
        .attr('class', d => 'lab_' + d.century)
        .attr('x', cWidth * 0.1)
        .attr('y', d=>d.pos + d.labelpos)
        .text(d => d.label + (Math.round(d.changepc * 10) / 10) + '%')
        
    


}

function cmouseover() {
    d3.select(this).style('fill', red)
    var cent = d3.select(this).attr('class')
    d3.select('.lab_' + cent).style('opacity', 1)

}

function cmouseout() {
    var colorScale = d3.scaleLinear()
        .domain([d3.min(global.centuries.map(x => x.changepc)), d3.max(global.centuries.map(x => x.changepc))])
        .range(['rgba(32, 32, 32, 0.5)', 'rgba(32, 32, 32, 1)'])

    d3.select(this).style('fill', function(d) { return colorScale(d.changepc) })
    var cent = d3.select(this).attr('class')
    d3.select('.lab_' + cent).style('opacity', 0)
}
