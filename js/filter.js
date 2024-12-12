function filter(){
    function chart(){
        document.addEventListener('DOMContentLoaded', () => {
        // Lines to include in the selection
        const lines = ['All Lines', 'Red Line', 'Green Line', 'Blue Line', 'Orange Line'];

        // Select the filter menu container in the HTML
        const filterContainer = d3.select('#filterMenu');

        // Create a container for the entire line filter section
        const filterWrapper = filterContainer.append('div')
            .attr('class', 'filter-wrapper');

        // Add "Select Lines" heading
        filterWrapper.append('div')
            .attr('class', 'filter-heading')
            .text('Select Line(s)');

        // Create line selection grid
        const lineGrid = filterWrapper.append('div')
            .attr('class', 'line-grid');

        // Store selected lines
        let selectedLines = ['All Lines'];

        // Function to toggle line selection
        function toggleLineSelection(line) {
            if (line === 'All Lines') {
                // If "All Lines" is selected, clear other selections
                selectedLines = ['All Lines'];
                lineGrid.selectAll('.line-cell')
                    .classed('selected', false)
                    .classed('all-lines', d => d === 'All Lines');
            } else {
                // Remove "All Lines" if it's selected
                if (selectedLines.includes('All Lines')) {
                    selectedLines = [];
                }

                // Toggle the specific line
                if (selectedLines.includes(line)) {
                    selectedLines = selectedLines.filter(l => l !== line);
                } else {
                    selectedLines.push(line);
                }

                // Update button styles
                lineGrid.selectAll('.line-cell')
                    .classed('selected', d => selectedLines.includes(d) && d !== 'All Lines')
                    .classed('all-lines', false);
            }
            return selectedLines;
        }

        // Helper function to assign a class based on line name
        const getLineClass = (line) => {
            return line.toLowerCase().replace(' ', '-');
        };

        // Create line selection buttons
        lineGrid.selectAll('.line-cell')
            .data(lines)
            .enter()
            .append('div')
            .attr('class', d => `line-cell ${getLineClass(d)}`)
            .text(d => d)
            .on('click', function(d) {
                dispatchLine(toggleLineSelection(d))
            });

        // Add reset button
        const resetButton = filterWrapper.append('div')
            .attr('class', 'filter-reset-button')
            .text('Reset')
            .on('click', () => {
                dispatchLine(toggleLineSelection('All Lines')            );
            });
        });

        function dispatchLine(selectedLines){         
            console.log("called")                                     
            dispatcher.call("lineUpdated", this, selectedLines);
        }
    }

      chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
      };
      return chart;

}