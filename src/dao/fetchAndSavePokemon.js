import fetch from 'node-fetch'
import fs from 'fs'

// Función para leer el contenido existente de pokeData.json
function readExistingPokemonData () {
  try {
    const data = fs.readFileSync('archivos/pokeData.json', 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading existing data:', err)
    return [] // Si el archivo no existe o hay un error, retornamos un array vacío
  }
}

// Función para obtener el próximo ID disponible
function getNextId (existingPokemonData) {
  if (existingPokemonData.length === 0) return 1
  return Math.max(...existingPokemonData.map(pokemon => pokemon.id)) + 1
}

// Función para verificar si un Pokémon ya existe en la lista
function isPokemonInList (pokemon, pokemonList) {
  return pokemonList.some(existingPokemon => existingPokemon.nombre === pokemon.nombre)
}

// Función para obtener datos de Pokémon por tipo
async function fetchPokemonByType (...type) {
  const allPokemon = []
  for (const types of type) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${types}`)
    const data = await response.json()
    allPokemon.push(...data.pokemon)
  }
  return allPokemon
}

// Función para extraer datos de Pokémon
async function fetchPokemonDetails (url) {
  const response = await fetch(url)
  const data = await response.json()
  return {
    id: data.id, // Este ID será reemplazado por un nuevo ID único en el siguiente paso
    nombre: data.name,
    imagen: data.sprites.front_default,
    tipo: data.types ? data.types.map(typeInfo => typeInfo.type.name) : [],
    habilidades: data.abilities ? data.abilities.map(abilityInfo => abilityInfo.ability.name) : [],
    movimientos: data.moves ? data.moves.map(mov => mov.move.name).slice(0, 8) : []
  }
}

// Función para crear el JSON de Pokémon por tipo
async function createPokemonJSONByType (...type) {
  const pokemonList = await fetchPokemonByType(...type)
  const pokemonDetails = await Promise.all(pokemonList.map(async (pokemon) => {
    return await fetchPokemonDetails(pokemon.pokemon.url)
  }))

  // Leer los datos existentes para calcular el próximo ID
  const existingPokemonData = readExistingPokemonData()
  const nextId = getNextId(existingPokemonData)

  // Asignar IDs únicos a cada Pokémon
  const modifyIdFromPokemonDetails = pokemonDetails.map((pokemon, index) => {
    return {
      ...pokemon,
      id: nextId + index // Asegura que los IDs sean únicos y continúen secuencialmente
    }
  })

  return modifyIdFromPokemonDetails
}

// Guardar los datos de Pokémon en el archivo
export async function savePokemonDataToFile (...type) {
  const pokemonData = await createPokemonJSONByType(...type)

  // Leer los datos existentes de pokeData.json
  const existingPokemonData = readExistingPokemonData()

  // Filtrar para agregar solo Pokémon que no están ya en los datos existentes
  const newPokemonData = pokemonData.filter(pokemon => !isPokemonInList(pokemon, existingPokemonData))

  // Combinar los Pokémon existentes con los nuevos no duplicados
  const combinedPokemonData = [...existingPokemonData, ...newPokemonData]

  // Escribir los datos combinados de nuevo en pokeData.json
  fs.writeFileSync('archivos/pokeData.json', JSON.stringify(combinedPokemonData, null, 5))
  console.log(`Datos de Pokémon de tipo ${type.join(', ')} guardados en pokeData.json`)
}
