import './style.css'
import { setupCharacterList } from './pages/characters.js'
import { setupEpisodesList } from './pages/episodes.js'
import { setupFavoritesPage } from './pages/favorites.js'
import { setupLocationList } from './pages/location.js'

const storedTheme = localStorage.getItem('rick-and-morty-theme')
const preferredTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')

document.documentElement.dataset.theme = preferredTheme

document.querySelector('#app').innerHTML = `
  <main class="page-shell">
    <header class="topbar">
      <button class="theme-toggle" type="button" data-theme-toggle>
        Wissel naar licht thema
      </button>

      <div class="topbar-copy">
        <p class="eyebrow">Rick and Morty</p>
        <h1>Ontdek personages, locaties en episodes</h1>
      </div>
    </header>

    <nav class="page-links" aria-label="Snelle links naar pagina's">
      <a href="#characters" data-page-link="characters">Personages</a>
      <a href="#location" data-page-link="location">Locatie</a>
      <a href="#episodes" data-page-link="episodes">Episodes</a>
      <a href="#favorites" data-page-link="favorites">Favorieten</a>
    </nav>

    <section class="characters-section page-panel is-hidden" id="characters" data-page-panel="characters">
      <div class="characters-header">
        <div>
          <p class="eyebrow">Personages</p>
          <h2>Alle karakters</h2>
        </div>

        <div class="character-filters">
          <label class="sr-only" for="character-name-filter">Zoek op naam</label>
          <input
            id="character-name-filter"
            class="search-input"
            type="search"
            placeholder="Zoek op naam"
          />

          <label class="sr-only" for="character-status-filter">Filter op status</label>
          <select id="character-status-filter" class="search-input">
            <option value="all">Alle statussen</option>
          </select>

          <label class="sr-only" for="character-species-filter">Filter op soort</label>
          <select id="character-species-filter" class="search-input">
            <option value="all">Alle soorten</option>
          </select>

          <label class="sr-only" for="character-gender-filter">Filter op geslacht</label>
          <select id="character-gender-filter" class="search-input">
            <option value="all">Alle geslachten</option>
          </select>
        </div>
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
  nameElement: document.querySelector('#character-name-filter'),
  statusElement: document.querySelector('#character-status-filter'),
  speciesElement: document.querySelector('#character-species-filter'),
  genderElement: document.querySelector('#character-gender-filter'),
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
const themeToggle = document.querySelector('[data-theme-toggle]')
const characterFilter = document.querySelector('#character-filter')
const episodeFilter = document.querySelector('#episode-filter')
const locationFilter = document.querySelector('#location-filter')

const favoriteCardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px',
  },
)

const observeCards = () => {
  document.querySelectorAll('.character-card:not(.is-visible)').forEach((card) => {
    favoriteCardObserver.observe(card)
  })
}

const updateThemeButton = () => {
  const currentTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'

  if (themeToggle) {
    themeToggle.textContent = currentTheme === 'dark' ? 'Wissel naar licht thema' : 'Wissel naar donker thema'
  }
}

updateThemeButton()

const showPage = (pageName) => {
  pagePanels.forEach((panel) => {
    panel.classList.toggle('is-hidden', panel.dataset.pagePanel !== pageName)
  })

  pageLinks.forEach((link) => {
    link.classList.toggle('is-active', link.dataset.pageLink === pageName)
  })

  requestAnimationFrame(observeCards)
}

pageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()

    const pageName = link.dataset.pageLink
    showPage(pageName)

    document.querySelector(`[data-page-panel="${pageName}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = nextTheme
  localStorage.setItem('rick-and-morty-theme', nextTheme)
  updateThemeButton()
})

document.addEventListener('favorites-changed', () => {
  requestAnimationFrame(observeCards)
})
