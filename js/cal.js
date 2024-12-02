// Calendar Visualization with D3
function calendar(){
function chart(){
  document.addEventListener('DOMContentLoaded', () => {
      const monthNames = [
        '01', '02', '03',
        '04', '05', '06',
        '07', '08', '09',
        '10', '11', '12'
      ];

      function dispatchMonth(monthString){         
        console.log("called")                                     //let other charts know what has been selected (table.js)
        dispatcher.call("monthUpdated", this, monthString);
      }
    
      // Select the calendar container in the HTML
      const calendarContainer = d3.select('#calendar');
    
      // Function to create the calendar
      function createCalendar(year) {
        // Clear any existing calendar
        calendarContainer.selectAll('*').remove();
    
        // Create year heading
        calendarContainer.append('div')
          .attr('class', 'calendar-year-heading')
          .style('text-align', 'center')
          .style('font-size', '24px')
          .style('font-weight', 'bold')
          .style('margin-bottom', '20px')
          .text(year);
    
        // Create a grid for months
        const monthGrid = calendarContainer.append('div')
          .attr('class', 'month-grid')
          .style('display', 'grid')
          .style('grid-template-columns', 'repeat(4, 1fr)')
          .style('grid-gap', '10px');
    
        // Create month cells
        monthGrid.selectAll('.month-cell')
          .data(monthNames)
          .enter()
          .append('div')
          .attr('class', 'month-cell')
          .style('border', '1px solid #ccc')
          .style('padding', '10px')
          .style('text-align', 'center')
          .text(d => d);

          
      let selectableMonthElements = monthGrid.selectAll('.month-cell')
      selectableMonthElements.on("click", function( d){
        d3.selectAll(".selected").classed("selected", false);
        d3.select(this).classed("selected", true); //(from table.js)
        dNumber = parseInt(d)
        formatedDNumber = '0'.repeat(2-dNumber.toString().length) + dNumber.toString()
        date = year + "/" + formatedDNumber
        console.log(date);
        dispatchMonth(date);
      })
      }

      
    
      // Listen for changes in the year dropdown
      const yearSelect = document.querySelector('select[name="yearInput"]');
      yearSelect.addEventListener('change', (event) => {
        createCalendar(event.target.value);
      });
    
      // Initialize calendar with current selected year
      createCalendar(yearSelect.value);
    });
  }
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };
  return chart;
}