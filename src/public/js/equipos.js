// equipo.js
const socket = io() // Inicializa Socket.IO en el cliente

// Función para actualizar la vista del equipo
const actualizarEquipo = async (teamID, pokeID) => {
  try {
    // Asegúrate de que teamID y pokeID sean números válidos
    teamID = Number(teamID)
    pokeID = Number(pokeID)

    if (isNaN(teamID) || isNaN(pokeID)) {
      console.error('Los ID\'s deben ser numéricos')
      alert('Error: Los ID\'s deben ser numéricos')
      return // Salir de la función si los IDs no son válidos
    }

    const respuesta = await fetch(`/api/carts/${teamID}/pokemon/${pokeID}`, {
      method: 'PUT'
    })

    // Revisa si la respuesta es un JSON válido
    const contenidoTipo = respuesta.headers.get('content-type')
    if (contenidoTipo && contenidoTipo.indexOf('application/json') !== -1) {
      const datos = await respuesta.json()
      console.log(datos, respuesta.status)

      if (respuesta.ok) {
        location.reload()
      }
    } else {
      // Si la respuesta no es JSON, muestra el texto para depuración
      const textoError = await respuesta.text()
      console.error('Respuesta inesperada:', textoError)
      alert('Hubo un problema al actualizar el equipo. Por favor, inténtalo de nuevo.')
    }
  } catch (error) {
    console.error('Error al actualizar el equipo:', error)
    alert('Hubo un problema al actualizar el equipo. Por favor, inténtalo de nuevo.')
  }
}

// Obtener los datos de los Pokémon cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
  const botonesActualizar = document.querySelectorAll('.actualizarEquipo')

  botonesActualizar.forEach(boton => {
    boton.addEventListener('click', () => {
      const teamID = boton.getAttribute('data-team-id')
      const pokeID = boton.getAttribute('data-poke-id')

      actualizarEquipo(teamID, pokeID)
    })
  })
})

// Manejo del evento de actualización del equipo a través de Socket.IO
socket.on('actualizarEquipo', (data) => {
  // Verificar si data contiene tanto teamID como pokeID
  if (data && data.teamID && data.pokeID) {
    actualizarEquipo(data.teamID, data.pokeID)
  } else {
    console.error('Faltan datos para actualizar el equipo', data)
  }
})
