
























// define app for CO2 dashboard
const app = document.getElementById('root')
const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);
// add graph container
d3.select('body').append('div').attr('class', 'graphContainer');

// port
var link = 'http://localhost:3000/'

// fetch data
fetch(link)
    .then(response => response.json())
    .then(data => {
        // define current date, month and year
        var suh = new Date()
        const month = suh.getMonth()
        const year = suh.getFullYear();
        
        // for latest update get day
        var day = data[year][0]['Day'];
        var latestDay = day

        // check data is available for most recent day and if not go back to day with most recent data
        function checkDay(x) {
            var temp = data[year].filter((element)=> element['Day'] == x)[0]['PPM'];
            if (Number(temp)){
                return x
            } else {
                return checkDay(x-1)
            }
        }

        // redefine day
        var day = checkDay(day)
        
        // go into data and match with checked day
        var keys = Object.keys(data)
        // define empty data for dashboard and plots
        var newData = []
        var plotData = []
        
        for (var i=0; i<keys.length; i++) {
            var temp = data[keys[i]].filter((element) => element['Day'] == day)
            // if data isnt available take from day before in relevant year
            if (temp.length == 0) {
                var temp = data[keys[i]].filter((element) => element['Day'] == (day-1))
            }
            temp[0]['Year'] = Number(keys[i]);
            
            newData[keys[i]] = temp;
            plotData.push(temp[0])

         }

        
        // in each row create column showing pecrntage change from present
        var current  = newData[year][0]['PPM']
    
        for (var i=0; i<keys.length; i++) {
            var temp = newData[keys[i]][0]['PPM']
            newData[keys[i]][0]['PC'] = Math.floor(((current - temp) / temp  *100) * 100) / 100
        }



        // display in html current reading
        // create box
        const box = document.createElement('div');
            box.setAttribute('class', 'box');

        // Write title of each location
        const h1 = document.createElement('p');
        h1.setAttribute('class', 'h1');
        h1.innerHTML = 'Latest CO<sub>2</sub> levels: ' + '<br>' + newData['2020'][0]['PPM'] + '<small class=\'ppm\'> PPM</small>' + '<br>' + ' <small class=\'update\'>' + '(last update: ' + suh.toLocaleString('default', { month: 'long' }) + ' ' + latestDay + ')</small>'

        const inc = document.createElement('p1');
        inc.setAttribute('class', 'inc');
        inc.innerHTML = '% increase from this day in...'

        // create div for lists
        const listContainer = document.createElement('div');
        listContainer.setAttribute('class', 'lists');

        var notThis = newData;
        delete notThis['2020'];
        var newDataKeys = Object.keys(notThis);
        
        for (var i=0; i<newDataKeys.length; i++) {
            const list = document.createElement('ul');
            list.setAttribute('class', newDataKeys[i]);
            list.setAttribute('style', 'list-style:none')
            var liYear = document.createElement('li');
            liYear.innerHTML = newDataKeys[i];
            var liPC = document.createElement('li');
            liPC.innerHTML = newData[newDataKeys[i]][0]['PC'] + '%';
            var liPPM = document.createElement('li');
            liPPM.innerHTML = '(' + newData[newDataKeys[i]][0]['PPM'] + ' PPM)'

            list.append(liYear, liPC, liPPM) 
            listContainer.append(list);  
        }

        
        container.appendChild(box);
        box.appendChild(h1);
        box.appendChild(inc)
        box.appendChild(listContainer);
       

        /////// define graph container
        
        // define dimensions
        const width = 500;
        const height = 300;
        const margin = 5;
        const padding = 10;
        const adj = 30;

        
        
        // append svg
        const svg = d3.select(".graphContainer").append("svg")
            .attr("preserveAspectRatio", "xMidYMid")
            .attr("viewBox", "-"
                + adj + " -"
                + adj + " "
                + (width + adj *3) + " "
                + (height + adj*3))
            .style("padding", padding)
            .style("margin", margin)
            .classed("svg-content", true);
        


        // prepare scales
        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().rangeRound([height, 0]);



        // define domains
        x.domain(d3.extent(plotData, function(d){
            return d.Year
        }));

        var ppm = plotData.map(x => x.PPM)
        y.domain([Math.round((d3.min(ppm)-1)), Math.round((d3.max(ppm)+1))]);
        console.log(d3.min(ppm))

        // define axes
        var xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.format('d')).tickValues(plotData.map(d => d.Year))
        var yAxis = d3.axisLeft(y)
        

        // add axes
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)

        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis)


        // define line and add
        var valueline = d3.line()
                .x(function(d) {return x(d.Year);})
                .y(function(d) {return y(d.PPM);});

        svg.append('path')
            .data([plotData])
            .attr('class', 'line')
            .attr('d', valueline)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "none");

        
        
        // create circle to travel along line
        var focus = svg.append('g')
                       .append('circle')
                            .style('fill', 'skyblue')
                            .attr('stroke', 'black')
                            .attr('r', 8.5)
                            .style('display', 'none')

        
        // Create the text that travels along the curve of chart
        var focusText = svg
            .append('g')
            .append('text') 
                .style("display", 'none')
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "middle")


        
                    
        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width+100)
            .attr('height', height+100)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

     
        // display tooltip on mouseover
        function mouseover() {
                focus.style("display", null)
                focusText.style("display", null)
            }
    
    
        //  find the closest X index of the mouse:
        var bisectYear = d3.bisector(d => d.Year).left;
        //var bisectPPM = d3.biserctor(d => d.PPM).right;


        function mousemove() {
                // take x mouse position and convert to equivalent date
                var x0 = x.invert(d3.mouse(this)[0]);
                // find index of plotData array that is closest to mouse
                var i = bisectYear(plotData, x0, 1);
                d0 = plotData[i-1],
                d1 = plotData[i],                                 
                d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
                
                focus
                  .attr("cx", x(d.Year))
                  .attr("cy", y(d.PPM))
                focusText
                  .html(d.Year + "  :  " + d.PPM + "PPM")
                  .attr("x", x(d.Year)+15)
                  .attr("y", y(d.PPM))
                }
    
            function mouseout() {
                    focus.style("display", 'none')
                    focusText.style("display", 'none')
                  } 
       
        


        
    });