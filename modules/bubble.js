// define plot dimenstions
var bubbleChartWidth = document.querySelector('.leftColumn').offsetWidth;
var bubbleChartHeight = document.querySelector('.bubbleContainer').offsetHeight //- PADDING;  

let bMargin = {top: 0, right: 20, bottom:0, left: 20},
    bWidth = bubbleChartWidth - bMargin.left - bMargin.right,
    bHeight = bubbleChartHeight - bMargin.top - bMargin.bottom;

// try circle packing
function createNodes(data) {
    const maxSize = d3.max(data, d => d.avgppm);
    const minSize = d3.min(data, d => d.avgppm);

    // size bubbles based on area
    const radiusScale = d3.scaleLinear()
      .domain([minSize, maxSize]) // domain to set circle of a given circle 
      .range([0, 100]) // min / maximum radius size 

    // map raw data to node data
    const nodes = data.map(d => ({
        'r': radiusScale(d.avgppm),
        'ppm': d.avgppm,
        'year': d.year,
        // 'x': Math.random(), //* 900,
        // 'y': Math.random() //* 800
    }))

    //console.log(nodes.map(x => x.r))
    return nodes;

}


// define circle bounds
function bounds(circles, pad = 50000) {
    const x0 = circles.reduce((v, {x, r}) => Math.min(v, x - r - pad), +Infinity);
    const x1 = circles.reduce((v, {x, r}) => Math.max(v, x + r + pad), -Infinity);
    const y0 = circles.reduce((v, {y, r}) => Math.min(v, y - r - pad), +Infinity);
    const y1 = circles.reduce((v, {y, r}) => Math.max(v, y + r + pad), -Infinity);
    return [x0, y0, x1 - x0, y1 - y0];
  }


function score(node) {
  const a = node._;
  const b = node.next._;
  const ab = a.r + b.r;
  const cx = (a.x * b.r + b.x * a.r) / ab;
  const cy = (a.y * b.r + b.y * a.r) / ab;
  return Math.max(Math.abs(cx * bubbleChartHeight), Math.abs(cy * bubbleChartWidth));
}

function scoreCircle(node) {
    const a = node._;
    const b = node.next._;
    const ab = a.r + b.r;
    const cx = (a.x * b.r + b.x * a.r) / ab;
    const cy = (a.y * b.r + b.y * a.r) / ab;
    return cx * cx + cy * cy;
}

function pack(circles) {
    const n = circles.length;
    if (!n) return circles;
  
    let a, b, c;
  
    // Place the first circle.
    a = circles[0], a.x = 0, a.y = 0;
    if (!(n > 1)) return circles;
  
    // Place the second circle.
    b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
    if (!(n > 2)) return circles;
  
    // Place the third circle.
    place(b, a, c = circles[2]);
  
    // Initialize the front-chain using the first three circles a, b and c.
    a = new Node(a), b = new Node(b), c = new Node(c);
    a.next = c.previous = b;
    b.next = a.previous = c;
    c.next = b.previous = a;
  
    // Attempt to place each remaining circle…
    pack: for (let i = 3; i < n; ++i) {
      place(a._, b._, c = circles[i]), c = new Node(c);
  
      // Find the closest intersecting circle on the front-chain, if any.
      // “Closeness” is determined by linear distance along the front-chain.
      // “Ahead” or “behind” is likewise determined by linear distance.
      let j = b.next, k = a.previous, sj = b._.r, sk = a._.r;
      do {
        if (sj <= sk) {
          if (intersects(j._, c._)) {
            b = j, a.next = b, b.previous = a, --i;
            continue pack;
          }
          sj += j._.r, j = j.next;
        } else {
          if (intersects(k._, c._)) {
            a = k, a.next = b, b.previous = a, --i;
            continue pack;
          }
          sk += k._.r, k = k.previous;
        }
      } while (j !== k.next);
  
      // Success! Insert the new circle c between a and b.
      c.previous = a, c.next = b, a.next = b.previous = b = c;
  
      // Compute the new closest circle pair to the centroid.
      let aa = score(a), ca;
      while ((c = c.next) !== b) {
        if ((ca = score(c)) < aa) {
          a = c, aa = ca;
        }
      }
      b = a.next;
    }
  
    return circles;
}

