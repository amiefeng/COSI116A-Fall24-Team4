  const mbtaLines = ["Red Line", "Green Line", "Blue Line", "Orange Line"];
  
  // Populate the MBTA lines dropdown
  const lineSelect = document.querySelector('select[name="lineInput"]');
  mbtaLines.forEach(line => {
    const option = document.createElement("option");
    option.value = line; // Use the line name as the value
    option.textContent = line;
    lineSelect.appendChild(option);
  });
  