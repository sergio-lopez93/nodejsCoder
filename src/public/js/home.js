// home.js
const socket = io() // Inicializa Socket.IO en el cliente

// Función para agregar un Pokémon al equipo
const agregarPokemon = async (pokeID) => {
  const urlParams = new URLSearchParams(window.location.search)
  const teamID = urlParams.get('teamID') // Obtén el teamID de la URL

  try {
    const respuesta = await fetch(`/api/carts/${teamID}/pokemon/${pokeID}`, {
      method: 'PUT'
    })
    const datos = await respuesta.json()
    console.log(datos, respuesta.status)

    if (respuesta.ok) {
      // Notificar a todos los clientes sobre la actualización
      socket.emit('agregarPokemon', { teamID, pokeID })
    } else {
      alert(datos.error || 'Error al agregar el Pokémon')
    }
  } catch (error) {
    console.error('Error al agregar el Pokémon:', error)
    alert('Hubo un problema al agregar el Pokémon. Inténtalo de nuevo más tarde.')
  }
}

// Manejo del evento de actualización del equipo
socket.on('actualizarEquipo', async (data) => {
  // Actualiza la vista del equipo en la página del equipo
  const teamID = data.teamID
  await actualizarEquipo(teamID)
})

// Función para obtener y mostrar los Pokémon disponibles
const obtenerPokemones = async () => {
  try {
    const respuesta = await fetch('/api/pokemones')
    const { pokemones } = await respuesta.json()
    const divTodosPokemones = document.getElementById('todosPokemones')
    divTodosPokemones.innerHTML = ''

    pokemones.forEach(pokemon => {
      const divPokemon = document.createElement('div')
      divPokemon.className = 'pokemon-card'
      divPokemon.innerHTML = `
                <img src="${pokemon.imagen}" alt="${pokemon.nombre}" style="width: 100px; height: 100px;">
                <h3>${pokemon.nombre}</h3>
                <button onclick="agregarPokemon(${pokemon.id})">Agregar al equipo</button>
            `
      divTodosPokemones.appendChild(divPokemon)
    })
  } catch (error) {
    console.error('Error al obtener los Pokémon:', error)
  }
}

// Ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerPokemones)
