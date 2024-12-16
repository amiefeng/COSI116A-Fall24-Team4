function mbtamap() {
    var width = 1000;
    var height = 1000;

    var container = d3.select("#mbta-map");

    // Tooltip setup
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "2.5px")
        .style("padding", "5px");

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

    // Average Ridership Data
    const averageRidershipData = {
        "Red Line": 146473.446,
        "Blue Line": 44904.1584,
        "Green Line": 114716.376,
        "Orange Line": 120290.653
    };

        // Average Ridership Data
    const averageReliablityData = {
          "Red Line": 0.904128546,
          "Blue Line": 0.948767479,
          "Green Line": 0.782945442,
          "Orange Line": 0.917909723
      };

    // Main function to initialize the map
    function chart(selection) {
        selection.each(function () {
            d3.json("./data/testingline.json", function (error, data) {
                if (error) throw error;

                container.datum(data).call(map);

                var svg = container.select("svg");

                // Attach event listeners to lines
                svg.selectAll(".line")
                    .on("mouseover", function (d) {
                        // Get line name and corresponding ridership data
                        const lineName = d.name;
                        const averageRidership = averageRidershipData[lineName] || "Data Not Available";
                        const averageReliablity = averageReliablityData[lineName]
                        // Update and show tooltip
                        tooltip.transition().duration(200).style("opacity", 1);
                        tooltip.html(
                            `<strong>Line:</strong> ${lineName}<br/>` +
                            `<strong>Average Ridership:</strong> ${averageRidership.toFixed(0)}<br/>`+
                            `<strong>Average Reliablitiy:</strong> ${averageReliablity}`
                        )
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function () {
                        tooltip.transition().duration(500).style("opacity", 0);
                    });

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
                console.log(d.name, d.color);
                if (lines[0] === "All Lines") {
                    d3.select(this).classed("unfiltered", false).attr("stroke", d.color);
                } else {
                    const isVisible = lines.includes(d.name);

                    if (isVisible) {
                        // Apply the color to all lines with the same color as the selected line
                        container.selectAll(".line")
                            .filter(function (line) {
                                return line.color === d.color; // Match lines by color
                            })
                            .classed("unfiltered", false) // Ensure they are marked as visible
                            .attr("stroke", d.color); // Set stroke color to their original color
                    } else {
                        // Hide or grey out non-matching lines
                        d3.select(this)
                            .classed("unfiltered", true)
                            .attr("stroke", "grey"); // Dim non-matching lines
                    }
                }
            });
        }
    };

    return chart;
}