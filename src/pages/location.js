import { createFavoriteButton, toggleFavorite } from './favorites.js'

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

      listElement.innerHTML = sortedLocations.length
        ? sortedLocations
            .map(
              (location) => `
                <article class="character-card">
                  <div class="character-info">
                    <h3>${location.name}</h3>
                    <p><strong>Type:</strong> ${location.type || 'Onbekend'}</p>
                    <p><strong>Dimensie:</strong> ${location.dimension || 'Onbekend'}</p>
                    <p><strong>Bewoners:</strong> ${location.residents.length}</p>
                    <p><strong>Gebouwd:</strong> ${location.created}</p>
                    ${createFavoriteButton({
                      entityType: 'location',
                      entityId: location.id,
                      entityName: location.name,
                    })}
                  </div>
                </article>
              `,
            )
            .join('')
        : '<p>Geen locaties gevonden voor deze filters.</p>'
    }

    renderLocations()

    filterElement.addEventListener('input', renderLocations)
    typeElement.addEventListener('change', renderLocations)
    sortElement.addEventListener('change', renderLocations)

    listElement.addEventListener('click', (event) => {
      const favoriteButton = event.target.closest('[data-favorite-type]')

      if (!favoriteButton) {
        return
      }

      toggleFavorite({
        entityType: favoriteButton.dataset.favoriteType,
        entityId: favoriteButton.dataset.favoriteId,
        entityName: favoriteButton.dataset.favoriteName,
      })
    })
  } catch (error) {
    listElement.innerHTML = '<p>De locaties konden niet worden geladen.</p>'
    console.error(error)
  }
}