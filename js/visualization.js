const dispatchString = "selectionUpdated"; //this updates the selection of the points on the scatterplot
const dispatchCalendar = "calendarUpdated"; //this corresponds ot a specific combination of month/year, with the points on the scatterplot
                                      //corresponding to this combination being selected
const dispatchLine = "lineUpdated"
                                      //create dispatchers for different events
let scatterPlotDispatcher = d3.dispatch(dispatchString);
let calendarDispatcher = d3.dispatch(dispatchCalendar);
let filterDispatcher = d3.dispatch(dispatchLine);
let mapDispatcher = d3.dispatch(dispatchString);

// Initialize the scatterplot and connect it to the dispatcher
let scatterPlot = scatterplot().selectionDispatcher(scatterPlotDispatcher);
scatterPlot();

// Initialize the calendar and connect it to the dispatcher
let ourCalendar = calendar().selectionDispatcher(calendarDispatcher);
ourCalendar();
//listen for monthUpdated event (this is currently the only linking we have)
calendarDispatcher.on(dispatchCalendar, function (calenderString) {
    scatterPlot.processDispatch([dispatchCalendar, calenderString]);
});

// Initialize the map and connect it to the dispatcher
let mapComponent = map().selectionDispatcher(mapDispatcher);
mapComponent();

d3.select("#mbta-map") // Ensure this matches your HTML container
  .datum('data/testingline.json')          // Provide your data here
  .call(mapComponent);

// Initialize the filter and connect it to the dispatcher
let ourFilter = filter().selectionDispatcher(filterDispatcher);
filterDispatcher.on(dispatchLine, function(lines){
    scatterPlot.processDispatch(["filter", lines])
})
ourFilter();