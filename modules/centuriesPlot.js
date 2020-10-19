let cMargin = {top: 20, right: 30, bottom:20, left: 30},

cWidth = CENTCONT_WIDTH - cMargin.right - cMargin.left// initially make width / height equal to container width
cHeight = CENTCONT_HEIGHT - cMargin.top - cMargin.bottom

var csvg = d3.select(".centuriesContainer").append("svg")
        .attr('width', cWidth) // could add padding here
        .attr('height', cHeight)
        .attr('viewBox', [0, 0, cWidth, cHeight])
        .attr('class', 'centSVG')
        .attr('transform', 'translate(' + cMargin.left + ',' + cMargin.top + ')')

