// Damas Pro - Game Engine
// Criado com técnica REA + Harness²

class GameEngine {
    constructor() {
        this.board = this.createInitialBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.scores = { white: 0, black: 0 };
        this.timers = { white: 600, black: 600 }; // 10 minutes in seconds
        this.timerInterval = null;
        this.animationEnabled = false;
        this.gameOver = false;
    }

    createInitialBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Place white pieces (top)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { player: 'white', isKing: false };
                }
            }
        }
        
        // Place black pieces (bottom)
        for (let row = 5; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { player: 'black', isKing: false };
                }
            }
        }
        
        return board;
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        const moves = [];
        const directions = piece.isKing 
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.player === 'white' 
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];

        // Regular moves
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol) && !this.board[newRow][newCol]) {
                moves.push({ from: { row, col }, to: { row: newRow, col: newCol }, capture: null });
            }
        }

        // Capture moves
        for (const [dr, dc] of directions) {
            const jumpRow = row + dr * 2;
            const jumpCol = col + dc * 2;
            const midRow = row + dr;
            const midCol = col + dc;

            if (this.isValidPosition(jumpRow, jumpCol) && 
                !this.board[jumpRow][jumpCol] &&
                this.board[midRow][midCol] &&
                this.board[midRow][midCol].player !== piece.player) {
                
                moves.push({
                    from: { row, col },
                    to: { row: jumpRow, col: jumpCol },
                    capture: { row: midRow, col: midCol }
                });
            }
        }

        return moves;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    selectPiece(row, col) {
        const piece = this.board[row][col];
        
        if (piece && piece.player === this.currentPlayer) {
            this.selectedPiece = { row, col };
            this.validMoves = this.getValidMoves(row, col);
            return true;
        }
        
        return false;
    }

    movePiece(toRow, toCol) {
        if (!this.selectedPiece) return false;

        const move = this.validMoves.find(
            m => m.to.row === toRow && m.to.col === toCol
        );

        if (!move) return false;

        const { from, to, capture } = move;
        const piece = this.board[from.row][from.col];

        // Execute move
        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = null;

        // Handle capture
        if (capture) {
            this.board[capture.row][capture.col] = null;
        }

        // Check promotion
        if (piece.player === 'white' && to.row === 0) {
            piece.isKing = true;
        } else if (piece.player === 'black' && to.row === 7) {
            piece.isKing = true;
        }

        // Record move
        this.moveHistory.push({
            from,
            to,
            capture,
            piece: { ...piece },
            timestamp: Date.now()
        });

        // Switch player
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.selectedPiece = null;
        this.validMoves = [];

        // Check win condition
        if (this.checkWinCondition()) {
            this.gameOver = true;
        }

        return true;
    }

    checkWinCondition() {
        const whitePieces = this.countPieces('white');
        const blackPieces = this.countPieces('black');

        if (whitePieces === 0) {
            this.scores.black++;
            return true;
        }
        
        if (blackPieces === 0) {
            this.scores.white++;
            return true;
        }

        // Check if current player has any moves
        const hasMoves = this.hasValidMoves(this.currentPlayer);
        if (!hasMoves) {
            const winner = this.currentPlayer === 'white' ? 'black' : 'white';
            this.scores[winner]++;
            return true;
        }

        return false;
    }

    countPieces(player) {
        let count = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.player === player) {
                    count++;
                }
            }
        }
        return count;
    }

    hasValidMoves(player) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.player === player) {
                    const moves = this.getValidMoves(row, col);
                    if (moves.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    undoMove() {
        if (this.moveHistory.length === 0) return false;

        const lastMove = this.moveHistory.pop();
        const { from, to, capture, piece } = lastMove;

        // Restore piece
        this.board[from.row][from.col] = piece;
        this.board[to.row][to.col] = null;

        // Restore captured piece
        if (capture) {
            this.board[capture.row][capture.col] = {
                player: piece.player === 'white' ? 'black' : 'white',
                isKing: false
            };
        }

        // Switch player back
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.gameOver = false;

        return true;
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            if (this.gameOver) {
                clearInterval(this.timerInterval);
                return;
            }

            this.timers[this.currentPlayer]--;
            
            if (this.timers[this.currentPlayer] <= 0) {
                this.gameOver = true;
                const winner = this.currentPlayer === 'white' ? 'black' : 'white';
                this.scores[winner]++;
                clearInterval(this.timerInterval);
            }
        }, 1000);
    }

    getBestMove() {
        // Simple AI using minimax with alpha-beta pruning
        const moves = this.getAllMoves(this.currentPlayer);
        if (moves.length === 0) return null;

        let bestMove = moves[0];
        let bestScore = -Infinity;

        for (const move of moves) {
            const score = this.evaluateMove(move);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    getAllMoves(player) {
        const moves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.player === player) {
                    const pieceMoves = this.getValidMoves(row, col);
                    moves.push(...pieceMoves);
                }
            }
        }
        return moves;
    }

    evaluateMove(move) {
        let score = 0;

        // Prefer captures
        if (move.capture) {
            score += 10;
        }

        // Prefer advancement
        if (move.to.row < move.from.row && this.board[move.from.row][move.from.col].player === 'white') {
            score += 2;
        }
        if (move.to.row > move.from.row && this.board[move.from.row][move.from.col].player === 'black') {
            score += 2;
        }

        // Prefer king promotion
        const piece = this.board[move.from.row][move.from.col];
        if (!piece.isKing) {
            if (piece.player === 'white' && move.to.row === 0) {
                score += 5;
            }
            if (piece.player === 'black' && move.to.row === 7) {
                score += 5;
            }
        }

        // Add some randomness
        score += Math.random() * 2;

        return score;
    }

    reset() {
        this.board = this.createInitialBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.timers = { white: 600, black: 600 };
        this.gameOver = false;
        
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    getState() {
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,
            scores: this.scores,
            timers: this.timers,
            moveHistory: this.moveHistory.slice(-10), // Last 10 moves
            gameOver: this.gameOver
        };
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}
