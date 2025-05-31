window.generateWeatherTable = function(dataArray) {
    const resultSection = document.getElementById("weatherInformation");
    resultSection.innerHTML = "";

    let table = document.createElement("table");
    table.classList.add("weatherTable");

    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    let firstHeader = document.createElement("th");
    firstHeader.textContent = "Éléments météo";
    headerRow.appendChild(firstHeader);

    dataArray.forEach((dayData, index) => {
        let th = document.createElement("th");
        th.textContent = `Jour ${index + 1}`;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    let elements = ["tmin", "tmax", "probarain", "sun_hours", "rr10", "wind10m", "dirwind10m"];
    let labels = {
        "tmin": "Température min (°C)",
        "tmax": "Température max (°C)",
        "probarain": "Probabilité de pluie (%)",
        "sun_hours": "Ensoleillement (h)",
        "rr10": "Cumul de pluie (mm)",
        "wind10m": "Vent moyen (km/h)",
        "dirwind10m": "Direction du vent (°)"
    };

    elements.forEach(element => {
        let row = document.createElement("tr");
        let labelCell = document.createElement("td");
        labelCell.textContent = labels[element];
        row.appendChild(labelCell);

        dataArray.forEach(dayData => {
            let cell = document.createElement("td");
            cell.textContent = dayData[element] !== undefined ? dayData[element] : "-";
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultSection.appendChild(table);
    console.log("Tableau inséré dans le DOM :", table);
    resultSection.style.display = "block";
    resultSection.style.visibility = "visible";
};