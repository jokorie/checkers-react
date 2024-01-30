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
    const [maxTurn, setMaxTurn] = useState(true) // max player is white

    const Cell = ({row, col}) => {

        const selectedPiece = (selectedCell)? board[selectedCell.row][selectedCell.col] : null;
        const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;

        const cellStyle = {
            backgroundColor: isSelected ? 'pink' : ((row + col) % 2 === 0 ? 'white' : 'black'),
            // Other styles...
        };

        const piece = board[row][col];

        const handleClick = (row, col) => {
            console.log(row, col, "clicked");
            // console.log(selectedCell, "selected")
            if (selectedCell) {
                // Move piece if the move is valid
                // console.log(SimpleMove(selectedCell.row, selectedCell.col));
                console.log("selected");
                const validMoves = Move(selectedCell.row, selectedCell.col);
                console.log(validMoves, "validmoves");
                const move = [row, col];

                for (let i = 0; i < validMoves.length; i++) {
                    const [from, removed] = validMoves[i];
                    // console.log(move, from, removed);
                    let [rowRemoved, colRemoved] = [null, null];
                    if (move.length == from.length && move.every((element, index) => element === from[index])) {
                        console.log("piece moved");
                        if (removed.length) {
                            console.log("Attempting to remove", removed);
                            [rowRemoved, colRemoved] = removed;
                            console.log("successfully removed", removed)
                        }
                        // console.log(selectedCell.row, selectedCell.col, row, col);
                        movePiece(selectedCell.row, selectedCell.col, row, col, rowRemoved, colRemoved);
                        // console.log(board);
                        break;
                    }
                }
                console.log("Reset selected")
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
                moves.push([[r+dr, c+dc],[]]);
            }
        });
    
        return moves;
    }

    const CaptureMove = (r, c) => {
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
            // console.log(r, c);
            // console.log(r+dr, c+dc);
            // console.log(r+2*dr, c+2*dc);

            // console.log(InBounds(r+dr, c+dc),
            // InBounds(r+2*dr, c+2*dc),
            // board[r+dr][c+dc],
            // board[r+dr][c+dc] !== piece,
            // !(board[r+dr][c+dc]));

            if (InBounds(r+dr, c+dc) && 
                InBounds(r+2*dr, c+2*dc) && 
                board[r+dr][c+dc] && 
                board[r+dr][c+dc] !== piece &&
                !(board[r+2*dr][c+2*dc])) {
                moves.push([[r+2*dr, c+2*dc], [r+dr, c+dc]]);
            }
        });
    
        return moves;
    }

    const Move = (r, c) => {
        const simpMoves = SimpleMove(r, c);
        const captMoves = CaptureMove(r, c);
        const moves = [...simpMoves, ...captMoves];
    
        return moves;
    }
    

    const movePiece = (fromRow, fromCol, toRow, toCol, rowRemoved=null, colRemoved=null) => {
        // console.log(board);
        // console.log(fromRow, fromCol, toRow, toCol);
        const rowOfFrom = board[fromRow].slice();
        const rowOfTo = board[toRow].slice();
    
        rowOfTo[toCol] = rowOfFrom[fromCol];
        rowOfFrom[fromCol] = null;
    
        const newBoard = board.slice();
        newBoard[fromRow] = rowOfFrom;
        newBoard[toRow] = rowOfTo;

        if (rowRemoved) {
            newBoard[rowRemoved][colRemoved] = null;
        }
        
        setMaxTurn(!maxTurn);
        setBoard(newBoard);
        
    };

    const clearCell = (r, c) => {
        // console.log(board);
        console.log(r, c);
        console.log(board[r][c]);
        const row = board[r].slice();
        row[c] = null;
        
        const newBoard = board.slice();
        newBoard[r] = row;

        setBoard(newBoard);
        // console.log(newBoard[r][c]);
        // console.log(board[r][c]);
    };
    

    const evaluateBoard = (board) => {
        // const playerPiece = (maxTurn)? "w" : "b";
        let score = 0;

        for (let r = 0; r < 8; r++) {
            const delta = r % 2;
            for (let c = 0; c < 8; c = c + 2) {
                const piece = board[r][c+delta];
                if (piece) {
                    score += (piece === "w")? 1 : -1;
                }
            }
        }

        return score;
    }

    const minimax = (board, isMaxTurn, depth, depthLeft) => {

        const playerPiece = (isMaxTurn)? "w" : "b";

        if (depth === depthLeft) {
            console.log("Base Depth Hit")
            return [evaluateBoard(board), [null, [null, null]]]
        }
        let validMoves = [];
        for (let r = 0; r < 8; r++) {
            const delta = r % 2;
            for (let c = 0; c < 8; c = c + 2) {
                const piece = board[r][c+delta];
                if (playerPiece === piece) {
                    // console.log("Here")
                    const moves = Move(r, c+delta);
                    // console.log(r, c+delta, moves);
                    if (moves) validMoves.push([[r, c+delta], moves]);
                }
            }
        }

        let bestScore = null;
        let bestMove = null;
        
        validMoves.forEach((move, _) => {
            const [r_f, c_f] = move[0];
            const tos = move[1];
            tos.forEach(([to, removed], _) => {
                // console.log(removed);
                const r_piece = (removed && removed.length)? board[removed[0]][removed[1]] : null
                const piece = board[r_f][c_f];
                const [r_t, c_t] = to;
                board[r_t][c_t] = board[r_f][c_f];
                board[r_f][c_f] = null;
                if (removed && removed.length) board[removed[0]][removed[1]] = null;

                const newScore = minimax(board, !isMaxTurn, depth + 1, depthLeft);

                if (isMaxTurn) {
                    if (bestScore === null || newScore >= bestScore) {
                        bestScore = newScore;
                        bestMove = [move[0], [to, removed]];
                    }
                }
                else {
                    if (bestScore === null || newScore <= bestScore) {
                        bestScore = newScore;
                        bestMove = [move[0], [to, removed]];
                    }
                }

                board[r_t][c_t] = null;
                board[r_f][c_f] = piece;

                if (removed && removed.length) board[removed[0]][removed[1]] = r_piece;


            })
        })
        return [bestScore, bestMove]
        

    }

    if (!maxTurn) {
        const [_, moveInfo] = minimax(board, maxTurn, 0, 4);
        // console.log(_, moveInfo);
        let [rowRemoved, colRemoved] = [null, null];
        const [[r_f, c_f], [[r_t, c_t], removed]] = moveInfo;
        // console.log(r_f, c_f, r_t, c_t);

        if (removed && removed.length) {
            [rowRemoved, colRemoved] = removed;
        }
        movePiece(r_f, c_f, r_t, c_t, rowRemoved, colRemoved);
        // const [maxTurn, setMaxTurn] = useState(true) // max player is white
    }

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


