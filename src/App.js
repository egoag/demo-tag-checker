import React, { useState } from 'react'

import './App.css'
import Checker from './lib/checker'

const App = () => {
  const [text, setText] = useState()
  const [result, setResult] = useState()
  const check = () => {
    let newResult
    try {
      newResult = Checker(text)
    } catch (err) {
      newResult = err.message
      console.log(err.stack)
    }
    setResult(newResult)
  }

  return (
    <div className="App">
      <h1>Tag Checker</h1>
      <h2>Input text below and click Check</h2>
      <form
        onSubmit={e => {
          e.preventDefault()
          check()
        }}
      >
        <textarea
          cols={100}
          rows={20}
          onChange={event => setText(event.target.value)}
          placeholder="Text"
        />
        <div>
          <button>Check</button>
        </div>
      </form>
      <p>{result}</p>
    </div>
  )
}

export default App
