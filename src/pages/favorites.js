export const FAVORITES_STORAGE_KEY = 'rick-and-morty-favorites'

export function createFavoriteButton({ entityType, entityId, entityName }) {
	return `
		<button
			type="button"
			class="favorite-button"
			data-favorite-type="${entityType}"
			data-favorite-id="${entityId}"
			data-favorite-name="${entityName}"
		>
			Favoriet
		</button>
	`
}

export function setupFavoritesPage({ listElement }) {
	if (!listElement) {
		return
	}

	listElement.innerHTML = '<p>Je favorieten komen hier later te staan.</p>'
}
