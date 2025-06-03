window.generateWeatherTable = function(dataArray, selectedOptions) {
    const resultSection = document.getElementById("weatherInformation");
    // Efface seulement le tableau précédent, pas tout le contenu
    const oldTable = resultSection.querySelector('.weatherContainer');
    if (oldTable) oldTable.remove();

    // Création du container
    let tableContainer = document.createElement("div");
    tableContainer.classList.add("weatherContainer");

    // Création de l'en-tête avec les dates 
    let headerRow = document.createElement("div");
    headerRow.classList.add("weatherRow", "headerRow");

    let firstHeader = document.createElement("div");
    firstHeader.classList.add("weatherCell", "headerCell");
    firstHeader.textContent = "Éléments météo";
    headerRow.appendChild(firstHeader);

    dataArray.forEach(dayData => {
        let headerCell = document.createElement("div");
        headerCell.classList.add("weatherCell", "headerCell");
        
        // Vérifie que `datetime` existe avant de le convertir
        if (dayData.datetime) {
            let date = new Date(dayData.datetime);
            let formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            headerCell.textContent = formattedDate;
        } else {
            headerCell.textContent = "Date inconnue";
        }
        
        headerRow.appendChild(headerCell);
    });

    // Ajout de l'en-tête AVANT les données
    tableContainer.appendChild(headerRow);

    // Fusionner l'en-tête avec les données
    let essentialElements = {
        "tmin": "Température min (°C)",
        "tmax": "Température max (°C)",
        "probarain": "Probabilité de pluie (%)",
        "sun_hours": "Ensoleillement (h)"
    };

    const optionIdToDataKey = {
        rainfall: "rr10",
        windSpeed: "wind10m",
        windDirection: "dirwind10m"
    };

    // Libellés pour l'affichage
    const selectableElements = {
        rainfall: "Cumul de pluie (mm)",
        windSpeed: "Vent moyen (km/h)",
        windDirection: "Direction du vent (°)"
};

    // 1) On part des éléments toujours visibles
    let elementsToShow = { ...essentialElements };

    // 2) On n’ajoute que les options réellement cochées
    selectedOptions.forEach(optionId => {
        if (selectableElements[optionId]) {
            elementsToShow[optionId] = selectableElements[optionId];
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
        // Utilise le mapping pour les options sélectionnées, sinon la clé directe (pour les essentiels)
        let dataKey = optionIdToDataKey[elementKey] || elementKey;
        dataCell.textContent = dayData[dataKey] !== undefined ? dayData[dataKey] : "-";
        row.appendChild(dataCell);
    });

    tableContainer.appendChild(row);
    });

    // Ajout du tableau dans la section d'affichage
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

window.showRainChart = function(dataArray, showRain) {
    const labels = dataArray.map(day => {
        if (day.datetime) {
            const date = new Date(day.datetime);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}`;
        }
        return "Date";
    });
    const rain = dataArray.map(day => day.rr10); // cumul de pluie (mm)
    const prob = dataArray.map(day => day.probarain); // probabilité de pluie (%)

    // Détruit l'ancien graphique s'il existe
    if (window.rainChartInstance) window.rainChartInstance.destroy();

    const ctx = document.getElementById('rainChart').getContext('2d');
    let datasets = [
        {
            type: 'line',
            label: 'Probabilité de pluie (%)',
            data: prob,
            borderColor: 'green',
            backgroundColor: 'rgba(0,255,0,0.1)',
            fill: false,
            yAxisID: 'y1',
            tension: 0.2,
            pointRadius: 4
        }
    ];
    if (showRain) {
        datasets.unshift({
            type: 'bar',
            label: 'Cumul de pluie (mm)',
            data: rain,
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'blue',
            borderWidth: 1,
            yAxisID: 'y2'
        });
    }

    window.rainChartInstance = new Chart(ctx, {
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: showRain ? "Cumul & Probabilité de pluie" : "Probabilité de pluie" }
            },
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                min: 0,
                max: 100,
                title: { display: true, text: "Probabilité (%)" }
            },
            ...(showRain ? {
                y2: {
                    type: 'linear',
                    position: 'right',
                    min: 0,
                    title: { display: true, text: "Cumul (mm)" },
                    grid: { drawOnChartArea: false }
                }
            } : {})
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

window.showWindChart = function(dataArray) {
    const labels = dataArray.map(day => {
        if (day.datetime) {
            const date = new Date(day.datetime);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}`;
        }
        return "Date";
    });
    const wind = dataArray.map(day => day.wind10m);

    if (window.windChartInstance) window.windChartInstance.destroy();

    const ctx = document.getElementById('windChart').getContext('2d');
    window.windChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Vent moyen (km/h)",
                data: wind,
                borderColor: 'purple',
                backgroundColor: 'rgba(128,0,128,0.1)',
                fill: false,
                tension: 0.2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: "Évolution du vent moyen" }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "km/h" }
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