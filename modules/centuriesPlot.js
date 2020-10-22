let cMargin = {top: 20, right: 30, bottom:20, left: 30},

cWidth = CENTCONT_WIDTH - cMargin.right - cMargin.left// initially make width / height equal to container width
cHeight = CENTCONT_HEIGHT - cMargin.top - cMargin.bottom

var csvg = d3.select(".centuriesContainer").append("svg")
        .attr('width', cWidth) // could add padding here
        .attr('height', cHeight)
        .attr('viewBox', [0, 0, cWidth, cHeight])
        .attr('class', 'centSVG')
        .attr('transform', 'translate(' + cMargin.left + ',' + cMargin.top + ')')



function plotCenturies() {
    //colour scale 
    console.log(global.centuries.map(x => x.changepc))
    
    var colorScale = d3.scaleLinear()
        .domain([d3.min(global.centuries.map(x => x.changepc)), d3.max(global.centuries.map(x => x.changepc))])
        .range(['rgba(255, 105, 97, 0.1)', 'rgba(255, 105, 97, 1)'])
    
    var data = {
        'children': global.centuries.reverse()
    }
    console.log(data)
    
    const treeMapLayout = d3.treemap()
                        .size([cWidth, cHeight])

    const root = d3.hierarchy(data);
    
    root.sum(d => d.changepc)
        .sort((a,b) => a.changepc - b.changepc)

    treeMapLayout(root)
    console.log(root.leaves())
    
    csvg.selectAll('rect')
        .data(root.leaves())
            .enter()
        .append('rect')
        .attr('class', d=> 'cent' + d.data.century)
        .attr('x', d=>d.x0)
        .attr('y', d=>d.y0)
        .attr("width",  d=>d.x1 - d.x0)
        .attr("height", d=>d.y1 - d.y0)
        .attr("fill", function(d) { return colorScale(d.data.changepc) })
        .attr("rx", 2)
        .attr("ry", 2)
        // .attr('stroke', 'black')
        .on('click', d => updateLineGraph(d.data.century))

    csvg.selectAll('text')
        .data(root.leaves())
        .enter()
        .append('text')
            .attr('x', d=>d.x0+5)
            .attr('y', d=> d.y0+20)
            .text(function(d) { return d.data.century })
            .attr('font-size', '20px')
            .attr('stroke', 'black')

}

