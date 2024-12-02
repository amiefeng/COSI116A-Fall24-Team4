function filter(){
  function chart(){
// Data for dropdown options
const months = [
    "01", "02", "03", "04", "05", 
    "06", "07", "08", "09", "10", 
    "11", "12"
  ];
  const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]; // Add or modify years as needed
  const mbtaLines = ["Red Line", "Green Line", "Blue Line", "Orange Line"];
  
  // Populate the months dropdown
  const monthSelect = document.querySelector('select[name="monthInput"]');
  months.forEach(month => {
    const option = document.createElement("option");
    option.value = month; // Use the month name as the value
    option.textContent = month;
    monthSelect.appendChild(option);
  });
  
  // Populate the years dropdown
  const yearSelect = document.querySelector('select[name="yearInput"]');
  years.forEach(year => {
    const option = document.createElement("option");
    option.value = year; // Use the year as the value
    option.textContent = year;
    yearSelect.appendChild(option);
  });
  
  // Populate the MBTA lines dropdown
  const lineSelect = document.querySelector('select[name="lineInput"]');
  mbtaLines.forEach(line => {
    const option = document.createElement("option");
    option.value = line; // Use the line name as the value
    option.textContent = line;
    lineSelect.appendChild(option);
  });
}
return chart;
}