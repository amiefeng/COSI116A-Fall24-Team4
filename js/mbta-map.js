// var margin = {top: 50, right: 50, bottom: 70, left: 85},
// width = 500 - margin.left - margin.right,
// height = 500 - margin.top - margin.bottom;
// selectableElements = d3.select(null);

// // Select the container
// var svg = d3.select("#mbta-map")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height);

// // Define the tube map
// var map = d3
//   .tubeMap()
//   .width(width)
//   .height(height)
//   .margin({
//     top: height ,
//     right: width ,
//     bottom: height ,
//     left: width,
//   });

// // Load the data using d3.json with a callback
// d3.json("./data/london-tube.json", function (error, data) {
//   if (error) {
//     console.error("Error loading data:", error);
//     return;
//   }
//   console.log(data);

//   // Bind the data to the container and call the tube map
//   svg.datum(data).call(map);
// });
var container = d3.select("#mbta-map");
var width = 1000;
var height = 1000;

var map = d3
  .tubeMap()
  .width(width)
  .height(height)
  .margin({
    top: 20,
    right: 20,
    bottom: 40,
    left: 100,
  })
  .on("click", function (name) {
    console.log(name);
  });

d3.json("./data/london-tube.json", function (error, data) {
  container.datum(data).call(map);

  var svg = container.select("svg");

  zoom = d3.zoom().scaleExtent([0.1, 6]).on("zoom", zoomed);

  var zoomContainer = svg.call(zoom);
  var initialScale = 0.5;
  var initialTranslate = [(width * 0.9) / 2, (height * 0.9) / 2];

  zoom.scaleTo(zoomContainer, initialScale);
  zoom.translateTo(
    zoomContainer,
    initialTranslate[0],
    initialTranslate[1]
  );

  function zoomed() {
    svg.select("g").attr("transform", d3.event.transform.toString());
  }
});