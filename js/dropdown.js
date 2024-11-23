// Data for dropdown options
const months = [
    "January", "February", "March", "April", "May", 
    "June", "July", "August", "September", "October", 
    "November", "December"
  ];
  const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]; // Add or modify years as needed
  const mbtaLines = ["Red Line", "Green Line", "Blue Line", "Orange Line"];
  
  // Populate months dropdown
  const monthSelect = document.querySelector('select[name="monthInput"]');
  months.forEach(month => {
    const option = document.createElement("option");
    option.value = month; // Use the month name as the value
    option.textContent = month;
    monthSelect.appendChild(option);
  });
  
  // Populate years dropdown
  const yearSelect = document.querySelector('select[name="yearInput"]');
  years.forEach(year => {
    const option = document.createElement("option");
    option.value = year; // Use the year as the value
    option.textContent = year;
    yearSelect.appendChild(option);
  });
  
  // Populate MBTA lines dropdown
  const lineSelect = document.querySelector('select[name="lineInput"]');
  mbtaLines.forEach(line => {
    const option = document.createElement("option");
    option.value = line; 
    option.textContent = line;
    lineSelect.appendChild(option);
  });
  