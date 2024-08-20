import fs from 'fs'

export class PokeManager {
  static path

  static async getPokes () {
    if (fs.existsSync(this.path)) {
      const pokeData = await fs.promises.readFile(this.path, { encoding: 'utf-8' })
      const getPokes = JSON.parse(pokeData)
      const pokeMap = getPokes.map(poke => {
        return {
          ...poke,
          nombre: poke.nombre.toUpperCase()
        }
      })
      return pokeMap
    } else {
      return []
    }
  }

  static async updatePokemon (id, aModificar = {}) {
    const pokemones = await this.getPokes()
    const indicePokemon = pokemones.findIndex(p => p.id === id)
    if (indicePokemon === -1) {
      throw new Error(`El id ${id} no existe!`)
    }
    pokemones[indicePokemon] = {
      ...pokemones[indicePokemon],
      ...aModificar,
      id
    }
    await fs.promises.writeFile(this.path, JSON.stringify(pokemones, null, 5))
    return pokemones[indicePokemon]
  }

  static async deletePoke (id) {
    const pokemones = await this.getPokes()
    const indicePokes = pokemones.findIndex(p => p.id === id)
    if (indicePokes === -1) {
      throw new Error(`Error: no existe id ${id}`)
    }

    const [pokeEliminado] = pokemones.splice(indicePokes, 1)
    if (pokeEliminado) {
      await fs.promises.writeFile(this.path, JSON.stringify(pokemones, null, 5))
    }

    return pokeEliminado ? 1 : 0
  }
}
