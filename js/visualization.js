const dispatchString = "selectionUpdated"; //this updates the selection of the points on the scatterplot
const dispatchMonth = "monthUpdated"; //this corresponds ot a specific combination of month/year, with the points on the scatterplot
                                      //corresponding to this combination being selected

//create dispatchers for different events
let scatterPlotDispatcher = d3.dispatch(dispatchString);
let calendarDispatcher = d3.dispatch(dispatchMonth);

//initialize scatterplot/dispatcher
let scatterPlot = scatterplot().selectionDispatcher(scatterPlotDispatcher);
scatterPlot();

//initialize calendar/dispatcher
let ourCalendar = calendar().selectionDispatcher(calendarDispatcher);
ourCalendar();

//listen for monthUpdated event (this is currently the only linking we have)
calendarDispatcher.on(dispatchMonth, function (monthString) {
    scatterPlot.updateSelection(monthString);
});