function place(b, a, c) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d2 = dx * dx + dy * dy;
    if (d2) {
      const a2 = (a.r + c.r) ** 2;
      const b2 = (b.r + c.r) ** 2;
      if (a2 > b2) {
        const x = (d2 + b2 - a2) / (2 * d2);
        const y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
        c.x = b.x - x * dx - y * dy;
        c.y = b.y - x * dy + y * dx;
      } else {
        const x = (d2 + a2 - b2) / (2 * d2);
        const y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
        c.x = a.x + x * dx - y * dy;
        c.y = a.y + x * dy + y * dx;
      }
    } else {
      c.x = a.x + c.r;
      c.y = a.y;
    }
  }

function intersects(a, b) {
  const dr = a.r + b.r - 1e-6;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

class Node {
    constructor(circle) {
      this._ = circle;
      this.next = null;
      this.previous = null;
    }
  }

// define pack function
// define initial circles
//nodes = create
// const circles = pack(nodes)
// console.log(circles)

function plotBubble(circles) {
    
    
    const bsvg = d3.select('.bubbleContainer').append('svg')
    .attr('width', bubbleChartWidth)
    .attr('height', bubbleChartHeight)
    .attr('viewBox', bounds(circles, 1).join())

    // bsvg.append('g')
    // .attr('fill', 'none')
    // .attr('stroke', 'none')

    // yield bsvg;

    const g = bsvg.append('g')
    .attr('width', bubbleChartWidth)
    .attr('height', bubbleChartHeight)
    .attr('fill', 'red')
    .attr('stroke', 'black')

    //yield bsvg

    for (var i=0; i<circles.length; i++) {
        g.append('circle')
        .attr('cx', circles[i].x)
        .attr('cy', circles[i].y)
        .attr('r', circles[i].r)


    }
    
}

//             .








// // define bubble chart     
// function bubbleChart(data) {
//     var test = Array.from({length: 20}, () => ({r: 10 + Math.random() * 10}))
//     console.log(test);
    
    
//     // location to centre bubbles
//     const centre = { x: bubbleChartWidth / 2, y: bubbleChartHeight / 2};

//     // strength to apply position forces
//     const forceStrength = 0.03;

//     // initialise variables
//     let bsvg = null;
//     let bubbles = null;
//     //let labels = null;
//     let nodes = [];

//     // charge dependent on size of bubble
//     function charge(d) {
//         return Math.pow(d.radius, 1.0) * 0.01
//     }

//     // create force simulation and add forces
//     const simulation = d3.forceSimulation()
//         .force('charge', d3.forceManyBody().strength(charge))
//         .force('x', d3.forceX().strength(forceStrength).x(centre.x))
//         .force('y', d3.forceY().strength(forceStrength).y(centre.y))
//         .force('collision', d3.forceCollide().radius(d => d.radius + 1));

//     // force simulation starts up automatically, which we don't want as there aren't any nodes yet
//     simulation.stop();


//     // reformat data
//     function createNodes(data) {
//         const maxSize = d3.max(data, d => d.avgppm);
//         const minSize = d3.min(data, d => d.avgppm);
    
//         // size bubbles based on area
//         const radiusScale = d3.scaleSqrt()
//           .domain([minSize, maxSize]) // domain to set circle of a given circle 
//           .range([5, 20]) // min / maximum radius size 
    
//         // map raw data to node data
//         const nodes = data.map(d => ({
//             'radius': radiusScale(d.avgppm),
//             'ppm': d.avgppm,
//             'year': d.year,
//             'x': Math.random(), //* 900,
//             'y': Math.random() //* 800
//         }))
    
//         console.log(nodes)
//         return nodes;
        
    
//     }


//     // raw data to nodes data
//     nodes = createNodes(data);

//     // add svg element to provided selector
//     bsvg = d3.select('.bubbleContainer')
//         .append('svg')
//         .attr('width', bubbleChartWidth)
//         .attr('height', bubbleChartHeight)

//     // bind nodes data to circle elements
//     const elements = bsvg.selectAll('.bubble')
//         .data(nodes, d=> d.year)
//         .enter()
//         .append('g')

//     //create the bubbles
//     bubbles = elements
//         .append("circle")
//         .classed("bubble", true)
//         .attr("r", d => d.radius)
//         .attr('ppm', d=> d.ppm)
//         // .attr("cx", function(d){ return d.x; })
//         // .attr("cy", function(d){ return d.y; })
//         .style("fill", 'black');

//     function ticked() {
//         bubbles
//             .attr('cx', d => d.x)
//             .attr('cy', d => d.y) 
//     }


//     simulation.nodes(nodes)
//         .on('tick', ticked)
//         .restart();

    
    

// }

