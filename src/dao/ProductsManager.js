import fs from 'fs'
import { CartsManager } from './CartsManager.js'

export class ProductsManager {
  static path

  static async get () {
    if (fs.existsSync(this.path)) {
      const trainerData = await fs.promises.readFile(this.path, { encoding: 'utf-8' })
      const getTrainer = JSON.parse(trainerData)
      return getTrainer
    } else {
      return []
    }
  }

  static async create (trainer = {}) {
    if (!trainer.email) {
      throw new Error('email es requerido')
    }
    const trainers = await this.get()
    const existe = trainers.find(t => t.email === trainer.email)
    if (existe) {
      throw new Error(`${trainer.email} ya existe en el sistema`)
    }
    let id = 1
    if (trainers.length > 0) {
      id = Math.max(...trainers.map(d => d.id)) + 1
    }

    const teamID = await CartsManager.create()

    const newTrainer = {
      id,
      ...trainer,
      teamID
    }
    trainers.push(newTrainer)
    await fs.promises.writeFile(this.path, JSON.stringify(trainers, null, 5))
    return newTrainer
  }
}
