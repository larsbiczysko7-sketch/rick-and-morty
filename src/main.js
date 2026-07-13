import './style.css'
import { setupCharacterList } from './pages/characters.js'

document.querySelector('#app').innerHTML = `
  <main class="page-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">Rick and Morty</p>
        <h1>Ontdek personages, locaties en episodes</h1>
      </div>
    </header>

    <section class="search-area" aria-label="Zoeken in de app">
      <label class="sr-only" for="search-input">Zoek een karakter, locatie of episode</label>
      <input
        id="search-input"
        class="search-input"
        type="search"
        name="search"
        placeholder="Zoek een karakter, locatie of episode"
      />
      <button class="search-button" type="button">Zoeken</button>

      <ul class="page-links" aria-label="Snelle links naar pagina's">
        <li><a href="#characters">Personages</a></li>
        <li><a href="#location">Locatie</a></li>
        <li><a href="#episodes">Episodes</a></li>
        <li><a href="#favorites">Favorieten</a></li>
      </ul>
    </section>

    <section class="characters-section" id="characters">
      <div class="characters-header">
        <div>
          <p class="eyebrow">Personages</p>
          <h2>Alle karakters</h2>
        </div>

        <label class="sr-only" for="character-filter">Filter karakters</label>
        <input
          id="character-filter"
          class="search-input"
          type="search"
          placeholder="Filter op naam, soort of status"
        />
      </div>

      <div id="characters-list" class="characters-list" aria-live="polite"></div>
    </section>
  </main>
`

setupCharacterList({
  listElement: document.querySelector('#characters-list'),
  filterElement: document.querySelector('#character-filter'),
})
