import './style.css'
import { setupCharacterList } from './pages/characters.js'
import { setupEpisodesList } from './pages/episodes.js'
import { setupFavoritesPage } from './pages/favorites.js'
import { setupLocationList } from './pages/location.js'

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
        <li><a href="#characters" data-page-link="characters">Personages</a></li>
        <li><a href="#location" data-page-link="location">Locatie</a></li>
        <li><a href="#episodes" data-page-link="episodes">Episodes</a></li>
        <li><a href="#favorites" data-page-link="favorites">Favorieten</a></li>
      </ul>
    </section>

    <section class="characters-section page-panel is-hidden" id="characters" data-page-panel="characters">
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

    <section class="characters-section page-panel is-hidden" id="episodes" data-page-panel="episodes">
      <div class="characters-header">
        <div>
          <p class="eyebrow">Episodes</p>
          <h2>Alle episodes</h2>
        </div>

        <div class="episode-controls">
          <label class="sr-only" for="episode-filter">Filter episodes</label>
          <input
            id="episode-filter"
            class="search-input"
            type="search"
            placeholder="Zoek op titel, code of datum"
          />

          <label class="sr-only" for="season-filter">Filter op seizoen</label>
          <select id="season-filter" class="search-input">
            <option value="all">Alle seizoenen</option>
          </select>

          <label class="sr-only" for="episode-sort">Sorteer episodes</label>
          <select id="episode-sort" class="search-input">
            <option value="number-asc">Oud naar nieuw</option>
            <option value="number-desc">Nieuw naar oud</option>
            <option value="name-asc">Naam A-Z</option>
            <option value="name-desc">Naam Z-A</option>
            <option value="date-asc">Datum oplopend</option>
            <option value="date-desc">Datum aflopend</option>
          </select>
        </div>
      </div>

      <div id="episodes-list" class="characters-list" aria-live="polite"></div>
    </section>

    <section class="characters-section page-panel is-hidden" id="location" data-page-panel="location">
      <div class="characters-header">
        <div>
          <p class="eyebrow">Locatie</p>
          <h2>Alle locaties</h2>
        </div>

        <div class="episode-controls">
          <label class="sr-only" for="location-filter">Filter locaties</label>
          <input
            id="location-filter"
            class="search-input"
            type="search"
            placeholder="Zoek op naam, type of dimensie"
          />

          <label class="sr-only" for="location-type-filter">Filter op type</label>
          <select id="location-type-filter" class="search-input">
            <option value="all">Alle types</option>
          </select>

          <label class="sr-only" for="location-sort">Sorteer locaties</label>
          <select id="location-sort" class="search-input">
            <option value="name-asc">Naam A-Z</option>
            <option value="name-desc">Naam Z-A</option>
            <option value="residents-desc">Meeste bewoners</option>
            <option value="residents-asc">Minste bewoners</option>
          </select>
        </div>
      </div>

      <div id="location-list" class="characters-list" aria-live="polite"></div>
    </section>

    <section class="characters-section page-panel is-hidden" id="favorites" data-page-panel="favorites">
      <div class="characters-header">
        <div>
          <p class="eyebrow">Favorieten</p>
          <h2>Opgeslagen items</h2>
        </div>
      </div>

      <div id="favorites-list" class="characters-list" aria-live="polite"></div>
    </section>
  </main>
`

setupCharacterList({
  listElement: document.querySelector('#characters-list'),
  filterElement: document.querySelector('#character-filter'),
})

setupEpisodesList({
  listElement: document.querySelector('#episodes-list'),
  filterElement: document.querySelector('#episode-filter'),
  seasonElement: document.querySelector('#season-filter'),
  sortElement: document.querySelector('#episode-sort'),
})

setupLocationList({
  listElement: document.querySelector('#location-list'),
  filterElement: document.querySelector('#location-filter'),
  typeElement: document.querySelector('#location-type-filter'),
  sortElement: document.querySelector('#location-sort'),
})

setupFavoritesPage({
  listElement: document.querySelector('#favorites-list'),
  sectionElement: document.querySelector('#favorites'),
})

const pageLinks = document.querySelectorAll('[data-page-link]')
const pagePanels = document.querySelectorAll('[data-page-panel]')

const showPage = (pageName) => {
  pagePanels.forEach((panel) => {
    panel.classList.toggle('is-hidden', panel.dataset.pagePanel !== pageName)
  })

  pageLinks.forEach((link) => {
    link.classList.toggle('is-active', link.dataset.pageLink === pageName)
  })
}

pageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()

    const pageName = link.dataset.pageLink
    showPage(pageName)

    document.querySelector(`[data-page-panel="${pageName}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})
