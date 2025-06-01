// app.js

// --------------
// PARTIE 1 : COMMUNES / CODE POSTAL
// --------------
const codePostalInput    = document.getElementById("code-postal");
const communeSelect      = document.getElementById("communeSelect");
const validationButton   = document.getElementById("validationButton");

// Requête pour remplir la liste des communes depuis le code postal
async function fetchCommunesByCodePostal(codePostal) {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${codePostal}`
    );
    const data = await response.json();
    console.table(data);
    return data; // tableau de communes
  } catch (error) {
    console.error("Erreur lors de la requête API communes :", error);
    throw error;
  }
}

// Affiche les communes dans <select id="communeSelect">
function displayCommunes(data) {
  communeSelect.innerHTML = "";
  if (data.length) {
    data.forEach((commune) => {
      const option = document.createElement("option");
      option.value = commune.code;
      option.textContent = commune.nom;
      communeSelect.appendChild(option);
    });
    communeSelect.style.display    = "block";
    validationButton.style.display = "block";
  } else {
    // Message d’erreur si pas de commune valide
    const existingMessage = document.getElementById("error-message");
    if (!existingMessage) {
      const message = document.createElement("p");
      message.id = "error-message";
      message.textContent = "Le code postal saisi n'est pas valide";
      message.classList.add("errorMessage");
      document.body.appendChild(message);
    }
    communeSelect.style.display    = "none";
    validationButton.style.display = "none";
    setTimeout(() => location.reload(), 3000);
  }
}

// Quand on tape dans le champ “code postal”
codePostalInput.addEventListener("input", async () => {
  const codePostal = codePostalInput.value.trim();
  communeSelect.style.display    = "none";
  validationButton.style.display = "none";

  // Si 5 chiffres
  if (/^\d{5}$/.test(codePostal)) {
    try {
      const data = await fetchCommunesByCodePostal(codePostal);
      displayCommunes(data);
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la recherche de la commune :",
        error
      );
    }
  }
});

// --------------
// PARTIE 2 : MÉTÉO / AFFICHAGE
// --------------

// Récupère la prévi d’1 jour (forecast0)
async function fetchOneDay(inseeCode) {
  // Viz. la doc : /api/forecast/daily/0
  //4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091 ->mon token
  //89f4a75d26db4a6cb6743a391b78ec097c5f06235912b50eca0a94dca1579e6d -> token enseignant
  const url = `https://api.meteo-concept.com/api/forecast/daily/0?token=89f4a75d26db4a6cb6743a391b78ec097c5f06235912b50eca0a94dca1579e6d&insee=${inseeCode}`;
  try {
    const resp = await fetch(url);
    const json = await resp.json();
    return json; // Format JSON classique : { city:{…}, forecast:{…} }
  } catch (err) {
    console.error("Erreur fetchOneDay :", err);
    throw err;
  }
}

// Récupère la prévi “jour 0, jour 1, …, jour N-1”, retourne un tableau d’objets `{ forecast: {...} }`
async function fetchMultipleDays(inseeCode, daysCount) {
  const allForecasts = [];
  try {
    // Note : on boucle de 0 à daysCount-1
    for (let i = 0; i < daysCount; i++) {
      const url = `https://api.meteo-concept.com/api/forecast/daily/${i}?token=89f4a75d26db4a6cb6743a391b78ec097c5f06235912b50eca0a94dca1579e6d&insee=${inseeCode}`;
      const resp = await fetch(url);
      const json = await resp.json();
      // json.forecast est l’objet pour le jour “i”
      allForecasts.push(json.forecast);
    }
    return allForecasts; // ex. [ {day:0, tmin:…, tmax:…, …}, {day:1, …}, … ]
  } catch (err) {
    console.error("Erreur fetchMultipleDays :", err);
    throw err;
  }
}

// Affiche le JSON brut (tab d’objets) dans <pre id="result">
function displayRawJSON(dataArray) {
  const resultPre = document.getElementById("result");
  resultPre.textContent = "";
  resultPre.textContent = JSON.stringify(dataArray, null, 2);

  // Afficher le bloc contenant le résultat
  //document.getElementById("weatherInformation").style.display = "block";
  // Masquer la carte météo classique
  document.getElementById("weatherDetails").style.display = "none";
}

// Au clic sur “Valider”

