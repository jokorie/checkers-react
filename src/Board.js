import React, { useState } from 'react';
import './Board.css';



const Board = () => {

    const BoardInit = () => {
        const rows = 8;
        const cols = 8;
        const array2D = Array.from({ length: rows }, () => Array(cols).fill(null));
    
        for (let r = 0; r < 3; r++) {
            const delta = r % 2;
            for (let c = 0; c < 8; c = c + 2) {
                array2D[r][c+delta] = "b"
            }
        }
    
        for (let r = 7; r > 4; r--) {
            const delta = r % 2;
            for (let c = 0; c < 8; c = c + 2) {
                array2D[r][c+delta] = "w"
            }
        }
        return array2D;
    }

    const [board, setBoard] = useState(BoardInit());
    const [selectedCell, setSelectedCell] = useState(null); // Store row and col of dragged cell

    // console.log(board);

    const Cell = ({row, col}) => {

        const selectedPiece = (selectedCell)? board[selectedCell.row][selectedCell.col] : null;
        const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;

        const cellStyle = {
            backgroundColor: isSelected ? 'pink' : ((row + col) % 2 === 0 ? 'white' : 'black'),
            // Other styles...
        };

        const piece = board[row][col];

        const handleClick = (row, col) => {
            console.log(row, col, "clicked")
            if (selectedCell) {
                // Move piece if the move is valid
                // console.log(SimpleMove(selectedCell.row, selectedCell.col));
                const validMoves = SimpleMove(selectedCell.row, selectedCell.col);
                const move = [row, col];
                const moveIsValid = validMoves.some(subList => 
                    subList.length === move.length && 
                    subList.every((element, index) => element === move[index])
                );
                
                if (moveIsValid) {
                    console.log("piece moved")
                    movePiece(selectedCell.row, selectedCell.col, row, col);
                }
                // Reset selection regardless of move validity
                setSelectedCell(null);
              } 
            else {
                // Check if the clicked cell has a piece
                if (board[row][col]) {
                  setSelectedCell({ row, col });
                }
            }
        };
        

        return (
            <div 
              className={((row + col) % 2 === 0) ? 'cell white-cell' : 'cell black-cell'}
              style={cellStyle}
              onClick={() => handleClick(row, col)}
            >
                {piece}
            </div>
        );
    }

    
    const InBounds = (row, col) => {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    const SimpleMove = (r, c) => {
        const colorToDelta = {
            "w": [[-1, -1], [-1, 1]],
            "b": [[1, -1], [1, 1]],
            "B": [[1, -1], [1, 1], [-1, -1], [-1, 1]],
            "W": [[1, -1], [1, 1], [-1, -1], [-1, 1]],
        }
    
        const piece = board[r][c];
        if (!piece) {
            console.log("Invalid square selected");
            return []
        };
    
        let moves = [];
        colorToDelta[piece].forEach(delta => {
            const [dr, dc] = delta;
            // console.log(dr, dc);
            // console.log(r+dr, c+dc);
            if (InBounds(r+dr, c+dc) && !board[r+dr][c+dc]) {
                moves.push([r+dr, c+dc]);
            }
        });
    
        return moves;
    }
    
    const movePiece = (fromRow, fromCol, toRow, toCol) => {
        const rowOfFrom = board[fromRow].slice();
        const rowOfTo = board[toRow].slice();
    
        rowOfTo[toCol] = rowOfFrom[fromCol];
        rowOfFrom[fromCol] = null;
    
        const newBoard = board.slice();
        newBoard[fromRow] = rowOfFrom;
        newBoard[toRow] = rowOfTo;
    
        setBoard(newBoard);
        
    };

    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="board-row">
                {row.map((cell, cellIndex) => (
                    <Cell key={cellIndex} 
                          row={rowIndex}
                          col={cellIndex}
                    />
                ))}
                </div>
            ))}
        </div>
    );
}

export default Board;


