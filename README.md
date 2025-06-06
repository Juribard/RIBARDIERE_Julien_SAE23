# Instant-Weather README

Auteur: Julien RIBARDIERE
Code source original: https://princecorg.github.io/Instant-Weather/

**Explications:**   

Le but de ce projet est de créer un site internet dynamique ayant pour but de présenter la météo pour 1 jours ou durant 7 jours en manipulant une API de Météoconcept ainsi que l'API des découpage administrative des communes.

En raison de ne pas etre parvenu à joindre l'API de Meteoconcept avec l'API du gouvernement lors d'un travail de groupe, il a été préférable de se baser sur le code sources de l'enseignant dans l'objectif de ne pas perdre de temps.

**Les api utilisées**
- l'API de découpage administratif par commune : https://geo.api.gouv.fr/decoupage-administratif/communes
- l'API météo de MétéoConcept : https://api.meteo-concept.com/

## Les contraintes :
- La page sera responsive (avec ou sans media queries) et devra passer les validations HTML et CSS du W3C.
- la page devra satisfaire aux exigences d’accessibilité de la norme WCAG AA 2.0

**Contenu:**
- 1 page CSS
- 1 page HTML
- 3 fichiers javascript (app.js, weatherCard.js et mapAndChart.js)

**Mode d'emploi:**

Pour utiliser le site, il suffit de :
- <u>Écrire</u> le code postal de la commune.
- <u>Choisir</u> le nombre de jours pour les prévisions.
- <u>Sélectionner</u> l'une des communes proposées.
- <u>Cocher</u> ou non les options que vous souhaitez voir.
- <u>Cliquer</u> sur "Valider".
Dans le cas où l'utilisateur sélectionne <u>2 jours ou plus</u> (jusqu'à 7), il a accès à un tableau récapitulatif ainsi qu'à des graphiques prévisionnels.

**Notes:**
- Le site est adaptable à tout les écrans (Responsive Web Design)
- la principale dificulter fut la responsivité d'un tableau, faisant aisni "disparaitre" la premiere colonne lors d'un affichage sur un petit ecran 

**Lien du site:**
https://juribard.github.io/RIBARDIERE_Julien_SAE23/

