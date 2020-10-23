let cMargin = {top: 100, right: 30, bottom:20, left: 30},

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
    var colorScale = d3.scaleLinear()
        .domain([d3.min(global.centuries.map(x => x.changepc)), d3.max(global.centuries.map(x => x.changepc))])
        .range(['rgba(255, 105, 97, 0.1)', 'rgba(255, 105, 97, 1)'])
    
    var data = global.centuries
    // 
    var cY = d3.scaleBand()
            .range([cHeight, 0])
            .padding(0.5)
            .domain(data.map(x => x.century))
    
    var cX = d3.scaleLinear()
            .range([0, cWidth])
            .domain([0, 60])//d3.max(data.map(x => x.changepc))]);


    csvg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => cX(d.century))
        .attr('y', d => cY(d.changepc))
        .attr('height', d => cHeight - cY(d.changepc))
        .attr('width', cX.bandwidth())
        .attr("fill", function(d) { return colorScale(d.changepc) })
        .on('click', d => updateLineGraph(d.century))

    csvg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'bars-text')
        .attr('x', d => cX(d.century))
        .attr('y', d => cY(d.changepc))
        .text(d => d.century)
        .attr('stroke', 'white')
        .on('click', d => updateLineGraph(d.century))
    
    csvg.append('g')
        .attr('class', 'cXAxis')
        .attr('transform', 'translate(0,' + cHeight + ')')
        .call(d3.axisBottom(cX))

    csvg.append('g')
        .attr('class', 'cYAxis')
        .call(d3.axisLeft(cY))



}

function cmouseover() {
    var id = d3.select(this).attr('class')
    d3.select('.century')
}

//var data = {
    //     'children': global.centuries.reverse()
    // }
    // console.log(data)
    
    // const treeMapLayout = d3.treemap()
    //                     .size([cWidth, cHeight])

    // const root = d3.hierarchy(data);
    
    // root.sum(d => d.changepc)
    //     .sort((a,b) => a.changepc - b.changepc)

    // treeMapLayout(root)
    // console.log(root.leaves())
    
    // csvg.selectAll('rect')
    //     .data(root.leaves())
    //         .enter()
    //     .append('rect')
    //     .attr('class', d=> d.data.century)
    //     .attr('x', d=>d.x0)
    //     .attr('y', d=>d.y0)
    //     .attr("width",  d=>((d.x1 - d.x0)))
    //     .attr("height", d=>((d.y1 - d.y0)))
    //     .attr("fill", function(d) { return colorScale(d.data.changepc) })
    //     // .style('stroke', '#202020')
    //     // .style('stroke-width', '10')
    //     .attr("rx", 5)
    //     .attr("ry", 5)
    //     // .attr('stroke', 'black')
    //     .on('click', d => updateLineGraph(d.data.century))
    //     .on('mouseover', cmouseover)

    // csvg.selectAll('text')
    //     .data(root.leaves())
    //     .enter()
    //     .append('text')
    //         .attr('x', d=>d.x0+5)
    //         .attr('y', d=> d.y0+20)
    //         .text(function(d) { return d.data.century })
    //         .attr('font-size', '20px')
    //         .attr('stroke', 'black')
