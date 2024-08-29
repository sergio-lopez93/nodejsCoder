import express from 'express'
import { router as pokeRouter } from './routes/poke.router.js'
import { router as productsRouter } from './routes/products.router.js'
import { router as cartRouter } from './routes/carts.router.js'
import { router as vistasRouter } from './routes/vistas.router.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

import { PokeManager } from './dao/PokeManager.js'
import { ProductsManager } from './dao/ProductsManager.js'
import { CartsManager } from './dao/CartsManager.js'

let serverSocket

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/pokemones', pokeRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use('/', vistasRouter)
app.use(express.static('public'))

// Configuración de managers
PokeManager.path = './archivos/pokeData.json'
ProductsManager.path = './archivos/products.json'
CartsManager.path = './archivos/carts.json'

app.get('/intro', (req, res) => {
  res.status(200).send('Home Page :D')
})

const serverHTTP = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT}`))
serverSocket = new Server(serverHTTP)

serverSocket.on('connection', (socket) => {
  console.log('Un cliente se ha conectado')

  // Manejar evento para agregar un nuevo Pokémon
  socket.on('nuevoPokemon', (nuevoPokemon) => {
    // Emite el nuevo Pokémon a todos los clientes conectados
    serverSocket.emit('nuevoPokemon', nuevoPokemon)
  })

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado')
  })
})
