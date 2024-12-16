// Define dispatch events
const dispatchString = "selectionUpdated";
const dispatchMonth = "monthUpdated";
const dispatchLine = "lineUpdated";

// Create dispatchers
let scatterPlotDispatcher = d3.dispatch(dispatchString);
let calendarDispatcher = d3.dispatch(dispatchMonth);
let filterDispatcher = d3.dispatch(dispatchLine);
let mapDispatcher = d3.dispatch(dispatchString);

// Initialize the scatterplot and connect it to the dispatcher
let scatterPlot = scatterplot().selectionDispatcher(scatterPlotDispatcher);
scatterPlot();

// Initialize the calendar and connect it to the dispatcher
let ourCalendar = calendar().selectionDispatcher(calendarDispatcher);
ourCalendar();

// Listen for updates from the calendar
calendarDispatcher.on(dispatchMonth, function (monthString) {
    scatterPlot.updateSelection([monthString]);
});

// Initialize the map and connect it to the dispatcher
let mapComponent = map().selectionDispatcher(mapDispatcher);
mapComponent();

d3.select("#mbta-map") // Ensure this matches your HTML container
  .datum('data/testingline.json')          // Provide your data here
  .call(mapComponent);

// Initialize the filter and connect it to the dispatcher
let ourFilter = filter().selectionDispatcher(filterDispatcher);

// Listen for selected line events and update both the scatterplot and map
filterDispatcher.on(dispatchLine, function (lines) {
    scatterPlot.updateSelection(["filter", lines]);
    mapComponent.updateSelection(["filter", lines]); // Update the map
});

// Initialize the filter
ourFilter();