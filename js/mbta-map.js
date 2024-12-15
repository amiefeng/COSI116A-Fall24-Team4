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

d3.json("./data/testingline.json", function (error, data) {
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