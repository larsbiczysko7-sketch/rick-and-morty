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

const readFavorites = () => {
	const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)

	if (!storedFavorites) {
		return []
	}

	try {
		const parsedFavorites = JSON.parse(storedFavorites)
		return Array.isArray(parsedFavorites) ? parsedFavorites : []
	} catch {
		return []
	}
}

const writeFavorites = (favorites) => {
	localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
}

export const getFavorites = () => readFavorites()

export const toggleFavorite = ({ entityType, entityId, entityName }) => {
	const favorites = readFavorites()
	const isAlreadyFavorite = favorites.some(
		(favorite) => favorite.entityType === entityType && String(favorite.entityId) === String(entityId),
	)

	const nextFavorites = isAlreadyFavorite
		? favorites.filter(
				(favorite) => !(favorite.entityType === entityType && String(favorite.entityId) === String(entityId)),
		  )
		: [...favorites, { entityType, entityId, entityName }]

	writeFavorites(nextFavorites)
	return nextFavorites
}

export function setupFavoritesPage({ listElement, sectionElement }) {
	if (!listElement) {
		return
	}

	const renderFavorites = () => {
		const favorites = readFavorites()

		if (!favorites.length) {
			listElement.innerHTML = '<p>Geen favorieten</p>'
			return
		}

		listElement.innerHTML = favorites
			.map(
				(favorite) => `
					<article class="character-card">
						<div class="character-info">
							<h3>${favorite.entityName}</h3>
							<p><strong>Type:</strong> ${favorite.entityType}</p>
						</div>
					</article>
				`,
			)
			.join('')
	}

	renderFavorites()

	if (sectionElement) {
		sectionElement.addEventListener('click', (event) => {
			const favoriteButton = event.target.closest('[data-favorite-type]')

			if (!favoriteButton) {
				return
			}

			toggleFavorite({
				entityType: favoriteButton.dataset.favoriteType,
				entityId: favoriteButton.dataset.favoriteId,
				entityName: favoriteButton.dataset.favoriteName,
			})

			renderFavorites()
		})
	}

	window.addEventListener('storage', (event) => {
		if (event.key === FAVORITES_STORAGE_KEY) {
			renderFavorites()
		}
	})
}
