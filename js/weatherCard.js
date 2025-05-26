function createCard(data) {
  
  // Créer de nouvelles divs
  let weatherName = document.createElement("div");
  let weatherTmin = document.createElement("div");
  let weatherTmax = document.createElement("div");
  let weatherPrain = document.createElement("div");
  let weatherSunHours = document.createElement("div");
  let weatherlatitude = document.createElement("div");
  let weatherlongitude = document.createElement("div");
  let weatherPluieCumul = document.createElement("div");
  let weatherwind10m = document.createElement("div");
  let weatherwindDirection = document.createElement("div");

  // Ajouter du contenu aux div
  weatherName.textContent = `${data.city.name} (${data.city.cp})`;
  weatherTmin.textContent = `température minimale : ${data.forecast.tmin}°C`;
  weatherTmax.textContent = `température maximale : ${data.forecast.tmax}°C`;
  weatherPrain.textContent = `Probabilité de pluie : ${data.forecast.probarain}%`;
  weatherSunHours.textContent = `Ensoleillement journalier : ${displayHours(data.forecast.sun_hours)}`;
  weatherlatitude.textContent = `Latitude : ${data.forecast.latitude}`;
  weatherlongitude.textContent = `Longitude : ${data.forecast.longitude}`
  weatherPluieCumul.textContent = `Cumul de pluie : ${data.forecast.rr10} mm`;
  weatherwind10m.textContent = `Vent moyen : ${data.forecast.wind10m} km/h`;
  weatherwindDirection.textContent = `Direction du vent : ${data.forecast.dirwind10m}°`;


  // Sélectionner les sections
  let weatherSection = document.getElementById("weatherInformation");
  let requestSection = document.getElementById("cityForm");
  // Ajouter les nouvelles div à la section

  weatherSection.appendChild(weatherName);
  weatherSection.appendChild(weatherTmin);
  weatherSection.appendChild(weatherTmax);
  weatherSection.appendChild(weatherPrain);
  weatherSection.appendChild(weatherSunHours);
  if (document.getElementById("latitude").checked) {
    weatherSection.appendChild(weatherlatitude)
  }
  if (document.getElementById("longitude").checked) {
    weatherSection.appendChild(weatherlongitude)
  }
  if (document.getElementById("rainfall").checked) {
    weatherSection.appendChild(weatherPluieCumul)
  }
  if (document.getElementById("windSpeed").checked) {
    weatherSection.appendChild(weatherwind10m);
  }
  if (document.getElementById("windDirection").checked) {
    weatherSection.appendChild(weatherwindDirection);
  }


  // Ajouter un bouton de retour vers le formulaire
  let reloadButton = document.createElement("div");
  reloadButton.textContent = "Nouvelle recherche";
  reloadButton.classList.add("reloadButton");
  document.body.appendChild(reloadButton);
  // Ajouter un listener sur le bouton
  reloadButton.addEventListener("click", function () {
    location.reload();
  });

  // Gérer la visibilité des sections
  requestSection.style.display = "none";
  weatherSection.style.display = "flex";
  
}

function displayHours(sunHours) {
  return sunHours + (sunHours > 1 ? " heures" : " heure");
}
