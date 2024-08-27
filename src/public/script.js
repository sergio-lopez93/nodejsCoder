async function fetchPokemonData () {
  try {
    const response = await fetch('/api/pokemones')
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Error fetching Pokémon data:', err)
    return []
  }
}

function createCard (pokemon) {
  const card = document.createElement('div')
  card.className = 'card'
  card.innerHTML = `
            <div class="card-content">
                <div class="card-header">
                    <h2 class="card-name">${pokemon.nombre}</h2>
                    <span class="card-hp">HP ${pokemon.hp || 60}</span>
                </div>
                <div class="card-image">
                    <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
                </div>
                <div class="card-info">
                    <p>Tipo: <span>${pokemon.tipo.join(', ')}</span></p>
                    <p>Habilidades: <span>${pokemon.habilidades.join(', ')}</span></p>
                    <p>Movimientos:</p>
                    <ul class="movimientos">
                        ${pokemon.movimientos.slice(0, 4).map(mov => `<li>${mov}</li>`).join('')}
                    </ul>
                </div>
                <button class="show-more-btn" aria-expanded="false" aria-controls="movimientos-${pokemon.id}">
                    Mostrar más
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>
        `

  const showMoreBtn = card.querySelector('.show-more-btn')
  const movimientosList = card.querySelector('.movimientos')

  showMoreBtn.addEventListener('click', () => {
    const expanded = showMoreBtn.getAttribute('aria-expanded') === 'true'
    showMoreBtn.setAttribute('aria-expanded', !expanded)
    if (expanded) {
      movimientosList.innerHTML = pokemon.movimientos.slice(0, 4).map(mov => `<li>${mov}</li>`).join('')
      showMoreBtn.innerHTML = `
                    Mostrar más
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                `
    } else {
      movimientosList.innerHTML = pokemon.movimientos.map(mov => `<li>${mov}</li>`).join('')
      showMoreBtn.innerHTML = `
                    Mostrar menos
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                `
    }
  })

  return card
}

async function displayPokemonCards () {
  const cardsContainer = document.getElementById('cards-container')
  const pokemonData = await fetchPokemonData()

  pokemonData.forEach(pokemon => {
    const card = createCard(pokemon)
    cardsContainer.appendChild(card)
  })
}

displayPokemonCards()
