import fetch from 'node-fetch'
import fs from 'fs'

// funcion para traer los pokemones
async function fetchPokemonByType (...type) {
  const allPokemon = []

  for (const types of type) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${types}`)
    const data = await response.json()
    allPokemon.push(...data.pokemon.slice(0, 9))
  }
  return allPokemon
}

// funcion para extraer datos de pokemones
async function fetchPokemonDetails (url) {
  const response = await fetch(url)
  const data = await response.json()
  return {
    id: data.id,
    nombre: data.name,
    imagen: data.sprites.front_default,
    tipo: data.types ? data.types.map(typeInfo => typeInfo.type.name) : [],
    habilidades: data.abilities ? data.abilities.map(abilityInfo => abilityInfo.ability.name) : [],
    movimientos: data.moves ? data.moves.map(mov => mov.move.name).slice(0, 8) : []
  }
}

// Funcion que aplica la funcion de traer los pokes por tipos y luego extrae
// los datos de tipos de pokemon (cada url de tipos de pokes usando el .map)
async function createPokemonJSONByType (...type) {
  const pokemonList = await fetchPokemonByType(...type)
  const pokemonDetails = await Promise.all(pokemonList.map(async (pokemon) => {
    return await fetchPokemonDetails(pokemon.pokemon.url)
  }))

  const modifyIdFromPokemonDetails = pokemonDetails.map((pokemon, index) => {
    return {
      ...pokemon,
      id: index + 1
    }
  })
  return modifyIdFromPokemonDetails
}

// Ejecucion del writefile con los datos obtenidos en la funcion createPokesjson
export async function savePokemonDataToFile (...type) {
  const pokemonData = await createPokemonJSONByType(...type)
  fs.writeFileSync('archivos/pokeData.json', JSON.stringify(pokemonData, null, 5))
  console.log(`Datos de Pokémon de tipo ${type.join(', ')} guardados en pokeData.json`)
}
