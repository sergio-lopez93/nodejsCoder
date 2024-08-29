import { Router } from 'express'
import { PokeManager } from '../dao/PokeManager.js'
import { CartsManager } from '../dao/CartsManager.js'

export const router = Router()

router.put('/:teamID/pokemon/:pokeID', async (req, res) => {
  let { teamID, pokeID } = req.params

  teamID = Number(teamID)
  pokeID = Number(pokeID)

  // Validación de ID's
  if (isNaN(teamID) || isNaN(pokeID)) {
    return res.status(400).json({ error: 'Los ID\'s deben ser numéricos' })
  }

  try {
    // Obtener equipos
    const teams = await CartsManager.get()
    if (!teams) {
      console.error('Error: No se pudieron obtener los equipos.')
      return res.status(500).json({ error: 'No se pudieron obtener los equipos' })
    }

    const team = teams.find(t => t.id === Number(teamID))
    if (!team) {
      return res.status(400).json({ error: `Equipo Pokémon inexistente ${teamID}` })
    }

    // Obtener pokemones
    const pokemones = await PokeManager.getPokes()
    if (!pokemones) {
      console.error('Error: No se pudieron obtener los pokemones.')
      return res.status(500).json({ error: 'No se pudieron obtener los pokemones' })
    }

    const existe = pokemones.find(p => p.id === Number(pokeID))
    if (!existe) {
      return res.status(400).json({ error: `Pokémon ${pokeID} inexistente` })
    }

    // Actualizar el equipo con el nuevo Pokémon
    const indicePokemon = team.pokemones.findIndex(p => p.pokeID === Number(pokeID))
    if (indicePokemon !== -1) {
      team.pokemones[indicePokemon].inscripciones++
    } else {
      team.pokemones.push({ pokeID: Number(pokeID), inscripciones: 1 })
    }

    // Guardar el equipo actualizado
    const updatedTeam = await CartsManager.update(Number(teamID), team)
    if (!updatedTeam) {
      console.error('Error: No se pudo actualizar el equipo.')
      return res.status(500).json({ error: 'No se pudo actualizar el equipo' })
    }

    // Respuesta exitosa
    res.status(200).json({ team: updatedTeam })
  } catch (error) {
    // Captura de cualquier error inesperado
    console.error('Error inesperado:', error)
    res.status(500).json({ error: 'Error interno del servidor', details: error.message })
  }
})

/* router.put('/:teamID/pokemon/:pokeID', async (req, res) => {
  const { teamID, pokeID } = req.params
  if (isNaN(teamID) || isNaN(pokeID)) {
    return res.status(400).json({ error: 'Los ID\'s deben ser numéricos' })
  }

  try {
    const teams = await CartsManager.get()
    const team = teams.find(t => t.id === Number(teamID))
    if (!team) return res.status(400).json({ error: `Equipo Pokémon inexistente ${teamID}` })

    const pokemones = await PokeManager.getPokes()
    const existe = pokemones.find(p => p.id === Number(pokeID))
    if (!existe) return res.status(400).json({ error: `Pokémon ${pokeID} inexistente` })

    const indicePokemon = team.pokemones.findIndex(p => p.pokeID === Number(pokeID))
    if (indicePokemon !== -1) {
      team.pokemones[indicePokemon].inscripciones++
    } else {
      team.pokemones.push({ pokeID: Number(pokeID), inscripciones: 1 })
    }

    const updatedTeam = await CartsManager.update(Number(teamID), team)
    res.status(200).json({ team: updatedTeam })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', details: error.message })
  }
}) */

router.delete('/pokemon/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ error: 'ID debe ser numérico' })

  try {
    const resultado = await CartsManager.delete(id)
    if (resultado > 0) {
      return res.status(200).json({ payload: 'Pokémon expulsado del equipo' })
    } else {
      return res.status(500).json({ error: 'Error al expulsar' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado en el servidor', details: error.message })
  }
})
