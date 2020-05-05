import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import Join from './components/Join'
import Chat from './components/Chat'

const App = () => {
    return (
        // <h1>This sucks</h1>
        <Router>
            <Route path="/" component={Join} />
            <Route path="/chat" component={Chat} />
        </Router>
    )
}

export default App
