window.generateWeatherTable = function(dataArray, selectedOptions) {
    const resultSection = document.getElementById("weatherInformation");
    resultSection.innerHTML = "";

    let tableContainer = document.createElement("div");
    tableContainer.classList.add("weatherContainer");

    let headerRow = document.createElement("div");
    headerRow.classList.add("weatherRow", "headerRow");

    let firstHeader = document.createElement("div");
    firstHeader.classList.add("weatherCell", "headerCell");
    firstHeader.textContent = "Éléments météo";
    headerRow.appendChild(firstHeader);

    dataArray.forEach((_, index) => {
        let headerCell = document.createElement("div");
        headerCell.classList.add("weatherCell", "headerCell");
        headerCell.textContent = `Jour ${index + 1}`;
        headerRow.appendChild(headerCell);
    });

    tableContainer.appendChild(headerRow);

    let essentialElements = {
        "tmin": "Température min (°C)",
        "tmax": "Température max (°C)",
        "probarain": "Probabilité de pluie (%)",
        "sun_hours": "Ensoleillement (h)"
    };

    let selectableElements = {
        "rr10": "Cumul de pluie (mm)",
        "wind10m": "Vent moyen (km/h)",
        "dirwind10m": "Direction du vent (°)"
    };

    // Ajout des éléments essentiels
    Object.keys(essentialElements).forEach(element => {
        let row = document.createElement("div");
        row.classList.add("weatherRow");

        let labelCell = document.createElement("div");
        labelCell.classList.add("weatherCell", "labelCell");
        labelCell.textContent = essentialElements[element];
        row.appendChild(labelCell);

        dataArray.forEach(dayData => {
            let dataCell = document.createElement("div");
            dataCell.classList.add("weatherCell");
            dataCell.textContent = dayData[element] !== undefined ? dayData[element] : "-";
            row.appendChild(dataCell);
        });

        tableContainer.appendChild(row);
    });

    // Ajout des options sélectionnées
    selectedOptions.forEach(element => {
        if (!selectableElements[element]) return;

        let row = document.createElement("div");
        row.classList.add("weatherRow");

        let labelCell = document.createElement("div");
        labelCell.classList.add("weatherCell", "labelCell");
        labelCell.textContent = selectableElements[element];
        row.appendChild(labelCell);

        dataArray.forEach(dayData => {
            let dataCell = document.createElement("div");
            dataCell.classList.add("weatherCell");
            dataCell.textContent = dayData[element] !== undefined ? dayData[element] : "-";
            row.appendChild(dataCell);
        });

        tableContainer.appendChild(row);
    });

    resultSection.appendChild(tableContainer);
    if (dataArray.length > 1) {
      resultSection.classList.add("multiDays"); // ✅ Ajoute la classe si plusieurs jours sélectionnés
    } else {
      resultSection.classList.remove("multiDays"); // ❌ Supprime la classe si un seul jour
    }
    resultSection.style.display = "block";
};