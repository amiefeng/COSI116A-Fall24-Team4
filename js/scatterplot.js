function scatterplot(){
    var margin = {top: 50, right: 50, bottom: 70, left: 85},
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

    

    function chart(){
        

    //define SVG
    var svg = d3.select("#vis-svg")
        .append("svg")
        .attr("width", width + margin.left + margin.right) 
        .attr("height", height + margin.top + margin.bottom) 
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // load CSV
    d3.csv("data/rapid_transit_ridership_and_reliability_m_y_l.csv", function(error, data) {


        console.log(data);

        data.forEach(d => {
            d.reliability_quotient =  +d.expected_time / +d.actual_time * 100; // create reliability quotient by dividing expected time by actual time and multplying by 100
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
        .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
        .style("text-anchor", "middle")
        .text("Reliability");

        // add y-axis label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Monthly Ridership"); 

        // add y-axis
        svg.append("g")
            .call(d3.axisLeft(y)); 

        // define colors corresponding to lines
        var color = d3.scaleOrdinal()
            .domain(["Red Line", "Blue Line", "Green Line", "Orange Line"])
            .range(["#ff0000", "#0000ff", "#00ff00", "#ff8000"]);
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
                    console.log(x0)
            
                    // If within the bounds of the brush, select it
                    selectableElements.classed("selected", d =>
                        x0 <= x(d.reliability_quotient) && x(d.reliability_quotient) <= x1 && y0 <= y(d.average_monthly_ridership) && y(d.average_monthly_ridership) <= y1
                    )
            
                    // Get the name of our dispatcher's event
                    let dispatchString = "selectionUpdated";
            
                    console.log(dispatchString);
                    // Let other charts know about our selection
                    scatPlotDispatcher.call(dispatchString, this, svg.selectAll(".selected").data());
                    }
                    
                    function brushEnd(){
                    // We don't want infinite recursion
                    if(d3.event.sourceEvent.type!="end"){
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
            .attr("cx", function(d) { return x(+d.reliability_quotient); }) 
            .attr("cy", function(d) { return y(+d.average_monthly_ridership); }) 
            .attr("r", 2) // Radius
            .style("fill", function(d) { return color(d.route_or_line); })
            .attr("class", d => String(d.route_or_line).split(" ")[0])
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity",8);
                tooltip.html(`Line: ${d.route_or_line}<br/>` + 
                            `Reliability: ${(parseFloat(d.reliability_quotient).toFixed(2))}<br/>` +
                            `Ridership: ${d.average_monthly_ridership}`)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            // Add mouseout event
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })


 
        
        /**
         * 
         * @param {*} data_subset 
         * @returns slope and intercept for linear regression of subset of data
         */
        function linearRegression(data_subset){
            const n_elements = data_subset.length;
            const sum_x = d3.sum(data_subset, d => d.reliability_quotient);
            const sum_y = d3.sum(data_subset, d => d.average_monthly_ridership);
            const sum_x_y = d3.sum(data_subset, d => d.reliability_quotient*d.average_monthly_ridership);
            const sum_x_2 = d3.sum(data_subset, d => d.reliability_quotient*d.reliability_quotient);

            console.log(n_elements, sum_x, sum_y, sum_x_y, sum_x_2)

            const slope = (n_elements * sum_x_y - sum_x * sum_y) / (n_elements * sum_x_2 - sum_x * sum_x);
            const intercept = (sum_y - slope * sum_x) / n_elements;
            console.log(slope, intercept)

            return {slope, intercept};
        }
        console.log("Invalid Rows:", data.filter(d => d.route_or_line == null));


        //groups data by line for linear regression of each group
        const groupedData = d3.nest()
        .key(d => d.route_or_line)
        .entries(data);        console.log("Grouped Data:", groupedData);

                
        groupedData.forEach(group => {
            const key = group.key;       
            const values = group.values; 
        
            const {slope, intercept} = linearRegression(values);
            const x1 = d3.min(values, d => d.reliability_quotient);
            const x2 = d3.max(values, d => d.reliability_quotient);
            const y1 = slope * x1 + intercept;
            const y2 = slope * x2 + intercept;
            console.log({x1, x2, y1, y2});
        

            svg.append("line")
                .attr("x1", x(x1))
                .attr("y1", y(y1))
                .attr("x2", x(x2))
                .attr("y2", y(y2))
                .style("stroke", color(key))
                .style("stroke-width", 2);
        });

        console.log("data", data)
        var {slope, intercept} = linearRegression(data);
        var x1_total = d3.min(data, d => d.reliability_quotient);
            var x2_total = d3.max(data, d => d.reliability_quotient);
            var y1_total = slope * x1_total + intercept;
            var y2_total = slope * x2_total + intercept;
            console.log("total_slope:", slope)
            console.log("total_intercept:", intercept)
            console.log("y1_total, y2_total:", y1_total, y2_total);
            console.log("y scale domain:", y.domain());
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
    chart.updateSelection = function (dispatchString) {
        if(dispatchString[0] === "filter"){
            lines = dispatchString[1]
            selectableElements.each(function(d){

               if(lines[0] === 'All Lines'){
                    d3.select(this).classed("unfiltered", false) //set to unfiltered if we want everything filteredgit
                } else{
                    d3.select(this).classed("unfiltered", true)
                    for(i = 0; i < lines.length; i ++){
                        console.log(d3.select(this))
                        console.log(lines[i].split(" ")[0])
                        console.log(d3.select(this).classed(lines[i].split(" ")[0]))
                        d3.select(this).classed("unfiltered", d3.select(this).classed("unfiltered") && !d3.select(this).classed(lines[i].split(" ")[0])) //update unfiltered to false if it is in one of the filtered classes, keep false if already set to false
                    }
                }

            })
        }
        else{
            if (!arguments.length) return;
            console.log(dispatchString + ":D")
            dispatchString = dispatchString[0]
            if(dispatchString === "CLEAR"){                               //if we get a CLEAR message, just clear everything
                selectableElements.classed("selected", false);
            } else{
                let year_and_month = dispatchString.split("/");

                selectableElements.each(function(d){                                //for each selectable element
                    let isSelected = d3.select(this).classed("selected");           //whether element currently selected
                    if(year_and_month[0]=== "All Years"){                            //if all years
                        if(year_and_month[1] === "All Months"){                             //and all months
                            d3.select(this).classed("selected", true);                         //we want the element to be selected regardless of contents
                        } else if(d.year_month.split("/")[1] === year_and_month[1]){       //if element matches month
                            d3.select(this).classed("selected", !isSelected);                  //we want it toggled
                        }
                    } else if(year_and_month[1] === "All Months"){                   //if all months
                        if(d.year_month.split("/")[0] === year_and_month[0]){        //if we have a month match
                            d3.select(this).classed("selected", !isSelected);        //toggle selection
                        }
                    } else{                            
                        if(d.year_month === dispatchString){                           //if we have a year/month match
                            d3.select(this).classed("selected", !isSelected);       //toggle selection
                        }
                    }
                
                })
            }
        }

      
        


        };
        return chart;

    };