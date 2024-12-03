var margin = {top: 50, right: 50, bottom: 70, left: 85},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Define scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Define the SVG and dimensions
var svg = d3.select("#mbta-map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var map = d3
    .tubeMap()
    .width(width * 0.9)
    .height(height * 0.9)

// Load the MBTA data
d3.json('Data/transit_data.json').then(data => {
  const stations = data.stations;
  const lines = data.lines;

  // Compute the scale domains
  const minX = d3.min(Object.values(stations), d => d.x);
  const maxX = d3.max(Object.values(stations), d => d.x);
  const minY = d3.min(Object.values(stations), d => d.y);
  const maxY = d3.max(Object.values(stations), d => d.y);

  xScale.domain([minX, maxX]).range([margin.left, width - margin.right]);
  yScale.domain([minY, maxY]).range([height - margin.bottom, margin.top]);

  // Draw the lines
  lines.forEach(line => {
    const linePath = d3.line()
      .x(d => xScale(stations[d.name].x))
      .y(d => yScale(stations[d.name].y));

    svg.append("path")
      .datum(line.nodes)
      .attr("class", "line")
      .attr("d", linePath)
      .attr("stroke", line.color)
      .attr("fill", "none");
  });

  // Draw the stations
  svg.selectAll(".station")
    .data(Object.values(stations))
    .enter()
    .append("circle")
    .attr("class", "station")
    .attr("r", 5)
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .on("click", (event, d) => showStationDetails(d))
    .on("mouseover", function () {
      d3.select(this).attr("fill", "red");
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", "black");
    });

  // Add station labels
  svg.selectAll(".label")
    .data(Object.values(stations))
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => xScale(d.x))
    .attr("y", d => yScale(d.y) - 10)
    .text(d => d.label);
});

// Function to display station details in the sidebar
function showStationDetails(station) {
  const sidebar = d3.select("#sidebar");
  sidebar.html(`
    <h3>${station.label}</h3>
    <p>Coordinates: (${station.x.toFixed(5)}, ${station.y.toFixed(5)})</p>
  `);
}