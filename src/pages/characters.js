const CHARACTER_API_URL = 'https://rickandmortyapi.com/api/character?page=1'

export async function setupCharacterList({ listElement, filterElement }) {
  if (!listElement || !filterElement) {
    return
  }

  listElement.innerHTML = '<p>Karakteren worden geladen...</p>'

  try {
    const response = await fetch(CHARACTER_API_URL)
    const data = await response.json()
    const characters = data.results.slice(0, 20)

    const renderCharacters = (query = '') => {
      const normalizedQuery = query.trim().toLowerCase()

      const filteredCharacters = characters.filter((character) => {
        const searchableText = `${character.name} ${character.species} ${character.status}`.toLowerCase()
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
                    <p><strong>Status:</strong> ${character.status}</p>
                    <p><strong>Soort:</strong> ${character.species}</p>
                    <p><strong>Geslacht:</strong> ${character.gender}</p>
                    <p><strong>Oorsprong:</strong> ${character.origin.name}</p>
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
  } catch (error) {
    listElement.innerHTML = '<p>De karakters konden niet worden geladen.</p>'
    console.error(error)
  }
}