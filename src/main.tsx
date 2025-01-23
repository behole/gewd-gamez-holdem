import React from 'react'
import ReactDOM from 'react-dom/client'
import { PokerTable } from './components/game/PokerTable'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PokerTable />
  </React.StrictMode>,
)