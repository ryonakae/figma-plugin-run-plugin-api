import React from 'react'
import ReactDOM from 'react-dom'
import App from '@/src/App'

const plugin = document.getElementById('plugin') as HTMLElement

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  plugin
)
