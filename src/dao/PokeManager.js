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
}
