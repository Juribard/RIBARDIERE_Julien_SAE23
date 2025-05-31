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
// Fonction pour effectuer la requête API de météo en utilisant le code de la commune sélectionnée
async function fetchMeteoByCommune(selectedCommune) {
  try {
    const response = await fetch(
      `https://api.meteo-concept.com/api/forecast/daily/0?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${selectedCommune}&days=${selectedDays}`//&days=${selectedDays}
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API:", error);
    throw error;
  }
}

// Ajout de l'écouteur d'événement "input" sur le champ code postal
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
  const url = `https://api.meteo-concept.com/api/forecast/daily/0?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${inseeCode}`;
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
      const url = `https://api.meteo-concept.com/api/forecast/daily/${i}?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${inseeCode}`;
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
  document.getElementById("weatherInformation").style.display = "block";
  // Masquer la carte météo classique
  document.getElementById("weatherDetails").style.display = "none";
}

// Au clic sur “Valider”
const daysRangeElem = document.getElementById("daysRange");
validationButton.addEventListener("click", async () => {
  const selectedCommune = communeSelect.value;
  const selectedDays = daysRange.value;
  if (selectedCommune) { // si selectedCommune n'est pas vide
    try {
      const data = await fetchMeteoByCommune(selectedCommune, selectedDays);
      createCard(data, selectedDays);
    } catch (error) {
      console.error("Erreur lors de la requête API meteoConcept:", error);
      throw error;
    }
  }
});
