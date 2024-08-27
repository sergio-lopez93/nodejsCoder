import fs from 'fs'

export class CartsManager {
  static path

  static async get () {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, { encoding: 'utf-8' }))
    } else {
      return []
    }
  }

  static async create () {
    const teams = await this.get()
    let id = 1
    if (teams.length > 0) {
      id = Math.max(...teams.map(t => t.id)) + 1
    }
    teams.push({
      id,
      pokemones: []
    })
    await fs.promises.writeFile(this.path, JSON.stringify(teams, null, 5))
    return id
  }

  static async update (id, team = {}) {
    const teams = await this.get()
    const teamIndex = teams.findIndex(t => t.id === id)
    if (teamIndex === -1) {
      throw new Error(`${id} del team inexistente`)
    }

    teams[teamIndex] = team
    await fs.promises.writeFile(this.path, JSON.stringify(teams, null, 5))
    return teams[teamIndex]
  }

  static async delete (id) {
    const teams = await this.get()
    let found = false
    for (const obj of teams) {
      const indicePokes = obj.pokemones.findIndex(p => p.pokeID === id)
      if (indicePokes !== -1) {
        obj.pokemones.splice(indicePokes, 1)
        found = true
        break
      }
    }
    if (found) {
      await fs.promises.writeFile(this.path, JSON.stringify(teams, null, 5))
      return 1
    } else {
      throw new Error(`Error: no existe id ${id}`)
    }
  }
}
