// Calendar Visualization with D3 and Year Selection

const monthsToNumbers = {
  "January": "01",
  "February": "02",
  "March": "03",
  "April": "04",
  "May": "05",
  "June": "06",
  "July": "07",
  "August": "08",
  "September": "09",
  "October": "10",
  "November": "11",
  "December": "12",
  "All Months": "All Months"
};

function calendar(){
    let dispatcher;
  function chart(){
  document.addEventListener('DOMContentLoaded', () => {
      const monthNames = [
          'January', 'February', 'March',
          'April', 'May', 'June',
          'July', 'August', 'September',
          'October', 'November', 'December'
      ];
  
      // Years to include in the selection
      const years = ['All Years', ...Array.from({ length: 9 }, (_, i) => 2016 + i)];
  
  
      function dispatchMonth(monthString){         
          console.log("called")                                     //let other charts know what has been selected (table.js)
          dispatcher.call("monthUpdated", this, monthString);
        }
  
  
      // Select the calendar container in the HTML
      const calendarContainer = d3.select('#calendar');
  
      // Create a container for the entire calendar section
      const calendarWrapper = d3.select('#calendar').append('div')
          .style('display', 'flex')
          .style('gap', '20px');
  
      // Create year selection sidebar
      const yearSidebar = calendarWrapper.append('div')
          .attr('class', 'year-selection-sidebar')
          .style('width', '200px')
          .style('background-color', '#f9f9f9')
          .style('border', '1px solid #e0e0e0')
          .style('border-radius', '8px')
          .style('padding', '15px')
          .style('height', 'fit-content');
  
      // Add "Select Year(s)" heading
      yearSidebar.append('div')
          .style('text-align', 'center')
          .style('font-size', '20px')
          .style('font-weight', 'bold')
          .style('margin-bottom', '15px')
          .style('color', 'rgb(109, 46, 109)')
          .text('Select Year(s)');
  
      // Create year selection grid
      const yearGrid = yearSidebar.append('div')
          .style('display', 'grid')
          .style('grid-template-columns', 'repeat(2, 1fr)')
          .style('grid-gap', '10px');
  
      // Store selected years
      let selectedYears = ['All Years'];
  
      // Function to toggle year selection
      function toggleYearSelection(year) {
          if (year === 'All Years') {
              // If "All Years" is selected, clear other selections
              selectedYears = ['All Years'];
              yearGrid.selectAll('.year-cell')
                  .style('background-color', d => d === 'All Years' ? 'rgb(109, 46, 109)' : '#fff')
                  .style('color', d => d === 'All Years' ? '#fff' : '#000');
          } else {
              // Remove "All Years" if it's selected
              if (selectedYears.includes('All Years')) {
                  selectedYears = [];
              }
  
              // Toggle the specific year
              if (selectedYears.includes(year)) {
                  selectedYears = selectedYears.filter(y => y !== year);
              } else {
                  selectedYears.push(year);
              }
  
              // Update button styles
              yearGrid.selectAll('.year-cell')
                  .style('background-color', d => {
                      if (d === 'All Years') return '#fff';
                      return selectedYears.includes(d) ? 'rgb(109, 46, 109)' : '#fff';
                  })
                  .style('color', d => {
                      if (d === 'All Years') return '#000';
                      return selectedYears.includes(d) ? '#fff' : '#000';
                  });
          }
  
          // Update calendar based on selected years
          updateCalendar();
      }
  
      // Create year selection buttons
      yearGrid.selectAll('.year-cell')
          .data(years)
          .enter()
          .append('div')
          .attr('class', 'year-cell')
          .style('border', '1px solid #ccc')
          .style('padding', '10px') 
          .style('text-align', 'center')
          .style('cursor', 'pointer')
          .style('background-color', d => d === 'All Years' ? 'rgb(109, 46, 109)' : '#fff')
          .style('color', d => d === 'All Years' ? '#fff' : '#000')
          .text(d => d)
          .on('click', function(d) {
              toggleYearSelection(d);
          });
  
      // Create a container for the calendar grid
      const calendarContent = calendarWrapper.append('div')
          .attr('class', 'calendar-content')
          .style('flex-grow', '1')
          .style('position', 'relative'); // For positioning reset button
  
      // Add reset button
      const resetButton = calendarContent.append('div')
          .attr('class', 'reset-button')
          .style('position', 'absolute')
          .style('bottom', '10px')
          .style('right', '10px')
          .style('background-color', 'rgb(109, 46, 109)')
          .style('color', '#fff')
          .style('padding', '5px 10px')
          .style('border-radius', '5px')
          .style('cursor', 'pointer')
          .style('font-size', '12px')
          .text('Reset')
          .on('click', () => {
              dispatchMonth('CLEAR');
              toggleYearSelection('All Years');
              toggleMonthSelection('All Months');
          });
  
      // Function to update calendar
      let selectedMonths = [];
      function updateCalendar() {
          const currentYear = selectedYears.includes('All Years') ? 'All Years' : selectedYears.join(', ');
          createCalendar(currentYear);
      }
  
      // Function to create the calendar
      function createCalendar(year) {
          // Clear any existing calendar
          calendarContent.selectAll('*').filter(':not(.reset-button)').remove();
  
          // Create year heading
          calendarContent.append('div')
              .attr('class', 'calendar-year-heading')
              .style('text-align', 'center')
              .style('font-size', '20px')
              .style('font-weight', 'bold')
              .style('margin-bottom', '20px')
              .style('color', 'rgb(109, 46, 109)')
              .text(`Select Month(s)`);
  
          // Create a grid for months
          const monthGrid = calendarContent.append('div')
              .attr('class', 'month-grid')
              .style('display', 'grid')
              .style('grid-template-columns', 'repeat(3, 1fr)')
              .style('grid-gap', '10px');
  
          // Create month cells, starting with "All Months"
          const monthCells = monthGrid.selectAll('.month-cell')
              .data(['All Months', ...monthNames])
              .enter()
              .append('div')
              .attr('class', 'month-cell')
              .style('border', '1px solid #ccc')
              .style('padding', '10px')
              .style('text-align', 'center')
              .style('cursor', 'pointer')
              .style('background-color', d => {
                  if (d === 'All Months') {
                      return selectedMonths.length === 0 || selectedMonths.length === monthNames.length 
                          ? 'rgb(109, 46, 109)' 
                          : '#fff';
                  }
                  return selectedMonths.includes(d) ? 'rgb(109, 46, 109)' : '#fff';
              })
              .style('color', d => {
                  if (d === 'All Months') {
                      return selectedMonths.length === 0 || selectedMonths.length === monthNames.length 
                          ? '#fff' 
                          : '#000';
                  }
                  return selectedMonths.includes(d) ? '#fff' : '#000';
              })
              .text(d => d)
              .on('click', function(d) {
                  dispatchProtocol(year, d)
                  toggleMonthSelection(d);

                 
              });
      }

    
      /**
       * processes year and month before actually dispatching
       * @param {*} year 
       * @param {*} month 
       */
      function dispatchProtocol(year, month){
        date = year + "/" + monthsToNumbers[month]
                  console.log(selectedYears, selectedMonths);
                  if(monthsToNumbers[month] === "All Months" || selectedMonths.length == 0){
                    console.log("clearing!" + "yaer: " + year + "month: " + month + " :D")
                    dispatchMonth("CLEAR")
                  }
                  console.log("updating!" + ":D")
                  dispatchMonth(date)
      }
  
  
  
  
      // Function to toggle month selection
      function toggleMonthSelection(month) {
          if (month === 'All Months') {
              // If "All Months" is selected, clear other selections
              selectedMonths = [];
              updateMonthStyles();
          } else {
              // Remove "All Months" from considerations
              const allMonthsIndex = selectedMonths.indexOf('All Months');
              if (allMonthsIndex > -1) {
                  selectedMonths.splice(allMonthsIndex, 1);
              }
  
              // Toggle the specific month
              if (selectedMonths.includes(month)) {
                  selectedMonths = selectedMonths.filter(m => m !== month);
              } else {
                  selectedMonths.push(month);
              }
  
              updateMonthStyles();
          }
      }
  
      // Function to update month styles
      function updateMonthStyles() {
          calendarContent.selectAll('.month-cell')
              .style('background-color', d => {
                  if (d === 'All Months') {
                      return selectedMonths.length === 0 || selectedMonths.length === monthNames.length 
                          ? 'rgb(109, 46, 109)' 
                          : '#fff';
                  }
                  return selectedMonths.includes(d) ? 'rgb(109, 46, 109)' : '#fff';
              })
              .style('color', d => {
                  if (d === 'All Months') {
                      return selectedMonths.length === 0 || selectedMonths.length === monthNames.length 
                          ? '#fff' 
                          : '#000';
                  }
                  return selectedMonths.includes(d) ? '#fff' : '#000';
              });
      }
  
      // Initialize calendar with "All Years" and "All Months"
      createCalendar('All Years');
  });
    }
    chart.selectionDispatcher = function (_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
    };
    return chart;
  
  
  }  