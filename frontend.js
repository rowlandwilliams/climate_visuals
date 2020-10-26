// handle preloader
const preloader = document.querySelector('.preloader');

const fadeEffect = setInterval(() => {
    if (!preloader.style.opacity) {
      preloader.style.opacity = 1;
    }
    if (preloader.style.opacity > 0) {
      preloader.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
    }
  }, 100);

//window.addEventListener('load', fadeEffect);


window.addEventListener("load", () => fadeEffect);
//SET PAGE HEIGHTS
// HEIGHTS
var PAGE_HEIGHT = window.innerHeight - 20;
var PAGE_WIDTH = window.innerWidth
var PADDING = 30;
// WIDTHS
var LEFT_CHARTS_WIDTH = document.querySelector('.leftColumn').offsetWidth;
var CENTCONT_WIDTH = document.querySelector('.rightColumn').offsetWidth

// set width of middle column
document.querySelector('.middleColumn').setAttribute('style', 'width:' + (PAGE_WIDTH - LEFT_CHARTS_WIDTH - CENTCONT_WIDTH) + 'px')
var LGCONT_WIDTH = document.querySelector('.middleColumn').offsetWidth

// define col 1 heights
var TITLE_HEIGHT = document.querySelector('.titleContainer').offsetHeight // define initial heights


var BUBBLE_HEIGHT = PAGE_HEIGHT - TITLE_HEIGHT - 20//define initial height for rows
document.querySelector('.lineGraphContainer').setAttribute('style', 'height:' + PAGE_HEIGHT + 'px')
var LGCONT_HEIGHT = document.querySelector('.lineGraphContainer').offsetHeight

document.querySelector('.centDashboard').setAttribute('style', 'height:' + TITLE_HEIGHT + 'px')
document.querySelector('.centuriesContainer').setAttribute('style', 'height:' + BUBBLE_HEIGHT + 'px')
var CENTCONT_HEIGHT = document.querySelector('.centuriesContainer').offsetHeight + 20;


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






  