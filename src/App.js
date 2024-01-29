import logo from './logo.svg';
import react, {useState, useEffect} from 'react';
import Board from './Board';
import './App.css';

function App() {
  return (
    <div className="App">
        <Board />
        <div id="drag-image" style={{ display: 'none' }}>
            {"Dragging..."}
        </div>
    </div>
);
}

export default App;
