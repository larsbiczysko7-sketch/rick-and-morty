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

const LOCATION_API_URL = 'https://rickandmortyapi.com/api/location'

const fetchAllLocations = async () => {
  const firstResponse = await fetch(LOCATION_API_URL)
  const firstData = await firstResponse.json()
  const pagePromises = []

  for (let page = 2; page <= firstData.info.pages; page += 1) {
    pagePromises.push(fetch(`${LOCATION_API_URL}?page=${page}`).then((response) => response.json()))
  }

  const otherPages = await Promise.all(pagePromises)

  return [firstData, ...otherPages].flatMap((page) => page.results)
}

export async function setupLocationList({ listElement, filterElement, typeElement, sortElement }) {
  if (!listElement || !filterElement || !typeElement || !sortElement) {
    return
  }

  listElement.innerHTML = '<p>Locaties worden geladen...</p>'

  try {
    const locations = await fetchAllLocations()

    const locationTypes = [...new Set(locations.map((location) => location.type).filter(Boolean))].sort((left, right) =>
      left.localeCompare(right),
    )

    locationTypes.forEach((type) => {
      const option = document.createElement('option')
      option.value = type
      option.textContent = type
      typeElement.appendChild(option)
    })

    const renderLocations = () => {
      const query = filterElement.value.trim().toLowerCase()
      const selectedType = typeElement.value
      const sortValue = sortElement.value

      const filteredLocations = locations.filter((location) => {
        const searchableText = `${location.name} ${location.type} ${location.dimension}`.toLowerCase()
        const matchesQuery = searchableText.includes(query)
        const matchesType = selectedType === 'all' ? true : location.type === selectedType

        return matchesQuery && matchesType
      })

      const sortedLocations = [...filteredLocations].sort((left, right) => {
        if (sortValue === 'name-desc') {
          return right.name.localeCompare(left.name)
        }

        if (sortValue === 'residents-desc') {
          return right.residents.length - left.residents.length
        }

        if (sortValue === 'residents-asc') {
          return left.residents.length - right.residents.length
        }

        return left.name.localeCompare(right.name)
      })

      const hasActiveFilters = query.length > 0 || selectedType !== 'all' || sortValue !== 'name-asc'

      listElement.innerHTML = `
        ${hasActiveFilters ? '<div class="filter-toolbar"><button type="button" class="filter-reset-button" data-reset-filter="locations">Wis filters</button></div>' : ''}
        ${sortedLocations.length
          ? sortedLocations
              .map(
                (location) => `
                  <article class="character-card">
                    <div class="character-info">
                      <h3>${location.name}</h3>
                      ${renderDefinitionList([
                        { label: 'Type', value: renderTextValue(location.type) },
                        { label: 'Dimensie', value: renderTextValue(location.dimension) },
                        { label: 'Aantal gekende bewoners', value: renderTextValue(location.residents.length) },
                      ])}
                      ${createFavoriteButton({
                        entityType: 'location',
                        entityId: location.id,
                        entityName: location.name,
                        entityData: location,
                      })}
                    </div>
                  </article>
                `,
              )
              .join('')
          : '<p class="empty-state">Geen locaties gevonden voor deze filters.</p>'}
      `
    }

    renderLocations()

    filterElement.addEventListener('input', renderLocations)
    typeElement.addEventListener('change', renderLocations)
    sortElement.addEventListener('change', renderLocations)

    listElement.addEventListener('click', (event) => {
      const resetButton = event.target.closest('[data-reset-filter="locations"]')

      if (resetButton) {
        filterElement.value = ''
        typeElement.value = 'all'
        sortElement.value = 'name-asc'
        renderLocations()
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
			renderLocations()
		})
  } catch (error) {
    listElement.innerHTML = '<p>De locaties konden niet worden geladen.</p>'
    console.error(error)
  }
}