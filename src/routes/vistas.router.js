import { Router } from 'express'
import { ProductsManager } from '../dao/ProductsManager.js'
import { CartsManager } from '../dao/CartsManager.js'
import { PokeManager } from '../dao/PokeManager.js'

export const router = Router()

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.status(200).render('index')
})

// Ruta para obtener información del equipo y entrenador basado en ID
router.get('/teams', async (req, res) => {
  let { id, teamID } = req.query

  if (!id || !teamID) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Complete id / teamID' })
  }

  id = Number(id)
  teamID = Number(teamID)

  if (isNaN(id) || isNaN(teamID)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Formato de argumentos inválido...!!!' })
  }

  try {
    // Obtener la lista de entrenadores   ==============================================================
    const trainers = await ProductsManager.get()
    const trainer = trainers.find(t => t.id === id)

    if (!trainer) {
      res.setHeader('Content-Type', 'application/json')
      return res.status(400).json({ error: `Entrenador con id ${id} inexistente` })
    }

    // obtener lista de pokemones         ==============================================================
    const pokemones = await PokeManager.getPokes()

    // Obtener la lista de equipos        ==============================================================
    const teams = await CartsManager.get()
    const team = teams.find(t => t.id === teamID)

    if (!team) {
      res.setHeader('Content-Type', 'application/json')
      return res.status(400).json({ error: 'Problemas con los datos del equipo' })
    }

    // Buscamos los pokes del equipo
    team.pokemones.forEach(pokemon => {
      const pokeData = pokemones.find(p => p.id === pokemon.pokeID)
      if (pokeData) {
        pokemon.nombre = pokeData.nombre // Añadimos el nombre del pokemon
        pokemon.imagen = pokeData.imagen // Añadimos la imagen del pokemon
      } else {
        console.log(`Error con el pokemon ID ${pokemon.pokeID}`)
      }
    })

    console.log(team)

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('teams', {
      trainer,
      team,
      pokemones
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en el servidor. Intente más tarde.' })
  }
})
