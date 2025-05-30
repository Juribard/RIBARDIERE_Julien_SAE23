function createCard(data) {
  const cardsContainer = document.getElementById("weatherCardsContainer");
  cardsContainer.innerHTML = "";


  let latitude = [];
  let longitude = [];
  let labels = [];
  let tempMin = [];
  let tempMax = [];
  let probRain = [];
  let sunHours = [];
  let windSpeed = [];
  let rr10 = [];

  data.forEach((dayForecast, index) => {
    let card = document.createElement("div");
    card.classList.add("weatherCard");

    card.innerHTML = `
      <h3>Jour ${index + 1} - ${dayForecast.datetime}</h3>
      <p>Température minimale : ${dayForecast.tmin}°C</p>
      <p>Température maximale : ${dayForecast.tmax}°C</p>
      <p>Probabilité de pluie : ${dayForecast.probarain}%</p>
      <p>Ensoleillement : ${dayForecast.sun_hours} heures</p>
      <p>Latitude : ${dayForecast.latitude}</p>
      <p>Longitude : ${dayForecast.longitude}</p>
    `;

    if (document.getElementById("rainfall").checked) {
      card.innerHTML += `<p>Cumul de pluie : ${dayForecast.rr10} mm</p>`;
    }
    if (document.getElementById("windSpeed").checked) {
      card.innerHTML += `<p>Vitesse du vent : ${dayForecast.wind10m} km/h</p>`;
    }

    cardsContainer.appendChild(card);

    // Stocker les données pour le graphique
    labels.push(`Jour ${index + 1}`);
    tempMin.push(dayForecast.tmin);
    tempMax.push(dayForecast.tmax);
    probRain.push(dayForecast.probarain);
    sunHours.push(dayForecast.sun_hours);
    windSpeed.push(dayForecast.wind10m);
    rr10.push(dayForecast.rr10);
    latitude.push(dayForecast.latitude);
    longitude.push(dayForecast.longitude);
  });

  // Affichage du graphique avec toutes les nouvelles données
  displayChart(labels, tempMin, tempMax, probRain, sunHours, windSpeed, rr10, latitude, longitude);
}


function displayHours(sunHours) {
  return sunHours + (sunHours > 1 ? " heures" : " heure");
}

function updateDateTime() {
  let now = new Date();
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let formattedDate = now.toLocaleDateString('fr-FR', options);
  let formattedTime = now.toLocaleTimeString('fr-FR');

  document.getElementById("currentDateTime").textContent = `${formattedDate} ; ${formattedTime}`;
}

updateDateTime();

window.createCard = createCard;
