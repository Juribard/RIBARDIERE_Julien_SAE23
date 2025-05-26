function createCard(data) {
  // Sélectionner les éléments HTML statiques
  let weatherName = document.getElementById("weatherName");
  let weatherLatitude = document.getElementById("weatherLatitude");
  let weatherLongitude = document.getElementById("weatherLongitude");
  let weatherDetails = document.getElementById("weatherDetails");
  let weatherSection = document.getElementById("weatherInformation");

  // Mettre à jour le nom de la commune et ses coordonnées
  weatherName.textContent = `${data.city.name} (${data.city.cp})`;
  if (document.getElementById("latitude").checked) {
    weatherLatitude.textContent = `Latitude : ${data.forecast.latitude}`;
  }
  if (document.getElementById("longitude").checked) {
    weatherLongitude.textContent = `Longitude : ${data.forecast.longitude}`;
  }


  // Insérer les autres détails météo dans weatherDetails
  weatherDetails.innerHTML = `
      <p>Température minimale : ${data.forecast.tmin}°C</p>
      <p>Température maximale : ${data.forecast.tmax}°C</p>
      <p>Probabilité de pluie : ${data.forecast.probarain}%</p>
      <p>Ensoleillement journalier : ${displayHours(data.forecast.sun_hours)}</p>
  `;

  // Ajouter les options sélectionnées
  if (document.getElementById("rainfall").checked) {
      weatherDetails.innerHTML += `<p>Cumul de pluie : ${data.forecast.rr10} mm</p>`;
  }
  if (document.getElementById("windSpeed").checked) {
      weatherDetails.innerHTML += `<p>Vent moyen : ${data.forecast.wind10m} km/h</p>`;
  }
  if (document.getElementById("windDirection").checked) {
      weatherDetails.innerHTML += `<p>Direction du vent : ${data.forecast.dirwind10m}°</p>`;
  }

  // Ajouter un bouton de retour vers le formulaire en dehors des données météo
  let reloadButton = document.createElement("div");
  reloadButton.textContent = "Nouvelle recherche";
  reloadButton.classList.add("reloadButton");

  // Ajouter le bouton **en dehors** de weatherDetails
  weatherSection.appendChild(reloadButton);

  // Ajouter un listener sur le bouton pour recharger la page
  reloadButton.addEventListener("click", function () {
      location.reload();
  });

  // Gérer la visibilité des sections
  document.getElementById("cityForm").style.display = "none";
  document.getElementById("weatherInformation").style.display = "flex";
}


function displayHours(sunHours) {
  return sunHours + (sunHours > 1 ? " heures" : " heure");
}

function updateDateTime() {
  let now = new Date();
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let formattedDate = now.toLocaleDateString('fr-FR', options);
  let formattedTime = now.toLocaleTimeString('fr-FR');

  document.getElementById("currentDateTime").textContent = `${formattedDate} ; ${formattedTime}.`;
}

updateDateTime();