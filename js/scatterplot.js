function scatterplot() {
    var margin = { top: 50, right: 50, bottom: 70, left: 85 },
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    selectableElements = d3.select(null);
    let ourBrush = null

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "2.5px")
        .style("padding", "5px");
    var color = d3.scaleOrdinal()
        .domain(["Red Line", "Blue Line", "Green Line", "Orange Line"])
        .range([d3.rgb(255, 0, 0), d3.rgb(0, 0, 255), d3.rgb(0, 255, 0), d3.rgb(255, 128, 0)]);


    function chart() {
        // define colors corresponding to lines

        //define SVG
        var svg = d3.select("#vis-svg")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // load CSV
        d3.csv("./data/rapid_transit_ridership_and_reliability_m_y_l.csv", function (error, data) {



            data.forEach(d => {
                d.reliability_quotient = +d.expected_time / +d.actual_time * 100; // create reliability quotient by dividing expected time by actual time and multplying by 100
                d.average_monthly_ridership = +d.average_monthly_ridership; // convert ridership colun to integer
            });


            //define x-scale
            var x = d3.scaleLinear()
                .domain([65, 100])
                .range([0, width]);

            //define y-scale
            var y = d3.scaleLinear()
                .domain([0, 250000])
                .range([height, 0]);

            // add x-axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // add x-axis label
            svg.append("text")
                .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 5) + ")")
                .style("text-anchor", "middle")
                .text("Reliability");

            // add y-axis label
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 10 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Average Monthly Ridership");

            // add y-axis
            svg.append("g")
                .call(d3.axisLeft(y));


            // Highlight points when brushed
            function brush(g) {
                const brush = d3.brush() // Create a 2D interactive brush

                    .on("start brush", highlight) // When the brush starts/continues do...
                    .on("end", brushEnd) // When the brush ends do...
                    .extent([
                        [-margin.left, -margin.bottom],
                        [width + margin.right, height + margin.top]
                    ]);

                ourBrush = brush;

                g.call(brush); // Adds the brush to this element

                // Highlight the selected circles
                function highlight() {

                    if (d3.event.selection === null) return;
                    const [
                        [x0, y0],
                        [x1, y1]
                    ] = d3.event.selection;

                    // If within the bounds of the brush, select it
                    selectableElements.classed("selected", d =>
                        x0 <= x(d.reliability_quotient) && x(d.reliability_quotient) <= x1 && y0 <= y(d.average_monthly_ridership) && y(d.average_monthly_ridership) <= y1
                    )

                    // Get the name of our dispatcher's event
                    // let dispatchString = "selectionUpdated";

                    // Let other charts know about our selection
                    //scatPlotDispatcher.call(dispatchString, this, svg.selectAll(".selected").data());
                }

                function brushEnd() {
                    // We don't want infinite recursion
                    if (d3.event.sourceEvent.type != "end") {
                        d3.select(this).call(brush.move, null);
                        selectableElements.classed("selected", false);

                    }
                }
            }

            svg.append("g")
                .attr("class", "brush")
                .call(brush);
            // populate
            selectableElements = svg.append("g")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(+d.reliability_quotient); })
                .attr("cy", function (d) { return y(+d.average_monthly_ridership); })
                .attr("r", 2) // Radius
                .style("fill", function (d) { return color(d.route_or_line); })
                .attr("class", d => String(d.route_or_line).split(" ")[0])
                .on("mouseover", function (d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 8);
                    tooltip.html(`Line: ${d.route_or_line}<br/>` +
                        `Reliability: ${(parseFloat(d.reliability_quotient).toFixed(2))}<br/>` +
                        `Ridership: ${d.average_monthly_ridership}<br/>`  +
                        `Time Frame: ${d.year_month.split("/")[1] + "/" + d.year_month.split('/')[0]}`)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                // Add mouseout event
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })




            /**
             * 
             * @param {*} data_subset 
             * @returns slope and intercept for linear regression of subse t of data
             */
            function linearRegression(data_subset) {
                const n_elements = data_subset.length;
                const sum_x = d3.sum(data_subset, d => d.reliability_quotient);
                const sum_y = d3.sum(data_subset, d => d.average_monthly_ridership);
                const sum_x_y = d3.sum(data_subset, d => d.reliability_quotient * d.average_monthly_ridership);
                const sum_x_2 = d3.sum(data_subset, d => d.reliability_quotient * d.reliability_quotient);


                const slope = (n_elements * sum_x_y - sum_x * sum_y) / (n_elements * sum_x_2 - sum_x * sum_x);
                const intercept = (sum_y - slope * sum_x) / n_elements;

                return { slope, intercept };
            }


            //groups data by line for linear regression of each group
            const groupedData = d3.nest()
                .key(d => d.route_or_line)
                .entries(data);


            groupedData.forEach(group => {
                const key = group.key;
                const values = group.values;

                const { slope, intercept } = linearRegression(values);
                const x1 = d3.min(values, d => d.reliability_quotient);
                const x2 = d3.max(values, d => d.reliability_quotient);
                const y1 = slope * x1 + intercept;
                const y2 = slope * x2 + intercept;


                svg.append("line")
                    .attr("x1", x(x1))
                    .attr("y1", y(y1))
                    .attr("x2", x(x2))
                    .attr("y2", y(y2))
                    .style("stroke", color(key))
                    .style("stroke-width", 2);
            });

            var { slope, intercept } = linearRegression(data);
            var x1_total = d3.min(data, d => d.reliability_quotient);
            var x2_total = d3.max(data, d => d.reliability_quotient);
            var y1_total = slope * x1_total + intercept;
            var y2_total = slope * x2_total + intercept;
            svg.append("line")
                .attr("x1", x(x1_total))
                .attr("y1", y(y1_total))
                .attr("x2", x(x2_total))
                .attr("y2", y(y2_total))
                .style("stroke", "#000000")
                .style("stroke-width", 2);


        });
    }
    chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        scatPlotDispatcher = _;
        return chart;
    };

    // Given selected data from another visualization 
    // select the relevant elements here (linking)
    chart.processDispatch = function (dispatchString) {
        if (dispatchString[0] === "filter") {
            lines = dispatchString[1]
            d3.selectAll("line").each(function () {
                if (lines[0] === 'All Lines') {
                    d3.select(this).classed("unfiltered", false) //set to unfiltered if we want everything filteredgit
                } else {
                    let strokeColor = d3.rgb(d3.select(this).style("stroke"));
                    let colorList = lines.map(line => color(line));
                    d3.select(this).classed("unfiltered", !colorList.map(c => c.toString()).includes(strokeColor.toString()));
                }
            })
            selectableElements.each(function (d) {
                if (lines[0] === 'All Lines') {
                    d3.select(this).classed("unfiltered", false) //set to unfiltered if we want everything filteredgit
                } else {
                    d3.select(this).classed("unfiltered", true)
                    for (i = 0; i < lines.length; i++) {
                        d3.select(this).classed("unfiltered", d3.select(this).classed("unfiltered") && !d3.select(this).classed(lines[i].split(" ")[0])) //update unfiltered to false if it is in one of the filtered classes, keep false if already set to false
                    }
                }

            })
        }
        else if (dispatchString[0] === "calendarUpdated") {
            if (!arguments.length) return;
            message = dispatchString[1]
            if (message === "|") {                               //if no selection (equivalent to all years / all months), don't select
                selectableElements.classed("selected", false);
            } else {
                console.log(dispatchString)
                let years_and_months = message.split("|")
                console.log(years_and_months)
                let years = years_and_months[0].split(",")
                console.log(years)
                let months = years_and_months[1].split(",")
                console.log("y/m", years, months)
                console.log(years.length, months.length)

                selectableElements.each(function (d) {
                    let d_y_m = d.year_month.split("/")
                    let y = d_y_m[0]
                    let m = d_y_m[1]                           //for each selectable element
                    d3.select(this).classed("selected", (years[0] === '' || years.includes(y)) && (months[0] === '' || months.includes(m)));                  //we want it toggled
                })

            }
        }





    };
    return chart;

};