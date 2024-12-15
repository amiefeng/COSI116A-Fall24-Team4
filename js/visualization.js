const dispatchString = "selectionUpdated"; //this updates the selection of the points on the scatterplot
const dispatchCalendar = "calendarUpdated"; //this corresponds ot a specific combination of month/year, with the points on the scatterplot
                                      //corresponding to this combination being selected
const dispatchLine = "lineUpdated"

                                      //create dispatchers for different events
let scatterPlotDispatcher = d3.dispatch(dispatchString);
let calendarDispatcher = d3.dispatch(dispatchCalendar);
let filterDispatcher = d3.dispatch(dispatchLine);
let mapDispacher = d3.dispatch(dispatchString);

//initialize scatterplot/dispatcher
let scatterPlot = scatterplot().selectionDispatcher(scatterPlotDispatcher);
scatterPlot();
let mapLine = map().selectionDispatcher(scatterPlotDispatcher);
mapLine();
//initialize calendar/dispatcher
let ourCalendar = calendar().selectionDispatcher(calendarDispatcher);
ourCalendar();
//listen for monthUpdated event (this is currently the only linking we have)
calendarDispatcher.on(dispatchCalendar, function (calenderString) {
    scatterPlot.processDispatch([dispatchCalendar, calenderString]);
});
let ourFilter = filter().selectionDispatcher(filterDispatcher);
//listen for selected map event (this is currently the only linking we have)
filterDispatcher.on(dispatchLine, function(lines){
    scatterPlot.processDispatch(["filter", lines]) // Update scatterplot
    mapLine.processDispatch(["filter", lines]) // Update map lines
})

ourFilter();