const daysRangeElem = document.getElementById("daysRange");
validationButton.addEventListener("click", async () => {
    const insee = communeSelect.value;
    const selectedDays = parseInt(daysRangeElem.value, 10);

    document.getElementById("cityForm").style.display = "none";

    if (!insee) return;

    if (selectedDays === 1) {
        try {
            document.getElementById("result").textContent = "";
            document.getElementById("weatherInformation").style.display = "block";
            const oneDayData = await fetchOneDay(insee);
            createCard(oneDayData);
        } catch (err) {
            console.error("Erreur lors de la requête 1 jour :", err);
        }
    } else {
        try {

          const multiData = await fetchMultipleDays(insee, selectedDays);
          document.getElementById("weatherInformation").style.display = "block";
          // Récupère les infos de la ville (latitude/longitude) via une requête API
          const cityInfoResp = await fetch(`https://geo.api.gouv.fr/communes/${insee}`);
          const cityInfo = await cityInfoResp.json();
          // Après avoir récupéré cityInfo depuis l'API geo.api.gouv.fr/communes
          if (cityInfo && cityInfo.nom && cityInfo.codesPostaux && cityInfo.codesPostaux.length > 0) {
              document.getElementById("weatherName").textContent = `${cityInfo.nom} (${cityInfo.codesPostaux[0]})`;
          } else {
              document.getElementById("weatherName").textContent = "Commune inconnue";
          }
          document.getElementById("weatherName").style.textAlign = "center";

          document.getElementById("coordonnees").style.display = "block";
          console.log("COORDONNÉES :", cityInfo);
          document.getElementById("currentDateTime").textContent = `Date : ${new Date().toLocaleString()}`;

          if (multiData && multiData[0] && multiData[0].latitude !== undefined && multiData[0].longitude !== undefined) {
              document.getElementById("weatherLatitude").textContent = `Latitude : ${multiData[0].latitude}`;
              document.getElementById("weatherLongitude").textContent = `Longitude : ${multiData[0].longitude}`;
          } else {
              document.getElementById("weatherLatitude").textContent = "Latitude : inconnue";
              document.getElementById("weatherLongitude").textContent = "Longitude : inconnue";
          }

          const showLat = document.getElementById("latitude").checked;
          const showLon = document.getElementById("longitude").checked;

          document.getElementById("weatherLatitude").style.display = showLat ? "block" : "none";
          document.getElementById("weatherLongitude").style.display = showLon ? "block" : "none";

          // Récupère les options sélectionnées par l'utilisateur
          const selectedOptions = Array.from(document.querySelectorAll('fieldset.option input[type="checkbox"]:checked')).map(cb => cb.id);

          document.querySelector('.info_météo_rangement').style.display = "none";

          // Affiche le tableau météo multi-jours
          generateWeatherTable(multiData, selectedOptions);
          // Affiches les graphiques
          window.showTemperatureChart(multiData);
          window.showSunChart(multiData);
          console.log("Options cochées :", selectedOptions);
          window.showRainChart(multiData, selectedOptions.includes('rainfall'));

          console.log("Options sélectionnées après validation :", selectedOptions);
          // Création du bouton "Retour"
          let returnButton = document.createElement("button");
          returnButton.textContent = "Nouvelle recherche";
          returnButton.id = "returnButton"; 
          returnButton.style.display = "block";
          returnButton.style.margin = "20px auto";
          returnButton.style.padding = "10px";
          returnButton.style.backgroundColor = "#0f3359";
          returnButton.style.color = "white";
          returnButton.style.border = "none";
          returnButton.style.cursor = "pointer";
          returnButton.style.fontSize = "16px";
          returnButton.style.borderRadius = "5px";

          // Ajoute une action pour recharger la page
          returnButton.addEventListener("click", () => {
              location.reload(); // 🔄 Recharge toute la page
          });

          // ✅ Insère le bouton sous la météo
          document.getElementById("weatherInformation").appendChild(returnButton);

          console.log("multiData récupéré depuis fetchMultipleDays :", multiData);
        } catch (err) {
          console.error("Erreur lors de la requête multiple jours :", err);
        }
    }
});

const selectedDaysElem = document.getElementById("selectedDays");

// ✅ Mettre à jour le texte en fonction du curseur
daysRangeElem.addEventListener("input", () => {
    selectedDaysElem.textContent = `${daysRangeElem.value} jour${daysRangeElem.value > 1 ? 's' : ''}`;
});