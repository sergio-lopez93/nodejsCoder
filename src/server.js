import express from 'express'
import { router as pokeRouter } from './routes/poke.router.js'
import { router as productsRouter } from './routes/products.router.js'
import { router as cartRouter } from './routes/carts.router.js'
import { PokeManager } from './dao/PokeManager.js'
import { ProductsManager } from './dao/ProductsManager.js'
import { CartsManager } from './dao/CartsManager.js'
const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/pokemones', pokeRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)

app.use(express.static('public'))

PokeManager.path = './archivos/pokeData.json'
ProductsManager.path = './archivos/products.json'
CartsManager.path = './archivos/carts.json'

app.get('/intro', async (req, res) => {
  console.log('se prendio la fiesta!')
  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send('Home Page :D')
})

app.listen(PORT, () => console.log('conectado al puerto: ', PORT))
