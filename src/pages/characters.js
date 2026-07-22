import { createFavoriteButton, getFavoriteDataFromButton, toggleFavorite } from './favorites.js'

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const renderDefinitionList = (items) => `
  <dl class="api-details">
    ${items
      .map(
        ({ label, value }) => `
          <div class="api-details-row">
            <dt>${escapeHtml(label)}</dt>
            <dd>${value}</dd>
          </div>
        `,
      )
      .join('')}
  </dl>
`

const renderListValue = (items) => {
  if (!Array.isArray(items) || !items.length) {
    return '<p>Geen gegevens</p>'
  }

  return `
    <details class="api-values">
      <summary>${items.length} items</summary>
      <ul>
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </details>
  `
}

const renderTextValue = (value) => {
  if (Array.isArray(value)) {
    return renderListValue(value)
  }

  if (value === null || value === undefined || value === '') {
    return 'Onbekend'
  }

  if (typeof value === 'object') {
    const nestedValue = value.name || value.title || value.type || value.dimension || value.url || JSON.stringify(value)
    return escapeHtml(nestedValue)
  }

  return escapeHtml(value)
}

const CHARACTER_API_URL = 'https://rickandmortyapi.com/api/character'

const fetchAllCharacters = async () => {
  const firstResponse = await fetch(CHARACTER_API_URL)
  const firstData = await firstResponse.json()
  const pagePromises = []

  for (let page = 2; page <= firstData.info.pages; page += 1) {
    pagePromises.push(fetch(`${CHARACTER_API_URL}?page=${page}`).then((response) => response.json()))
  }

  const otherPages = await Promise.all(pagePromises)

  return [firstData, ...otherPages].flatMap((page) => page.results)
}

export async function setupCharacterList({ listElement, filterElement }) {
  if (!listElement || !filterElement) {
    return
  }

  listElement.innerHTML = '<p>Karakteren worden geladen...</p>'

  try {
    const characters = await fetchAllCharacters()

    const renderCharacters = (query = '') => {
      const normalizedQuery = query.trim().toLowerCase()

      const filteredCharacters = characters.filter((character) => {
        const searchableText = `${character.name} ${character.species} ${character.status} ${character.type} ${character.gender}`.toLowerCase()
        return searchableText.includes(normalizedQuery)
      })

      listElement.innerHTML = filteredCharacters.length
        ? filteredCharacters
            .map(
              (character) => `
                <article class="character-card">
                  <img src="${character.image}" alt="${character.name}" class="character-image" />
                  <div class="character-info">
                    <h3>${character.name}</h3>
                    ${renderDefinitionList([
                      { label: 'Status', value: renderTextValue(character.status) },
                      { label: 'Soort', value: renderTextValue(character.species) },
                      { label: 'Type', value: renderTextValue(character.type) },
                      { label: 'Geslacht', value: renderTextValue(character.gender) },
                      { label: 'Oorsprong', value: renderTextValue(character.origin) },
                      { label: 'Locatie', value: renderTextValue(character.location) },
                      { label: 'Afleveringen', value: renderListValue(character.episode) },
                    ])}
                    ${createFavoriteButton({
                      entityType: 'character',
                      entityId: character.id,
                      entityName: character.name,
                      entityData: character,
                    })}
                  </div>
                </article>
              `,
            )
            .join('')
        : '<p>Geen karakters gevonden voor deze filter.</p>'
    }

    renderCharacters()

    filterElement.addEventListener('input', (event) => {
      renderCharacters(event.target.value)
    })

    listElement.addEventListener('click', (event) => {
      const favoriteButton = event.target.closest('[data-favorite-type]')

      if (!favoriteButton) {
        return
      }

      toggleFavorite({
        entityType: favoriteButton.dataset.favoriteType,
        entityId: favoriteButton.dataset.favoriteId,
        entityName: favoriteButton.dataset.favoriteName,
        entityData: getFavoriteDataFromButton(favoriteButton),
      })
    })
  } catch (error) {
    listElement.innerHTML = '<p>De karakters konden niet worden geladen.</p>'
    console.error(error)
  }
}