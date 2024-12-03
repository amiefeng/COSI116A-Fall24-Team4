// Set up the SVG canvas dimensions
var margin = {top: 50, right: 50, bottom: 70, left: 85},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// Create an SVG element
var svg = d3.select("#map").attr("width", width).attr("height", height);

// Set up a projection and path generator
const projection = d3
  .geoMercator()
  .center([-71.0589, 42.3601]) // Center the map on Boston
  .scale(70000) // Scale for zoom level
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Function to draw the MBTA map
function drawMap() {
  // Load the GeoJSON files for lines and stations
  d3.json("../data/mbta_lines.json", function(linesError, linesData) {
    if (linesError) {
      console.error("Error loading lines GeoJSON:", linesError);
      return;
    }
    console.log(linesData);

    d3.json("../data/mbta_stations.json", function(stationsError, stationsData) {
      if (stationsError) {
        console.error("Error loading stations GeoJSON:", stationsError);
        return;
      }
      console.log(Data);

      // Draw the lines
      svg
        .selectAll(".line")
        .data(linesData.features)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", path)
        .attr("stroke", function(d) {
          // Assign colors based on line name
          switch (d.properties.LINE) {
            case "RED":
              return "red";
            case "GREEN":
              return "green";
            case "BLUE":
              return "blue";
            case "ORANGE":
              return "orange";
            case "SILVER":
              return "gray";
            default:
              return "black";
          }
        })
        .attr("fill", "none")
        .attr("stroke-width", 3);

      // Draw the stations
      svg
        .selectAll(".station")
        .data(stationsData.features)
        .enter()
        .append("circle")
        .attr("class", "station")
        .attr("cx", function(d) {
          return projection(d.geometry.coordinates)[0];
        })
        .attr("cy", function(d) {
          return projection(d.geometry.coordinates)[1];
        })
        .attr("r", 5)
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5);

      // Add station labels
      svg
        .selectAll(".label")
        .data(stationsData.features)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function(d) {
          return projection(d.geometry.coordinates)[0];
        })
        .attr("y", function(d) {
          return projection(d.geometry.coordinates)[1] - 10;
        })
        .text(function(d) {
          return d.properties.STATION;
        })
        .attr("font-size", "10px")
        .attr("text-anchor", "middle");
    });
  });
}

// Call the function to draw the map
drawMap();