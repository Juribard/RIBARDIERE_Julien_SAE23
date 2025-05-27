function initMap(latitude, longitude) {
    let map = L.map('weatherMap').setView([latitude, longitude], 12);

    // Ajouter une couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Ajouter un marqueur à l'emplacement de la commune
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`Localisation météo`).openPopup();
}
