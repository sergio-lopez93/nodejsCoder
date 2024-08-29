import { Router } from 'express'
import { ProductsManager } from '../dao/ProductsManager.js'
import { CartsManager } from '../dao/CartsManager.js'
import { PokeManager } from '../dao/PokeManager.js'

export const router = Router()

router.get('/', async (req, res) => {
  try {
    const trainers = await ProductsManager.get()
    res.status(200).json({ trainers })
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado en el servidor', details: error.message })
  }
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ error: 'Ingrese un ID numérico' })

  try {
    const trainers = await ProductsManager.get()
    const trainer = trainers.find(t => t.id === id)
    if (!trainer) return res.status(400).json({ error: `No existen entrenadores con ID ${id}` })

    const teams = await CartsManager.get()
    const team = teams.find(t => t.id === trainer.teamID)
    if (!team) return res.status(500).json({ error: 'Error en los datos del entrenador' })

    const pokemones = await PokeManager.getPokes()
    const pokeTeam = team.pokemones.map(t => {
      const datos = pokemones.find(pokemon => pokemon.id === t.pokeID)
      return datos ? { id: datos.id, nombre: datos.name, inscripciones: t.inscripciones } : null
    }).filter(p => p !== null)

    res.status(200).json({ trainer, pokemones: pokeTeam })
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado en el servidor', details: error.message })
  }
})

router.post('/login', async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Complete email' })
  }
  const trainers = await ProductsManager.get()
  const trainer = trainers.find(t => t.email === email)
  if (!trainer) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `Error: Entrenador pokemon inexistente con email ${email}` })
  }

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ trainer })
})

router.post('/', async (req, res) => {
  const { nombre, email } = req.body
  if (!nombre || !email) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Complete nombre / email' })
  }

  try {
    const nuevoTrainer = await ProductsManager.create({ nombre, email })
    res.setHeader('Content-Type', 'application/json')
    return res.status(201).json({ nuevoTrainer })
  } catch (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json(
      {
        error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
        detalle: `${error.message}`
      }
    )
  }
})
