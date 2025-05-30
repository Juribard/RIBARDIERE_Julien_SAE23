// Sélection des éléments
const codePostalInput = document.getElementById("code-postal");
const communeSelect = document.getElementById("communeSelect");
const validationButton = document.getElementById("validationButton");

// Fonction pour effectuer la requête API des communes en utilisant le code postal
async function fetchCommunesByCodePostal(codePostal) {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${codePostal}`
    );
    const data = await response.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API:", error);
    throw error;
  }
}

// Fonction pour afficher les communes dans la liste déroulante
function displayCommunes(data) {
  communeSelect.innerHTML = "";
  // S'il y a au moins une commune retournée dans data
  if (data.length) {
    data.forEach((commune) => {
      const option = document.createElement("option");
      option.value = commune.code;
      option.textContent = commune.nom;
      communeSelect.appendChild(option);
    });
    communeSelect.style.display = "block";
    validationButton.style.display = "block";
  }
  else {
    // Supprimer un message précédent s’il existe déjà
    const existingMessage = document.getElementById("error-message");
    if (!existingMessage) {
      const message = document.createElement("p");
      message.id = "error-message";
      message.textContent = "Le code postal saisi n'est pas valide";
      message.classList.add('errorMessage');
      document.body.appendChild(message);
    }

    // Masquer les éléments inutiles
    communeSelect.style.display = "none";
    validationButton.style.display = "none";

    // Recharger la page après 3 secondes
    setTimeout(() => location.reload(), 3000);
  }
}
// Fonction pour effectuer la requête API de météo en utilisant le code de la commune sélectionnée
async function fetchMeteoByCommune(selectedCommune) {
  const daysRange = document.getElementById("daysRange");
  const selectedDays = parseInt(daysRange.value); // Convertir en nombre entier
  const allForecasts = []; // Stocker toutes les prévisions

  if (selectedDays === 1) {
    try {
      const response = await fetch(
        `https://api.meteo-concept.com/api/forecast/daily/0?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${selectedCommune}`
      );
      const data = await response.json();
      if (data.length === 1 && !Array.isArray(data[0])) {
      data = [data[0]]; // S'assurer que même pour 1 jour, data est un tableau uniforme
      }
      return [data.forecast]; // Retourne les données sous forme de tableau
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      throw error;
    }
  } else {
    try {
      for (let compteur = 0; compteur < selectedDays; compteur++) {
        const response = await fetch(
          `https://api.meteo-concept.com/api/forecast/daily/${compteur}?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${selectedCommune}`
        );
        const data = await response.json();
        allForecasts.push(data.forecast); // Ajouter chaque prévision météo
      }
      console.log("fetchMeteoByCommune renvoie :", allForecasts);
      return allForecasts; // Retourne toutes les prévisions météo
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      throw error;
    }
  }
}

// Ajout de l'écouteur d'événement "input" sur le champ code postal
codePostalInput.addEventListener("input", async () => {
  const codePostal = codePostalInput.value;
  communeSelect.style.display = "none";
  validationButton.style.display = "none";

  if (/^\d{5}$/.test(codePostal)) {
    try {
      const data = await fetchCommunesByCodePostal(codePostal);
      displayCommunes(data);
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la recherche de la commune :",
        error
      );
      throw error;
    }
  }
});

// Ecouteur d'événements pour afficher le nombre de jours sélectionné
const daysRange = document.getElementById("daysRange");
const selectedDays = document.getElementById("selectedDays");

daysRange.addEventListener("input", () => {
  selectedDays.textContent = `${daysRange.value} jour${daysRange.value > 1 ? "s" : ""}`;
});

// Ajout de l'écouteur d'événement "click" sur le bouton de validation
validationButton.addEventListener("click", async () => {
  const selectedCommune = communeSelect.value;
  const selectedDays = daysRange.value;
  if (selectedCommune) { // si selectedCommune n'est pas vide
    try {
      const data = await fetchMeteoByCommune(selectedCommune, selectedDays);
      console.log("Données météo récupérées :", data);
      createCard(data, selectedDays);
    } catch (error) {
      console.error("Erreur lors de la requête API meteoConcept:", error);
      throw error;
    }
  }
});

