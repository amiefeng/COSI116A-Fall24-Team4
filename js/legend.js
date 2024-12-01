var svg = d3.select("#my_legend")

svg.append("rect")
  .attr("x", 100)
  .attr("y", 0)
  .attr("width", 250)
  .attr("height", 249)
  .attr("fill", "#f9f9f9")
  .attr("stroke", "#ddd")
  .attr("stroke-width", 1)
  .attr("rx", 8) 
  .attr("ry", 8) 

//appending 'Legend' text
svg.append("text")
  .attr("x", 210)
  .attr("y", 20)
  .attr("font-size", 18)
  .attr("font-weight", "bold")
  .attr("text-anchor", "middle")
  .attr("fill", "#6d2e6d") 
  .text("Legend")

//appending images
svg.append("image")
  .attr("x", 160)
  .attr("y", 40)
  .attr("width", 40)
  .attr("height", 40)
  .attr("xlink:href", "./favicons/redLine.png")

svg.append("image")
  .attr("x", 160)
  .attr("y", 80)
  .attr("width", 40)
  .attr("height", 40)
  .attr("xlink:href", "./favicons/greenLine.png")

svg.append("image")
  .attr("x", 160)
  .attr("y", 120)
  .attr("width", 40)
  .attr("height", 40)
  .attr("xlink:href", "./favicons/blueLine.png")

svg.append("image")
  .attr("x", 160)
  .attr("y", 160)
  .attr("width", 40)
  .attr("height", 40)
  .attr("xlink:href", "./favicons/orangeLine.png")

//appending color circles
svg.append("circle").attr("cx",145).attr("cy",60).attr("r", 10).style("fill", "#DA291C")
svg.append("circle").attr("cx",145).attr("cy",100).attr("r", 10).style("fill", "#00843D")
svg.append("circle").attr("cx",145).attr("cy",140).attr("r", 10).style("fill", "#003DA5")
svg.append("circle").attr("cx",145).attr("cy",180).attr("r", 10).style("fill", "#ED8B00")

//appending corresponding text
svg.append("text").attr("x", 210).attr("y", 60).text("Red Line").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 210).attr("y", 100).text("Green Line").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 210).attr("y", 140).text("Blue Line").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 210).attr("y", 180).text("Orange Line").style("font-size", "15px").attr("alignment-baseline","middle")