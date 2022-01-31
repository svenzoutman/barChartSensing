// // python -m SimpleHTTPServer
import "./node_modules/d3/dist/d3.min.js";


// Hier wordt de svg aangemaakt.
window.onload = function barChart() {
  var svg = d3.select("svg"),
  margin = 200,
  width = svg.attr("width") - margin,
  height = svg.attr("height") - margin;

//   titel bar chart
// Hier wordt de titel van de bar chart aangemaakt.
  svg.append("text")
        .attr("transform","translate(100,0)")
        .attr("x", 0)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Criminaliteitsindex Burgwallen-Oude Zijde");


  var xScale = d3.scaleBand().range([0, width]).padding(0.4),
      yScale = d3.scaleLinear().range([height, 0]);

  var g = svg.append("g").attr("transform", "translate("+100+","+100+")");


//   Hier wordt de data opgehaald en wordt er gezegt wat er mee moet gebeuren.

  d3.csv("criminialiteitsindex.csv").then(function(data){

      xScale.domain(data.map(function(d){ return d.year;}));
      yScale.domain([0, d3.max(data, function(d){ return d.value;})]);

      g.append("g")
                .attr('transform', 'translate(0,' + height + ')' )
                .call(d3.axisBottom(xScale))
      
      g.append('g')
                .call(d3.axisLeft(yScale).tickFormat(function(d){return d;}).ticks(10))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 10)
                .attr('dy', '-5em')
                .attr('text-anchor', 'end')
                .attr('stroke', 'black')
                .text('Veiligheidsindex')

      g.selectAll(".bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar")
              .on("mouseover", onMouseOver)
              .on("mouseout", onMouseOut)
              .attr("x", function(d){ return xScale(d.year);})
              .attr("y", function(d){ return yScale(d.value);})
              .attr("width", xScale.bandwidth())
              .transition()
              .ease(d3.easeLinear)
              .duration(500)
              .delay(function(d,i){ return i *50})
              .attr("height", function(d){ return height - yScale(d.value);});
        });

        // Mouseover Event Handler

        // Hieronder wordt de animatie aangemaakt dat als je hovert over een bar dat er een popup verschijnt. 
        // In de popup zie je de veiligheidsindex.

        function onMouseOver(d,i) {
                // PopUp met de x en y waardes
                var xPos = parseFloat(d3.select(this).attr('x')) + xScale.bandwidth()
                var yPos = parseFloat(d3.select(this).attr('y')) / 2 + height / 2

                // Update PopUp positie en waarde
                d3.select('#popUp')
                        .style('left', xPos + 'px')
                        .style('top', yPos + 'px')
                        .select('#veiligheidsindex').text(i.value)

                d3.select('#popUp').classed('hidden', false);

                d3.select(this).attr('class','highlight')
                d3.select(this)
                        .transition()
                        .duration(500)
                        .attr('width', xScale.bandwidth() + 5)
                        .attr('y', function(d){return yScale(d.value) - 10;})
                        .attr('height', function(d){return height - yScale(d.value) + 10; })
        }

        // MouseOut

        // Hieronder wordt aangemaakt dat als je van de bar af hovert dat de popup weer weg gaat.
        function onMouseOut(d, i){
                d3.select(this).attr('class', 'bar')
                d3.select(this)
                        .transition()
                        .duration(500)
                        .attr('width', xScale.bandwidth())
                        .attr('y', function(d){return yScale(d.value);})
                        .attr('height', function(d){return height - yScale(d.value);});

                        d3.select('#popUp').classed('hidden', true);
        }

}
