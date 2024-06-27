import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from "main/Navbar";
import Footer from "main/Footer";

import './index.css'

const App = () => (
  <div className="container">
    <div>
    <Navbar/>
    </div>
    <div className="text-center">
      <h2>Welcome to Remote application Home page</h2>
    </div>
    <div>
    <Footer/>
    </div>
  </div>
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)
