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

const renderRemoveFavoriteButton = (favorite) => `
	<button
		type="button"
		class="favorite-button favorite-button--remove"
		data-favorite-remove="true"
		data-favorite-type="${favorite.entityType}"
		data-favorite-id="${favorite.entityId}"
	>
		Verwijderen
	</button>
`

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
	const favorites = readFavorites()
	const isFavorite = favorites.some(
		(favorite) => favorite.entityType === entityType && String(favorite.entityId) === String(entityId),
	)

	return `
		<button
			type="button"
			class="favorite-button"
			data-favorite-type="${entityType}"
			data-favorite-id="${entityId}"
			data-favorite-name="${entityName}"
			data-favorite-data="${encodeDataAttribute(entityData)}"
		>
			${isFavorite ? 'Verwijder van favorieten' : 'Favoriet'}
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

const notifyFavoritesChanged = () => {
	document.dispatchEvent(new CustomEvent('favorites-changed'))
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
	notifyFavoritesChanged()
	return nextFavorites
}

export const removeFavorite = ({ entityType, entityId }) => {
	const favorites = readFavorites()
	const nextFavorites = favorites.filter(
		(favorite) => !(favorite.entityType === entityType && String(favorite.entityId) === String(entityId)),
	)

	writeFavorites(nextFavorites)
	notifyFavoritesChanged()
	return nextFavorites
}

export function setupFavoritesPage({ listElement, sectionElement }) {
	if (!listElement) {
		return
	}

	const getEpisodeNumber = (episodeCode) => {
		const match = String(episodeCode).match(/^S\d+E(\d+)$/)
		return match ? Number(match[1]) : 'Onbekend'
	}

	const getSeasonNumber = (episodeCode) => {
		const match = String(episodeCode).match(/^S(\d+)E\d+$/)
		return match ? Number(match[1]) : 'Onbekend'
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
					const ignoredKeysByType = {
						character: ['id', 'url', 'image', 'name', 'created', 'episode'],
						location: ['id', 'url', 'name', 'created', 'residents'],
						episode: ['id', 'url', 'characters', 'created'],
					}

					const entries = favorite.entityData
						? Object.entries(favorite.entityData).filter(
							([key]) => !(ignoredKeysByType[favorite.entityType] || ['id', 'url', 'image', 'name', 'created']).includes(key),
						)
						: []

					if (favorite.entityType === 'episode' && favorite.entityData) {
						return `
							<article class="character-card">
								<div class="character-info">
									<h3>${renderTextValue(favorite.entityName)}</h3>
									${renderDefinitionList([
										{ label: 'Code', value: renderTextValue(favorite.entityData.episode) },
										{ label: 'Air date', value: renderTextValue(favorite.entityData.air_date) },
										{ label: 'Seizoen', value: renderTextValue(getSeasonNumber(favorite.entityData.episode)) },
										{ label: 'Episode', value: renderTextValue(getEpisodeNumber(favorite.entityData.episode)) },
										{ label: 'Aantal karakters', value: renderTextValue(favorite.entityData.characters?.length || 0) },
									])}
									${renderRemoveFavoriteButton(favorite)}
								</div>
							</article>
						`
					}

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
									${renderRemoveFavoriteButton(favorite)}
								</div>
							</article>
						`
					}

					return `
						<article class="character-card">
							<div class="character-info">
								<h3>${renderTextValue(favorite.entityName)}</h3>
								<p><strong>Type:</strong> ${renderTextValue(favorite.entityType)}</p>
								${renderRemoveFavoriteButton(favorite)}
							</div>
						</article>
					`
				},
			)
			.join('')
	}

	renderFavorites()

	document.addEventListener('favorites-changed', renderFavorites)

	if (sectionElement) {
		sectionElement.addEventListener('click', (event) => {
			const removeButton = event.target.closest('[data-favorite-remove="true"]')

			if (removeButton) {
				removeFavorite({
					entityType: removeButton.dataset.favoriteType,
					entityId: removeButton.dataset.favoriteId,
				})

				renderFavorites()
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
