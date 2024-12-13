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

d3.json("./data/testingline.json", function (error, data) {
  container.datum(data).call(map);

  var svg = container.select("svg");

  svg.selectAll(".line")
    .on("click", function (event, d) {
      d3.selectAll(".line").classed("selected", false); // Deselect all lines
      d3.select(this).classed("selected", true); // Select the clicked line

      // Optional: Show line details in a sidebar or log them
      console.log("Selected Line:", d);
    })
    .on("mouseover", function () {
      d3.select(this).classed("hover", true);
    })
    .on("mouseout", function () {
      d3.select(this).classed("hover", false);
    });

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