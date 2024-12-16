function mbtamap() {
  var width = 1000;
  var height = 1000;

  var container = d3.select("#mbta-map");

  var map = d3
      .tubeMap()
      .width(width)
      .height(height)
      .margin({
          top: 20,
          right: 20,
          bottom: 40,
          left: 100,
      });

  var dispatcher;

  // Main function to initialize the map
  function chart(selection) {
      selection.each(function () {
          d3.json("./data/testingline.json", function (error, data) {
              if (error) throw error;

              container.datum(data).call(map);

              var svg = container.select("svg");

              // Zoom settings
              var zoom = d3.zoom().scaleExtent([0.1, 6]).on("zoom", zoomed);
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
      });
  }

  // Set up selectionDispatcher for event handling
  chart.selectionDispatcher = function (_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
  };

  // Handle dispatch messages (filter and update visuals)
  chart.processDispatch = function (dispatchString) {
      if (dispatchString[0] === "filter") {
          const lines = dispatchString[1];
          container.selectAll(".line").each(function (d) {
              if (lines[0] === "All Lines") {
                  d3.select(this).classed("unfiltered", false).attr("stroke", d.color);
              } else {
                  const isVisible = lines.includes(d.name);
                  d3.select(this)
                      .classed("unfiltered", !isVisible)
                      .attr("stroke", isVisible ? d.color : "grey");
              }
          });
      }
  };

  return chart;
}