// Set up the SVG canvas dimensions
const width = 800;
const height = 600;

// Create an SVG element
const svg = d3.select("#map").attr("width", width).attr("height", height);

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
  Promise.all([
    d3.json("Data/mbta_lines.json"), 
    d3.json("Data/mbta_stations.json"), // Replace with the path to your stations GeoJSON
  ])
    .then(([linesData, stationsData]) => {
      // Draw the lines
      svg
        .selectAll(".line")
        .data(linesData.features)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", path)
        .attr("stroke", (d) => {
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
        .attr("cx", (d) => projection(d.geometry.coordinates)[0])
        .attr("cy", (d) => projection(d.geometry.coordinates)[1])
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
        .attr("x", (d) => projection(d.geometry.coordinates)[0])
        .attr("y", (d) => projection(d.geometry.coordinates)[1] - 10)
        .text((d) => d.properties.STATION)
        .attr("font-size", "10px")
        .attr("text-anchor", "middle");
    })
    .catch((error) => {
      console.error("Error loading GeoJSON data:", error);
    });
}

// Call the function to draw the map
drawMap();
