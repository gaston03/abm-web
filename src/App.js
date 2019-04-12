import React, { Component } from 'react'
import './App.css'
import List from './components/List'

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Data IQ
                    </p>
                </header>
                <List/>
            </div>
        )
    }
}

export default App
