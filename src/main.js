import './style.css'

document.querySelector('#app').innerHTML = `
  <main class="page-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">Rick and Morty</p>
        <h1>Ontdek personages, locaties en episodes</h1>
      </div>

      <a class="favorites-link" href="#favorites">Favorieten</a>
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

  </main>
`
