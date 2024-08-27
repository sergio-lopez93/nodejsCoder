import { Router } from 'express'
import { ProductsManager } from '../dao/ProductsManager.js'
import { CartsManager } from '../dao/CartsManager.js'
import { PokeManager } from '../dao/PokeManager.js'

export const router = Router()

router.get('/', async (req, res) => {
  try {
    const trainers = await ProductsManager.get()

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ trainers })
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

router.get('/:id', async (req, res) => {
  let { id } = req.params
  id = Number(id)
  if (isNaN(id)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Ingrese un id numérico' })
  }

  const trainers = await ProductsManager.get()
  const trainer = trainers.find(t => t.id === id)
  if (!trainer) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `No existen entrenadores pokemon con id ${id}` })
  }

  const teams = await CartsManager.get()
  const team = teams.find(t => t.id === trainer.teamID)
  if (!team) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ error: 'Error en los datos del entrenador pokemon' })
  }
  const pokeTeam = []
  const pokemones = await PokeManager.getPokes()
  team.pokemones.forEach(t => {
    const datos = pokemones.find(pokemon => pokemon.id === t.pokeID)
    if (datos) {
      const pokes = {
        id: datos.id,
        nombre: datos.nombre,
        imagen: datos.imagen,
        tipo: datos.tipo
      }
      pokeTeam.push(pokes)
    }
  })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ trainer, pokeTeam })
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
