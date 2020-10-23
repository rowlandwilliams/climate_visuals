//SET PAGE HEIGHTS
// HEIGHTS
var PAGE_HEIGHT = window.innerHeight - 40;
var PAGE_WIDTH = window.innerWidth
var PADDING = 30;
// WIDTHS
var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;

// set width of middle column
document.querySelector('.middleColumn').setAttribute('style', 'width:' + ((PAGE_WIDTH - LEFT_CHARTS_WIDTH)*0.6) + 'px')
var LGCONT_WIDTH = document.querySelector('.middleColumn').offsetWidth

// right colum
document.querySelector('.rightColumn').setAttribute('style', 'width:' + ((PAGE_WIDTH - LEFT_CHARTS_WIDTH - LGCONT_WIDTH - 60)) + 'px')
var CENTCONT_WIDTH = document.querySelector('.rightColumn').offsetWidth

// define col 1 heights
var TITLE_HEIGHT = document.querySelector('.titleContainer').offsetHeight // define initial heights


var BUBBLE_HEIGHT = PAGE_HEIGHT - TITLE_HEIGHT //define initial height for rows
document.querySelector('.lineGraphContainer').setAttribute('style', 'height:' + PAGE_HEIGHT + 'px')
var LGCONT_HEIGHT = document.querySelector('.lineGraphContainer').offsetHeight

document.querySelector('.centDashboard').setAttribute('style', 'height:' + (PAGE_HEIGHT * 0.3) + 'px')
document.querySelector('.centuriesContainer').setAttribute('style', 'height:' + (PAGE_HEIGHT * 0.7) + 'px')
var CENTCONT_HEIGHT = document.querySelector('.centuriesContainer').offsetHeight;


// DEFINE GLOBAL DATA
var global = [];
var link = './data.json'


fetch(link)
    .then(response => response.json())
    .then(data => {
        
        global = data;
        
        plotTile()
        plotLineGraph()
        plotCenturies()
          
});


window.addEventListener('resize', resize)

// window.addEventListener('resize', onResize);

// function onResize() {
//     var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;
//     // set width of middle column
//     document.querySelector('.middleColumn').setAttribute('style', 'width:' + ((PAGE_WIDTH - LEFT_CHARTS_WIDTH)*0.6) + 'px')
//     var LGCONT_WIDTH = document.querySelector('.middleColumn').offsetWidth
//     // right colum
//     document.querySelector('.rightColumn').setAttribute('style', 'width:' + (PAGE_WIDTH - LEFT_CHARTS_WIDTH - LGCONT_WIDTH - 60) + 'px')
//     var CENTCONT_WIDTH = document.querySelector('.rightColumn').offsetWidth
//     // define col 1 heights
//     var TITLE_HEIGHT = document.querySelector('.titleContainer').offsetHeight // define initial heights
//     // assign to dashboard
//     document.querySelector('.dashboard').setAttribute("style","height:" + TITLE_HEIGHT +'px');
//     var BUBBLE_HEIGHT = PAGE_HEIGHT - TITLE_HEIGHT //define initial height for rows
//     document.querySelector('.lineGraphContainer').setAttribute('style', 'height:' + BUBBLE_HEIGHT + 'px')
//     var LGCONT_HEIGHT = (document.querySelector('.lineGraphContainer').offsetHeight)
//     document.querySelector('.centDashboard').setAttribute('style', 'height:' + (PAGE_HEIGHT * 0.3) + 'px')
//     document.querySelector('.centuriesContainer').setAttribute('style', 'height:' + (PAGE_HEIGHT * 0.7) + 'px')
//     var CENTCONT_HEIGHT = document.querySelector('.centuriesContainer').offsetHeight;
  
  
//     updateLineGraph('all')
// }

  