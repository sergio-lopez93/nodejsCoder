import express from 'express'
import { router as pokeRouter } from './routes/poke.router.js'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/pokemones', pokeRouter)

app.use(express.static('public'))

app.get('/intro', async (req, res) => {
  console.log('se prendio la fiesta!')
  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send('Home Page :D')
})

app.listen(PORT, () => console.log('conectado al puerto: ', PORT))
