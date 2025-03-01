// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

export function useLocalStorageState(key, defaultValue = '') {
  const [state, setState] = React.useState(
    () => JSON.parse(window.localStorage.getItem(key)) || defaultValue,
  )

  const previousKeyRef = React.useRef(key)

  React.useEffect(() => {
    if (previousKeyRef.current !== key) {
      window.localStorage.removeItem(previousKeyRef.current)
    }
    previousKeyRef.current = key

    window.localStorage.setItem(key, JSON.stringify(state))
  }, [state, key])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
