var margin = {top: 50, right: 50, bottom: 70, left: 85};
var width = 1600;
var height = 1024;
selectableElements = d3.select(null);

// Select the container
var container = d3.select("#mbta-map");

// Define the tube map
var map = d3
  .tubeMap()
  .width(width*0.9)
  .height(height*0.9)
  .on('click',function(line){
    show_line_average(line);
  });


// Check if the browser is safari
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// Load the data
d3.json("data/london-tube.json", function (error, data) {
  if (error) {
    console.error("Error loading data. Full error details:", error);
    return;
  }

  // Check data structure
  console.log("Loaded data:", data);

  // Bind the data and render the map
  container.datum(data).call(map);

  var svg = container.select("svg");
  var g = svg.select("g"); // Select the group containing the map elements

  // Set up zoom
  var zoom = d3
    .zoom()
    .scaleExtent([0.5, 10])
    .on("zoom", zoomed);

  svg.call(zoom);

  // Initial zoom and translate
  var initialScale = 1;
  var initialTranslate = [(width * 0.9) / 2, (height * 0.9) / 2];

  zoom.scaleTo(svg, initialScale);

  if (isSafari()) {
    zoom.translateTo(svg, -100, 0);
  } else {
    zoom.translateTo(svg, initialTranslate[0], initialTranslate[1]);
  }

  // Handle zoom events
  function zoomed() {
    g.attr("transform", d3.event.transform.toString());
  }

});