async function fetchPokemonData () {
  try {
    const response = await fetch('/api/pokemones')
    const data = await response.json()
    return data
  } catch (err) {
    console.error('error al leer el archivo json', err)
  }
}

function createCard (pokemon) {
  const movimientosIniciales = pokemon.movimientos.slice(0, 4)
  const movimientosExtra = pokemon.movimientos.slice(4)

  return `
    <div class="card">
      <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
      <h2>${pokemon.nombre}</h2>
      <p><strong>Tipo:</strong> ${pokemon.tipo.join(', ')}</p>
      <p><strong>Movimientos:</strong></p>
      <ul class="movimientos">
        ${movimientosIniciales.map(movimiento => `<li>${movimiento}</li>`).join('')}
      </ul>
      <button class="toggle-movimientos">Mostrar más</button>
      <div class="popup">
        <ul>
          ${movimientosExtra.map(movimiento => `<li>${movimiento}</li>`).join('')}
        </ul>
      </div>
      </div>
  `
}

async function displayPokemonCards () {
  const data = await fetchPokemonData()
  const container = document.getElementById('cards-container')
  container.innerHTML = Object.values(data).flat().map(createCard).join('')

  document.querySelectorAll('.toggle-movimientos').forEach(button => {
    button.addEventListener('click', () => {
      const popup = button.nextElementSibling
      popup.classList.toggle('show')
      button.textContent = popup.classList.contains('show') ? 'Mostrar menos' : 'Mostrar más'
    })
  })
}

displayPokemonCards()
