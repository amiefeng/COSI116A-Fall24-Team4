const dispatchString = "selectionUpdated"
const dispatchMonth = "monthUpdated"

let scatterPlotDispatcher = d3.dispatch(dispatchString);
let calendarDispatcher = d3.dispatch(dispatchMonth);

console.log(scatterPlotDispatcher, calendarDispatcher)

let scatterPlot = scatterplot().selectionDispatcher(scatterPlotDispatcher);
scatterPlot();
let ourFilter = filter();
ourFilter();
let ourCalendar = calendar().selectionDispatcher(calendarDispatcher);
ourCalendar();
calendarDispatcher.on(dispatchMonth, function(monthString){
    console.log("shiggydiggy")
    scatterPlot.updateSelection(monthString);    
});