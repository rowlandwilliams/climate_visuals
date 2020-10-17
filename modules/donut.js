var PADDING = 0 // PADDING FROM TOP
var donutContainerWidth = document.querySelector('.donutContainer').offsetWidth;
var donutContainerHeight = document.querySelector('.donutContainer').offsetHeight - PADDING;  

let dMargin = {top: 0, right: 0, bottom:0, left: 0},
    dWidth = donutContainerWidth - dMargin.left - dMargin.right,
    dHeight = donutContainerHeight 

function plotDonut(data) {
    var radius = Math.min(dWidth, dHeight) / 2;

    var color = d3.scaleLinear()
        .domain([d3.min(data.map(x => x.changepc)), d3.max(data.map(x => x.changepc))])
        .range(['rgba(255, 105, 97, 0.5)', 'rgba(255, 105, 97, 1)'])

    var pie = d3.pie()
        .value(function(d) { return d.changepc; })
        .sort(null);

    console.log(pie);

    var arc = d3.arc()
        .innerRadius(radius - 50)
        .outerRadius(radius - 20);

    
    // append svg
    var dsvg = d3.select('.donutContainer')
            .append('svg')
            .attr('width', dWidth)
            .attr('height', dHeight)
            .attr('transform', 'translate(' + dMargin.left + ',' + dMargin.top + ')')

    var path = dsvg.datum(data).selectAll("path")
            .data(pie)
          .enter().append("path")
            //.attr('class', function(d, i) { return })
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", arc)
            .each(function(d) { this._current = d; }); // store the initial angles

    // default pie layout




}