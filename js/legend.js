var svg = d3.select("#my_legend")

// svg.append("rect")
//   .attr("x", 20)
//   .attr("y", 0)
//   .attr("width", 250)
//   .attr("height", 249)
//   .attr("fill", "#FFFFFF")
//   .attr("stroke", "#e0e0e0")
//   .attr("stroke-width", 1)
//   .attr("rx", 8) 
//   .attr("ry", 8) 

//appending 'Legend' text
svg.append("text")
  .attr("x", 70)
  .attr("y", 40)
  .attr("font-size", 20)
  .attr("font-weight", "bold")
  .attr("text-anchor", "middle")
  .attr("fill", "#6d2e6d") 
  .text("Legend")

//appending images
svg.append("image")
  .attr("x", 55)
  .attr("y", 70)
  .attr("width", 40)
  .attr("height", 40)
  .attr("xlink:href", "./favicons/redLine.png")

svg.append("image")
  .attr("x", 55)
  .attr("y", 120)
  .attr("width", 40)
  .attr("height", 40)
  .attr("xlink:href", "./favicons/greenLine.png")

svg.append("image")
  .attr("x", 55)
  .attr("y", 170)
  .attr("width", 40)
  .attr("height", 40)
  .attr("xlink:href", "./favicons/blueLine.png")

svg.append("image")
  .attr("x", 55)
  .attr("y", 220)
  .attr("width", 40)
  .attr("height", 40)
  .attr("xlink:href", "./favicons/orangeLine.png")

//appending color circles
svg.append("circle").attr("cx",55).attr("cy",80).attr("r", 10).style("fill", "#DA291C")
svg.append("circle").attr("cx",55).attr("cy",130).attr("r", 10).style("fill", "#00843D")
svg.append("circle").attr("cx",55).attr("cy",180).attr("r", 10).style("fill", "#003DA5")
svg.append("circle").attr("cx",55).attr("cy",230).attr("r", 10).style("fill", "#ED8B00")

//appending corresponding text
svg.append("text").attr("x", 105).attr("y", 91).text("Red Line").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 105).attr("y", 141).text("Green Line").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 105).attr("y", 191).text("Blue Line").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 105).attr("y", 241).text("Orange Line").style("font-size", "15px").attr("alignment-baseline","middle")