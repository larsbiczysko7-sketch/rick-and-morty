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

const renderTextValue = (value) => {
	if (value === null || value === undefined || value === '') {
		return 'Onbekend'
	}

	if (typeof value === 'object') {
		const nestedValue = value.name || value.title || value.type || value.dimension || value.url || JSON.stringify(value)
		return escapeHtml(nestedValue)
	}

	return escapeHtml(value)
}

export const FAVORITES_STORAGE_KEY = 'rick-and-morty-favorites'

const encodeDataAttribute = (value) => encodeURIComponent(JSON.stringify(value ?? null))

const decodeDataAttribute = (value) => {
	if (!value) {
		return null
	}

	try {
		return JSON.parse(decodeURIComponent(value))
	} catch {
		return null
	}
}

export function createFavoriteButton({ entityType, entityId, entityName, entityData }) {
	return `
		<button
			type="button"
			class="favorite-button"
			data-favorite-type="${entityType}"
			data-favorite-id="${entityId}"
			data-favorite-name="${entityName}"
			data-favorite-data="${encodeDataAttribute(entityData)}"
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

export const toggleFavorite = ({ entityType, entityId, entityName, entityData = null }) => {
	const favorites = readFavorites()
	const isAlreadyFavorite = favorites.some(
		(favorite) => favorite.entityType === entityType && String(favorite.entityId) === String(entityId),
	)

	const nextFavorites = isAlreadyFavorite
		? favorites.filter(
				(favorite) => !(favorite.entityType === entityType && String(favorite.entityId) === String(entityId)),
		  )
		: [...favorites, { entityType, entityId, entityName, entityData }]

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
				(favorite) => {
					const entries = favorite.entityData
						? Object.entries(favorite.entityData).filter(([key]) => !['id', 'url', 'image', 'name', 'created'].includes(key))
						: []

					if (favorite.entityData) {
						return `
							<article class="character-card">
								${favorite.entityData.image ? `<img src="${renderTextValue(favorite.entityData.image)}" alt="${renderTextValue(favorite.entityName)}" class="character-image" />` : ''}
								<div class="character-info">
									<h3>${renderTextValue(favorite.entityName)}</h3>
									${renderDefinitionList(
										entries.map(([label, value]) => ({
											label,
											value: renderTextValue(value),
										})),
									)}
								</div>
							</article>
						`
					}

					return `
						<article class="character-card">
							<div class="character-info">
								<h3>${renderTextValue(favorite.entityName)}</h3>
								<p><strong>Type:</strong> ${renderTextValue(favorite.entityType)}</p>
							</div>
						</article>
					`
				},
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

export const getFavoriteDataFromButton = (buttonElement) => decodeDataAttribute(buttonElement.dataset.favoriteData)
