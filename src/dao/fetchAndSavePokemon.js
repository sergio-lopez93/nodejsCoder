import fetch from 'node-fetch'
import fs from 'fs'

async function fetchPokemonByType (...type) {
  const allPokemon = []

  for (const types of type) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${types}`)
    const data = await response.json()
    allPokemon.push(...data.pokemon.slice(0, 9))
  }
  return allPokemon
}

async function fetchPokemonDetails (url) {
  const response = await fetch(url)
  const data = await response.json()
  console.log(data)
  return {
    id: data.id,
    nombre: data.name,
    imagen: data.sprites.front_default,
    tipo: data.types ? data.types.map(typeInfo => typeInfo.type.name) : [],
    habilidades: data.abilities ? data.abilities.map(abilityInfo => abilityInfo.ability.name) : [],
    movimientos: data.moves ? data.moves.map(mov => mov.move.name).slice(0, 8) : []
  }
}

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

export async function savePokemonDataToFile (...type) {
  const pokemonData = await createPokemonJSONByType(...type)
  fs.writeFileSync('archivos/pokeData.json', JSON.stringify(pokemonData, null, 5))
  console.log(`Datos de Pokémon de tipo ${type.join(', ')} guardados en pokeData.json`)
}
