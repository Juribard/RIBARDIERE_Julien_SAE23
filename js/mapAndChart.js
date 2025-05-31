function displayChart(labels, tempMin, tempMax, probRain, sunHours, windSpeed, rr10, latitude, longitude) {
  let existingCanvas = document.getElementById("weatherChart");
  if (existingCanvas) {
    existingCanvas.remove();
  }

  let chartContainer = document.getElementById("chartContainer");
  let canvas = document.createElement("canvas");
  canvas.id = "weatherChart";
  chartContainer.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  let datasets = [
    {
      label: "Température min",
      data: tempMin,
      borderColor: "blue",
      fill: false,
    },
    {
      label: "Température max",
      data: tempMax,
      borderColor: "red",
      fill: false,
    },
    {
      label: "Probabilité de pluie",
      data: probRain,
      borderColor: "purple",
      fill: false,
    },
    {
      label: "Ensoleillement",
      data: sunHours,
      borderColor: "yellow",
      fill: false,
    }
  ];

  // Ajouter uniquement les données optionnelles si les cases sont cochées
  if (document.getElementById("windSpeed").checked) {
    datasets.push({
      label: "Vitesse du vent",
      data: windSpeed,
      borderColor: "green",
      fill: false,
    });
  }

  if (document.getElementById("rainfall").checked) {
    datasets.push({
      label: "Cumul de pluie",
      data: rr10,
      borderColor: "cyan",
      fill: false,
    });
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}