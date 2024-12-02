// Calendar Visualization with D3
document.addEventListener('DOMContentLoaded', () => {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December'
    ];
  
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
    }
  
    // Listen for changes in the year dropdown
    const yearSelect = document.querySelector('select[name="yearInput"]');
    yearSelect.addEventListener('change', (event) => {
      createCalendar(event.target.value);
    });
  
    // Initialize calendar with current selected year
    createCalendar(yearSelect.value);
  });