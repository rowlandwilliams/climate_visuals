// define plot dimenstions
var bubbleChartWidth = document.querySelector('.leftColumn').offsetWidth;
var bubbleChartHeight = document.querySelector('.bubbleContainer').offsetHeight //- PADDING;  

let bMargin = {top: 0, right: 20, bottom:0, left: 20},
    bWidth = bubbleChartWidth - bMargin.left - bMargin.right,
    bHeight = bubbleChartHeight - bMargin.top - bMargin.bottom;

// try circle packing











// define bubble chart     
function bubbleChart(data) {
    var test = Array.from({length: 20}, () => ({r: 10 + Math.random() * 10}))
    console.log(test);
    
    
    // location to centre bubbles
    const centre = { x: bubbleChartWidth / 2, y: bubbleChartHeight / 2};

    // strength to apply position forces
    const forceStrength = 0.03;

    // initialise variables
    let bsvg = null;
    let bubbles = null;
    //let labels = null;
    let nodes = [];

    // charge dependent on size of bubble
    function charge(d) {
        return Math.pow(d.radius, 1.0) * 0.01
    }

    // create force simulation and add forces
    const simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(charge))
        .force('x', d3.forceX().strength(forceStrength).x(centre.x))
        .force('y', d3.forceY().strength(forceStrength).y(centre.y))
        .force('collision', d3.forceCollide().radius(d => d.radius + 1));

    // force simulation starts up automatically, which we don't want as there aren't any nodes yet
    simulation.stop();


    // reformat data
    function createNodes(data) {
        const maxSize = d3.max(data, d => d.avgppm);
        const minSize = d3.min(data, d => d.avgppm);
    
        // size bubbles based on area
        const radiusScale = d3.scaleSqrt()
          .domain([minSize, maxSize]) // domain to set circle of a given circle 
          .range([5, 20]) // min / maximum radius size 
    
        // map raw data to node data
        const nodes = data.map(d => ({
            'radius': radiusScale(d.avgppm),
            'ppm': d.avgppm,
            'year': d.year,
            'x': Math.random(), //* 900,
            'y': Math.random() //* 800
        }))
    
        console.log(nodes)
        return nodes;
        
    
    }


    // raw data to nodes data
    nodes = createNodes(data);

    // add svg element to provided selector
    bsvg = d3.select('.bubbleContainer')
        .append('svg')
        .attr('width', bubbleChartWidth)
        .attr('height', bubbleChartHeight)

    // bind nodes data to circle elements
    const elements = bsvg.selectAll('.bubble')
        .data(nodes, d=> d.year)
        .enter()
        .append('g')

    //create the bubbles
    bubbles = elements
        .append("circle")
        .classed("bubble", true)
        .attr("r", d => d.radius)
        .attr('ppm', d=> d.ppm)
        // .attr("cx", function(d){ return d.x; })
        // .attr("cy", function(d){ return d.y; })
        .style("fill", 'black');

    function ticked() {
        bubbles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y) 
    }


    simulation.nodes(nodes)
        .on('tick', ticked)
        .restart();

    
    

}

