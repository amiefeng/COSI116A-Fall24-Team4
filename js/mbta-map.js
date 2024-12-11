var margin = {top: 50, right: 50, bottom: 70, left: 85},
width = 1600- margin.left - margin.right,
height = 1024 - margin.top - margin.bottom;
selectableElements = d3.select(null);

// Select the container
var svg = d3.select("#mbta-map")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the tube map
var map = d3
  .tubeMap()
  .width(width)
  .height(height)
  .margin({
    top: height ,
    right: width ,
    bottom: height ,
    left: width,
  });

// Load the data
d3.json("data/testing_line.json", function (error, data) {
  if (error) {
    console.error("Error loading data:", error);
    return;
  }
  
  console.log(data);

  // Bind the data to the container and call the tube map
  svg.datum(data).call(map);
  
});