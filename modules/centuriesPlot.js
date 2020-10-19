let cMargin = {top: 20, right: 30, bottom:20, left: 30},

cWidth = CENTCONT_WIDTH - cMargin.right - cMargin.left// initially make width / height equal to container width
cHeight = CENTCONT_HEIGHT - cMargin.top - cMargin.bottom

var csvg = d3.select(".centuriesContainer").append("svg")
        .attr('width', cWidth) // could add padding here
        .attr('height', cHeight)
        .attr('viewBox', [0, 0, cWidth, cHeight])
        .attr('class', 'centSVG')
        .attr('transform', 'translate(' + cMargin.left + ',' + cMargin.top + ')')

function plotCenturies(data) {
    //const root = treemap(data);
    // data.sort((a,b) => b.changepc - a.changepc)
    // console.log(data)
    // add up data before 17 century inc.
    var obj = [{
        'century': 'rest',
        'changepc': 0
     }]

    for (var i=0; i<data.length; i++) {
        if(data[i].century < 18) {
            var sum = obj.filter(x=>x.century = 'rest')[0].changepc = data[i].changepc
            var pc = data[i].changepc
            
            obj.filter(x=>x.century = 'rest')[0].changepc = sum +pc
            console.log(obj.filter(x=>x.century = 'rest')[0].changepc)
        } 
        else {
            var temp = {
                'century': data[i].century,
                'changepc': data[i].changepc
            }
            obj.push(temp) 
        }
    }


    console.log(obj);

    //console.log(test)
    var data = {
        'children': obj.reverse()
    }

    

    

    const treeMapLayout = d3.treemap()
                        .size([cWidth, cHeight])


    const root = d3.hierarchy(data);
    
    root.sum(d => d.changepc)
        .sort((a,b) => a.changepc - b.changepc)

    treeMapLayout(root)
    
    csvg.selectAll('rect')
        .data(root.leaves())
            .enter()
        .append('rect')
        .attr('x', d=>d.x0)
        .attr('y', d=>d.y0)
        .attr("width",  d=>d.x1 - d.x0)
        .attr("height", d=>d.y1 - d.y0)
        .attr("fill", "#5AB7A9")
        .attr('stroke', 'black')




}