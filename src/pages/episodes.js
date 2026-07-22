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

const EPISODE_API_URL = 'https://rickandmortyapi.com/api/episode'

const getSeasonNumber = (episodeCode) => {
	const match = episodeCode.match(/^S(\d+)E\d+$/)
	return match ? Number(match[1]) : 0
}

const getEpisodeNumber = (episodeCode) => {
	const match = episodeCode.match(/^S\d+E(\d+)$/)
	return match ? Number(match[1]) : 0
}

const formatDate = (value) => {
	const date = new Date(value)
	return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('nl-BE')
}

const fetchAllEpisodes = async () => {
	const firstResponse = await fetch(EPISODE_API_URL)
	const firstData = await firstResponse.json()
	const pagePromises = []

	for (let page = 2; page <= firstData.info.pages; page += 1) {
		pagePromises.push(fetch(`${EPISODE_API_URL}?page=${page}`).then((response) => response.json()))
	}

	const otherPages = await Promise.all(pagePromises)

	return [firstData, ...otherPages].flatMap((page) => page.results)
}

export async function setupEpisodesList({ listElement, filterElement, seasonElement, sortElement }) {
	if (!listElement || !filterElement || !seasonElement || !sortElement) {
		return
	}

	listElement.innerHTML = '<p>Episodes worden geladen...</p>'

	try {
		const episodes = await fetchAllEpisodes()

		const seasonNumbers = [...new Set(episodes.map((episode) => getSeasonNumber(episode.episode)).filter(Boolean))].sort(
			(left, right) => left - right,
		)

		seasonNumbers.forEach((seasonNumber) => {
			const option = document.createElement('option')
			option.value = String(seasonNumber)
			option.textContent = `Seizoen ${seasonNumber}`
			seasonElement.appendChild(option)
		})

		const renderEpisodes = () => {
			const query = filterElement.value.trim().toLowerCase()
			const selectedSeason = seasonElement.value
			const sortValue = sortElement.value

			const filteredEpisodes = episodes.filter((episode) => {
				const seasonNumber = String(getSeasonNumber(episode.episode))
				const searchableText = `${episode.name} ${episode.episode} ${episode.air_date}`.toLowerCase()

				const matchesQuery = searchableText.includes(query)
				const matchesSeason = selectedSeason === 'all' ? true : seasonNumber === selectedSeason

				return matchesQuery && matchesSeason
			})

			const sortedEpisodes = [...filteredEpisodes].sort((left, right) => {
				if (sortValue === 'name-asc') {
					return left.name.localeCompare(right.name)
				}

				if (sortValue === 'name-desc') {
					return right.name.localeCompare(left.name)
				}

				if (sortValue === 'date-asc') {
					return new Date(left.air_date) - new Date(right.air_date)
				}

				if (sortValue === 'date-desc') {
					return new Date(right.air_date) - new Date(left.air_date)
				}

				const leftEpisode = getEpisodeNumber(left.episode)
				const rightEpisode = getEpisodeNumber(right.episode)

				return sortValue === 'number-desc' ? rightEpisode - leftEpisode : leftEpisode - rightEpisode
			})

			listElement.innerHTML = sortedEpisodes.length
				? sortedEpisodes
						.map(
							(episode) => `
								<article class="character-card">
									<div class="character-info">
										<h3>${episode.name}</h3>
										${renderDefinitionList([
											{ label: 'Code', value: renderTextValue(episode.episode) },
											{ label: 'Air date', value: renderTextValue(formatDate(episode.air_date)) },
											{ label: 'Seizoen', value: renderTextValue(getSeasonNumber(episode.episode)) },
											{ label: 'Episode', value: renderTextValue(getEpisodeNumber(episode.episode)) },
											{ label: 'Karakters', value: renderListValue(episode.characters) },
										])}
										${createFavoriteButton({
											entityType: 'episode',
											entityId: episode.id,
											entityName: episode.name,
											entityData: episode,
										})}
									</div>
								</article>
							`,
						)
						.join('')
				: '<p>Geen episodes gevonden voor deze filters.</p>'
		}

		renderEpisodes()

		filterElement.addEventListener('input', renderEpisodes)
		seasonElement.addEventListener('change', renderEpisodes)
		sortElement.addEventListener('change', renderEpisodes)

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
		listElement.innerHTML = '<p>De episodes konden niet worden geladen.</p>'
		console.error(error)
	}
}
