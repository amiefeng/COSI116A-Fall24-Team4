var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//define SVG
var svg = d3.select("#vis-svg")
    .append("svg")
    .attr("width", width + margin.left + margin.right) 
    .attr("height", height + margin.top + margin.bottom) 
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// load CSV
d3.csv("../data/rapid_transit_ridership_and_reliability_m_y_l.csv", function(error, data) {


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

    // add y-axis
    svg.append("g")
        .call(d3.axisLeft(y)); 

    // define colors corresponding to lines
    var color = d3.scaleOrdinal()
        .domain(["Red Line", "Blue Line", "Green Line", "Orange Line"])
        .range(["#ff0000", "#0000ff", "#00ff00", "#ff8000"]);

    // populate
    svg.append("g")
        .selectAll("circle")
        .data(data) 
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(+d.reliability_quotient); }) 
        .attr("cy", function(d) { return y(+d.average_monthly_ridership); }) 
        .attr("r", 2) // Radius
        .style("fill", function(d) { return color(d.route_or_line); }); 
    
    
    /**
     * 
     * @param {*} data_subset 
     * @returns slope and intercept for linear regression of subse t of data
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