# Rick and Morty Explorer

Dit project is een interactieve webapplicatie gemaakt met Vite. De app laat je informatie bekijken over personages, locaties en afleveringen uit de Rick and Morty API. Je kunt zoeken, filteren, sorteren en items opslaan als favoriet.

## Wat deze app doet

- Je ziet veel data van Rick and Morty
- Je kunt zoeken in de lijst
- Je kunt filters gebruiken om items te beperken, zoals type of seizoen
- Je kunt items sorteren van A tot Z, op datum of op aantal bewoners
- Je kunt favorieten opslaan
- Je favoriete items blijven bewaard als je de pagina sluit
- Er is ook een thema-switcher, zodat je van donkere naar lichte kleur kunt wisselen

## Hoe werkt de app

1. Open de app in de browser.
2. Kies een categorie: personages, locaties, afleveringen of favorieten.
3. Gebruik het zoekveld om iets te vinden.
4. Gebruik de filters en sorteermogelijkheden.
5. Klik op “Favoriet” om iets op te slaan.
6. Ga naar de pagina Favorieten om je opgeslagen items te bekijken.

## Installatie

Volg deze stappen op je computer:

1. Download of kopieer dit project.
2. Open de map in Visual Studio Code.
3. Open een terminal.
4. Typ dit commando:

```bash
npm install
```

5. Start daarna de app met:

```bash
npm run dev
```

6. Open de link die in de terminal verschijnt in je browser.

## Builden van de app

Als je wilt controleren of alles goed werkt, gebruik:

```bash
npm run build
```

## Gebruikte API

Deze app gebruikt de Rick and Morty API:

- https://rickandmortyapi.com/

## Technische onderdelen uit de opdracht

Hieronder staat duidelijk welke onderdelen uit de opdracht in dit project zitten.

### 1. DOM manipulatie

Er wordt gewerkt met DOM-manipulatie in de code. Dit gebeurt door:

- elementen te selecteren uit de HTML
- inhoud te veranderen in de pagina
- event listeners te koppelen aan knoppen, invoervelden en links

Voorbeelden staan in:

- src/main.js
- src/pages/characters.js
- src/pages/episodes.js
- src/pages/location.js
- src/pages/favorites.js

### 2. Modern JavaScript

In het project zijn deze moderne JavaScript-concepten gebruikt:

- constanten
- template literals
- arrays en array methods
- arrow functions
- ternary operator
- callbacks
- Promises
- async en await
- Observer API

### 3. Data en API

De app haalt data op met fetch uit de Rick and Morty API. De gegevens worden daarna getoond in de pagina.

### 4. Opslag en validatie

- Favorieten worden opgeslagen in LocalStorage
- Het thema wordt ook opgeslagen in LocalStorage
- Er is formuliervalidatie in de zoekfunctie

### 5. Styling en layout

De app heeft een duidelijke layout met CSS. Er is gebruik gemaakt van flexbox of CSS grid. De knoppen zijn duidelijk en de website is responsive.

### 6. Tooling en structuur

Dit project is gemaakt met Vite. De code is netjes verdeeld over meerdere bestanden:

- src/main.js = hoofdapplicatie
- src/pages/characters.js = personages
- src/pages/episodes.js = afleveringen
- src/pages/location.js = locaties
- src/pages/favorites.js = favorieten
- src/style.css = styling

## Projectstructuur

- src/main.js
- src/pages/characters.js
- src/pages/episodes.js
- src/pages/location.js
- src/pages/favorites.js
- src/style.css
- public/screenshots/app-overview.svg

## Screenshots

Hieronder staat een voorbeeld van de app:

![Applicatie-overzicht](public/screenshots/app-overview.svg)

## Bronnen

- Rick and Morty API: https://rickandmortyapi.com/
- Vite: https://vite.dev/
- Cursusmateriaal van Web Advanced
- W3school voor bepaalde informatie https://www.w3schools.com/nodejs/nodejs_intro.asp
- AI-hulp van ChatGpt https://chatgpt.com/share/6a7073ea-3e08-83ed-9fa3-35a00b2f8e8f

## Extra uitleg voor de leerkracht

Dit project laat zien dat ik:

- data uit een externe API haal
- die data visueel toon in een webapplicatie
- interactie toevoeg met zoeken, filteren en sorteren
- gebruikersvoorkeuren opsla met LocalStorage
- een thema-switcher implementeer voor kleurkeuze
- een SPA maak met meerdere pagina-secties zonder volledige refresh
- de opdracht goed heb verwerkt met duidelijke code en structuur

