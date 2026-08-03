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

export async function setupCharacterList({ listElement, nameElement, statusElement, speciesElement, genderElement }) {
  if (!listElement || !nameElement || !statusElement || !speciesElement || !genderElement) {
    return
  }

  listElement.innerHTML = '<p>Karakteren worden geladen...</p>'

  try {
    const characters = await fetchAllCharacters()

    const addOption = (selectElement, value, label) => {
      const option = document.createElement('option')
      option.value = value
      option.textContent = label
      selectElement.appendChild(option)
    }

    const uniqueValues = (field) =>
      [...new Set(characters.map((character) => character[field]).filter(Boolean))].sort((left, right) => left.localeCompare(right))

    uniqueValues('status').forEach((status) => addOption(statusElement, status, status))
    uniqueValues('species').forEach((species) => addOption(speciesElement, species, species))
    uniqueValues('gender').forEach((gender) => addOption(genderElement, gender, gender))

    const renderCharacters = () => {
      const normalizedName = nameElement.value.trim().toLowerCase()
      const selectedStatus = statusElement.value
      const selectedSpecies = speciesElement.value
      const selectedGender = genderElement.value

      const filteredCharacters = characters.filter((character) => {
        const matchesName = `${character.name}`.toLowerCase().includes(normalizedName)
        const matchesStatus = selectedStatus === 'all' || character.status === selectedStatus
        const matchesSpecies = selectedSpecies === 'all' || character.species === selectedSpecies
        const matchesGender = selectedGender === 'all' || character.gender === selectedGender

        return matchesName && matchesStatus && matchesSpecies && matchesGender
      })

      const hasActiveFilter =
        normalizedName.length > 0 || selectedStatus !== 'all' || selectedSpecies !== 'all' || selectedGender !== 'all'

      listElement.innerHTML = `
        ${hasActiveFilter ? '<div class="filter-toolbar"><button type="button" class="filter-reset-button" data-reset-filter="characters">Wis filters</button></div>' : ''}
        ${filteredCharacters.length
          ? filteredCharacters
              .map(
                (character) => `
                  <article class="character-card">
                    <img src="${character.image}" alt="${character.name}" class="character-image" />
                    <div class="character-info">
                      <h3>${character.name}</h3>
                      <p class="character-subtitle">${renderTextValue(character.species)} · ${renderTextValue(character.status)}</p>
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
          : '<p class="empty-state">Geen karakters gevonden voor deze filters.</p>'}
      `
    }

    renderCharacters()

    nameElement.addEventListener('input', renderCharacters)
    statusElement.addEventListener('change', renderCharacters)
    speciesElement.addEventListener('change', renderCharacters)
    genderElement.addEventListener('change', renderCharacters)

    listElement.addEventListener('click', (event) => {
      const resetButton = event.target.closest('[data-reset-filter="characters"]')

      if (resetButton) {
        nameElement.value = ''
        statusElement.value = 'all'
        speciesElement.value = 'all'
        genderElement.value = 'all'
        renderCharacters()
        return
      }

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

    document.addEventListener('favorites-changed', () => {
      renderCharacters()
    })
  } catch (error) {
    listElement.innerHTML = '<p>De karakters konden niet worden geladen.</p>'
    console.error(error)
  }
}