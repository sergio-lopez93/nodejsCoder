import { Router } from 'express'
import { PokeManager } from '../dao/PokeManager.js'
import { savePokemonDataToFile } from '../dao/fetchAndSavePokemon.js'

export const router = Router()

router.get('/', async (req, res) => {
  try {
    const pokemones = await PokeManager.getPokes()
    let { limit } = req.query
    limit = Number(limit)
    if (limit && (isNaN(limit) || limit < 1)) {
      return res.status(400).send('El argumento limit debe ser un número positivo')
    }
    const result = pokemones.slice(0, limit || pokemones.length)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).send('Error al leer el archivo JSON')
  }
})

router.get('/:pid', async (req, res) => {
  try {
    const pokemones = await PokeManager.getPokes()
    const pid = Number(req.params.pid)
    if (isNaN(pid)) return res.status(400).json({ error: 'El argumento id debe ser numérico' })

    const result = pokemones.filter(pokemon => pokemon.id === pid)
    if (result.length === 0) return res.status(404).json({ error: 'Pokémon no encontrado' })
    res.status(200).json(result)
  } catch (err) {
    res.status(500).send('Error al leer el archivo JSON')
  }
})

router.post('/create-type', async (req, res) => {
  const { type } = req.body
  if (!type) {
    await savePokemonDataToFile('normal')
    return res.status(202).json({ ok: 'Campo vacío, se agregarán pokemones normales por defecto' })
  }

  const printType = type.split(',').map(t => t.trim())
  if (!printType.every(t => typeof t === 'string' && t.length > 0)) {
    return res.status(400).json({ error: 'Los datos deben ser letras' })
  }

  try {
    const pokemones = await savePokemonDataToFile(...printType)
    res.status(200).json({ message: `Se han agregado los siguientes tipos de pokemones: ${printType}`, pokemones })
  } catch (err) {
    res.status(500).json({ error: 'Ha ocurrido un error', details: err.message })
  }
})

/* router.put('/:id', async (req, res) => {
  let { id } = req.params
  id = Number(id)

  if (isNaN(id)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'id debe ser numerico' })
  }

  let pokemones
  try {
    pokemones = await PokeManager.getPokes()
  } catch (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json(
      {
        error: 'Error en el servidor',
        detalle: `${error.message}`
      }
    )
  }

  const pokemon = pokemones.find(p => p.id === id)
  if (!pokemon) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `el Pokemon con id ${id} no se encuentra` })
  }

  const aModificar = req.body

  delete aModificar.id

  if (aModificar.nombre) {
    const existe = pokemones.find(p => p.nombre.toLowerCase().trim() === aModificar.nombre.toLowerCase().trim() && p.id !== id)
    if (existe) {
      res.setHeader('Content-Type', 'application/json')
      return res.status(400).json({ error: `Ya existe un pokemon llamado ${aModificar.nombre}` })
    } else {
      res.setHeader('Content-Type', 'application/json')
      return res.status(400).json({ error: 'El campo "nombre" es requerido' })
    }
  }

  try {
    const pokemonModificado = await PokeManager.updatePokemon(id, aModificar)
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({ pokemonModificado })
  } catch (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json(
      {
        error: 'Error en el servidor',
        detalle: `${error.message}`
      }
    )
  }
})
*/
