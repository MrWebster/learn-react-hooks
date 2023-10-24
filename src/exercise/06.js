// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

import {ErrorBoundary} from 'react-error-boundary'

const emptyNetworkStatus = {
  initial: false,
  pending: false,
  resolved: false,
  rejected: false,
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  // const [callStatus, SetCallStatus] = React.useState({
  //   ...emptyNetworkStatus,
  //   initial: true,
  // })
  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState(null)
  const [infoState, setInfoState] = React.useState({
    status: {...emptyNetworkStatus, initial: true},
    pokemon: null,
  })

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    console.log(pokemonName)

    // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
    if (!pokemonName) {
      return
    }

    // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
    // (This is to enable the loading state when switching between different pokemon.)
    // setPokemon(null)
    // setError(null)

    setInfoState({
      status: {...emptyNetworkStatus, pending: true},
      pokemon: null,
    })

    // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    //   fetchPokemon('Pikachu').then(
    //     pokemonData => {/* update all the state here */},
    //   )
    fetchPokemon(pokemonName)
      .then(data => {
        console.log(data)
        setInfoState({
          status: {...emptyNetworkStatus, resolved: true},
          pokemon: data,
        })
      })
      .catch(error => {
        setInfoState({
          status: {...emptyNetworkStatus, rejected: true},
          pokemon: null,
          error: error,
        })
      })

    // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  }, [pokemonName])

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  console.log(infoState)

  if (infoState.status.initial) {
    return 'Submit a pokemon'
  }

  if (infoState.status.rejected) {
    // throw infoState.error // to test error boundry

    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{infoState.error.message}</pre>
      </div>
    )
  }

  if (infoState.status.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (infoState.status.resolved) {
    return <PokemonDataView pokemon={infoState.pokemon} />
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <>
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
      <button onClick={resetErrorBoundary}>try again</button>
    </>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
