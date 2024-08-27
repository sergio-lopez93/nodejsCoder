import { Router } from 'express'
import { PokeManager } from '../dao/PokeManager.js'
import { CartsManager } from '../dao/CartsManager.js'

export const router = Router()

router.put('/:teamID/pokemon/:pokeID', async (req, res) => {
  let { teamID, pokeID } = req.params
  teamID = Number(teamID)
  pokeID = Number(pokeID)
  if (isNaN(teamID) || isNaN(pokeID)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Los id\'s deben ser numéricos...!!!' })
  }

  const teams = await CartsManager.get()
  let team = teams.find(t => t.id === teamID)
  if (!team) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `Team Pokemon inexistente ${teamID}` })
  }

  const pokemones = await PokeManager.getPokes()
  const existe = pokemones.find(p => p.id === pokeID)
  if (!existe) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `Pokemon ${pokeID} inexistente...!!!` })
  }

  const indicePokemon = team.pokemones.findIndex(p => p.pokeID === pokeID)
  if (indicePokemon !== -1) {
    team.pokemon[indicePokemon].pokemones++
  } else {
    team.pokemones.push({
      pokeID, inscripciones: 1
    })
  }

  team = await CartsManager.update(teamID, team)

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ team })
})

router.delete('/pokemon/:id', async (req, res) => {
  let { id } = req.params
  id = Number(id)
  if (isNaN(id)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'id debe ser numerico' })
  }

  try {
    const resultado = await CartsManager.delete(id)
    if (resultado > 0) {
      res.setHeader('Content-Type', 'application/json')
      return res.status(200).json({ payload: 'Pokemon expulsado del equipo </3 ...!!!' })
    } else {
      res.setHeader('Content-Type', 'application/json')
      return res.status(500).json({ error: 'Error al expulsar! ' })
    }
  } catch (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json(
      {
        error: 'Error inesperado en servidor',
        detalle: `${error.message}`
      }
    )
  }
})
