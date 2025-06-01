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
        let graphiqueDiv = document.querySelector('.graphique');
    if (graphiqueDiv) {
        resultSection.appendChild(graphiqueDiv);
    }
    resultSection.style.display = "block";
};

window.showTemperatureChart = function(dataArray) {
    // Prépare les labels (dates)
    const labels = dataArray.map(day => {
        if (day.datetime) {
            const date = new Date(day.datetime);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}`;
        }
        return "Date";
    });
    // Prépare les datasets
    const tmin = dataArray.map(day => day.tmin);
    const tmax = dataArray.map(day => day.tmax);
    const tavg = dataArray.map(day => (day.tmin + day.tmax) / 2);

    // Détruit l'ancien graphique s'il existe
    if (window.tempChartInstance) window.tempChartInstance.destroy();

    const ctx = document.getElementById('tempChart').getContext('2d');
    window.tempChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Température min (°C)',
                    data: tmin,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0,0,255,0.1)',
                    fill: false
                },
                {
                    label: 'Température max (°C)',
                    data: tmax,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,0,0,0.1)',
                    fill: false
                },
                {
                    label: 'Température moyenne (°C)',
                    data: tavg,
                    borderColor: 'orange',
                    backgroundColor: 'rgba(255,165,0,0.1)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Évolution des températures' }
            }
        },
        plugins: [{
            // Ce plugin dessine le fond blanc avant le rendu du graphique
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }]
    });
};

window.showSunChart = function(dataArray) {
    const labels = dataArray.map(day => {
        if (day.datetime) {
            const date = new Date(day.datetime);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}`;
        }
        return "Date";
    });
    const sunHours = dataArray.map(day => day.sun_hours);

    // Détruit l'ancien graphique s'il existe
    if (window.sunChartInstance) window.sunChartInstance.destroy();

    const ctx = document.getElementById('sunChart').getContext('2d');
    window.sunChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "Ensoleillement (heures)",
                data: sunHours,
                backgroundColor: 'gold',
                borderColor: 'orange',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Ensoleillement par jour" }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Heures" }
                }
            }
        },
        plugins: [{
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }]
    });
};