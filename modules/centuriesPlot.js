let cMargin = {top: 0, right: 30, bottom:20, left: 30},

cWidth = (CENTCONT_WIDTH * 0.4) - cMargin.right - cMargin.left// initially make width / height equal to container width
cHeight = CENTCONT_HEIGHT - cMargin.top - cMargin.bottom

var csvg = d3.select(".centuriesContainer").append("svg")
        .attr('width', cWidth) // could add padding here
        .attr('height', cHeight)
        .attr('viewBox', [0, 0, cWidth, cHeight])
        .attr('class', 'centSVG')
        .attr('transform', 'translate(' + (CENTCONT_WIDTH * 0.5) + ',' + cMargin.top + ')')



function plotCenturies() {
//colour scale 
    var colorScale = d3.scaleLinear()
        .domain([d3.min(global.centuries.map(x => x.changepc)), d3.max(global.centuries.map(x => x.changepc))])
        .range(['rgba(255, 105, 97, 0.1)', 'rgba(255, 105, 97, 1)'])

    var data = {
        'children': global.centuries.reverse()
    }

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var subgroups = d3.map(data, function(d){return(d.century)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, lWidth])
    //   .padding([0.2])
  
lsvg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([lHeight, 0 ]);
  ;svg.append("g")
    .call(d3.axisLeft(y));

  

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(century)
    (data)

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.group); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())



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
        .attr('class', d=> d.data.century)
        .attr('x', d=>d.x0)
        .attr('y', d=>d.y0)
        .attr("width",  d=>((d.x1 - d.x0)))
        .attr("height", d=>((d.y1 - d.y0)))
        .attr("fill", function(d) { return colorScale(d.data.changepc) })
        // .style('stroke', '#202020')
        // .style('stroke-width', '10')
        .attr("rx", 5)
        .attr("ry", 5)
        // .attr('stroke', 'black')
        .on('click', d => updateLineGraph(d.data.century))
        .on('mouseover', cmouseover)

    csvg.selectAll('text')
        .data(root.leaves())
        .enter()
        .append('text')
            .attr('x', d=>d.x0+5)
            .attr('y', d=> d.y0+20)
            .text(function(d) { return d.data.century })
            .attr('font-size', '20px')
            .attr('stroke', 'black')


    
    
    // var data = global.centuries
    // // 
    // var cY = d3.scaleBand()
    //         .range([cHeight, 0])
    //         .padding(0.5)
    //         .domain(data.map(x => x.century))
    
    // var cX = d3.scaleLinear()
    //         .range([0, cWidth])
    //         .domain([0, 60])//d3.max(data.map(x => x.changepc))]);


    // csvg.selectAll('.bar')
    //     .data(data)
    //     .enter()
    //     .append('rect')
    //     .attr('class', 'bar')
    //     .attr('x', d => cX(d.century))
    //     .attr('y', d => cY(d.changepc))
    //     .attr('height', d => cHeight - cY(d.changepc))
    //     .attr('width', cX.bandwidth())
    //     .attr("fill", function(d) { return colorScale(d.changepc) })
    //     .on('click', d => updateLineGraph(d.century))

    // csvg.selectAll('.label')
    //     .data(data)
    //     .enter()
    //     .append('text')
    //     .attr('class', 'bars-text')
    //     .attr('x', d => cX(d.century))
    //     .attr('y', d => cY(d.changepc))
    //     .text(d => d.century)
    //     .attr('stroke', 'white')
    //     .on('click', d => updateLineGraph(d.century))
    
    // csvg.append('g')
    //     .attr('class', 'cXAxis')
    //     .attr('transform', 'translate(0,' + cHeight + ')')
    //     .call(d3.axisBottom(cX))

    // csvg.append('g')
    //     .attr('class', 'cYAxis')
    //     .call(d3.axisLeft(cY))



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
