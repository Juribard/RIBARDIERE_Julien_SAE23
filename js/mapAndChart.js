window.generateWeatherTable = function(dataArray, selectedOptions) {
    const resultSection = document.getElementById("weatherInformation");
    // Efface seulement le tableau précédent, pas tout le contenu
    const oldTable = resultSection.querySelector('.weatherContainer');
    if (oldTable) oldTable.remove();

    // ✅ Correction : Création du container au BON endroit
    let tableContainer = document.createElement("div");
    tableContainer.classList.add("weatherContainer");

    // ✅ Création de l'en-tête avec les dates réelles
    let headerRow = document.createElement("div");
    headerRow.classList.add("weatherRow", "headerRow");

    let firstHeader = document.createElement("div");
    firstHeader.classList.add("weatherCell", "headerCell");
    firstHeader.textContent = "Éléments météo";
    headerRow.appendChild(firstHeader);

    dataArray.forEach(dayData => {
        let headerCell = document.createElement("div");
        headerCell.classList.add("weatherCell", "headerCell");
        
        // ✅ Vérifier que `datetime` existe avant de le convertir
        if (dayData.datetime) {
            let date = new Date(dayData.datetime);
            let formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            headerCell.textContent = formattedDate;
        } else {
            headerCell.textContent = "Date inconnue";
        }
        
        headerRow.appendChild(headerCell);
    });

    // ✅ Ajout de l'en-tête AVANT les données
    tableContainer.appendChild(headerRow);

    // ✅ Fusionner l'en-tête avec les données
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

    // 1) On part des éléments toujours visibles
    let elementsToShow = { ...essentialElements };

    // 2) On n’ajoute que les options réellement cochées
    selectedOptions.forEach(mappedID => {
    if (selectableElements[mappedID]) {
        elementsToShow[mappedID] = selectableElements[mappedID];
    }
    });

    // 3) On boucle uniquement sur ces clés
    Object.keys(elementsToShow).forEach(elementKey => {
    let row = document.createElement("div");
    row.classList.add("weatherRow");

    // cellule d’étiquette
    let labelCell = document.createElement("div");
    labelCell.classList.add("weatherCell", "labelCell");
    labelCell.textContent = elementsToShow[elementKey];
    row.appendChild(labelCell);

    // cellule par jour
    dataArray.forEach(dayData => {
        let dataCell = document.createElement("div");
        dataCell.classList.add("weatherCell");
        dataCell.textContent = dayData[elementKey] !== undefined ? dayData[elementKey] : "-";
        row.appendChild(dataCell);
    });

    tableContainer.appendChild(row);
    });

    // ✅ Ajout du tableau dans la section d'affichage
    resultSection.appendChild(tableContainer);
    resultSection.style.display = "block";
};