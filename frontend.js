// HEIGHTS
var PAGE_HEIGHT = window.innerHeight;
var PAGE_WIDTH = window.innerWidth
var PADDING = 30;



// WIDTHS
var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;
// set width of middle column
document.querySelector('.middleColumn').setAttribute('style', 'width:' + ((PAGE_WIDTH - LEFT_CHARTS_WIDTH)*0.6) + 'px')
var LGCONT_WIDTH = document.querySelector('.middleColumn').offsetWidth
// right colum
document.querySelector('.rightColumn').setAttribute('style', 'width:' + (PAGE_WIDTH - LEFT_CHARTS_WIDTH - LGCONT_WIDTH - 60) + 'px')
var CENTCONT_WIDTH = document.querySelector('.rightColumn').offsetWidth


// define col 1 heights
var TITLE_HEIGHT = document.querySelector('.titleContainer').offsetHeight // define initial heights
// assign to dashboard
document.querySelector('.dashboard').setAttribute("style","height:" + TITLE_HEIGHT +'px');
var BUBBLE_HEIGHT = PAGE_HEIGHT - TITLE_HEIGHT //define initial height for rows
document.querySelector('.lineGraphContainer').setAttribute('style', 'height:' + BUBBLE_HEIGHT + 'px')


var LGCONT_HEIGHT = (document.querySelector('.lineGraphContainer').offsetHeight)
document.querySelector('.centuriesContainer').setAttribute('style', 'height:' + PAGE_HEIGHT + 'px')
var CENTCONT_HEIGHT = document.querySelector('.centuriesContainer').offsetHeight;








// window.addEventListener('resize', onResize);

// function onResize() {
//   clearTimeout(resizeId);
//   resizeId = setTimeout(endResize, 300);

//   var CHARTS_HEIGHT = window.innerHeight;
//   var PADDING = 30;
// var LEFT_ROW_1_HEIGHT = document.querySelector('.titleContainer').offsetHeight + 2 * PADDING; // title
// var LEFT_ROW_2_HEIGHT = 200 + 58 + PADDING; // bubble tiles
// var MIDDLE_ROW_1_HEIGHT = document.querySelector('.dashboard').offsetHeight + 3 * PADDING + 20;
// var MIDDLE_ROW_2_HEIGHT = (CHARTS_HEIGHT - MIDDLE_ROW_1_HEIGHT) - 200// - document.querySelector('').offsetHeight) * 0.75;
// var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;
// var MIDDLE_CHARTS_WIDTH = document.querySelector('.middleColumn').offsetWidth - PADDING;

// }

var link = './data.json'

fetch(link)
    .then(response => response.json())
    .then(data => {
        
        
        plotTile(data['first'])
        //plotDonut(data['third'])
        plotLineGraph(data['second'])
        
       
    })


  