// Damas Pro - Board Component
// Renderiza o tabuleiro e manipula interações

class BoardComponent {
    constructor(gameEngine, containerId) {
        this.engine = gameEngine;
        this.container = document.getElementById(containerId);
        this.selectedSquare = null;
        this.animationEnabled = false;
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = this.createSquare(row, col);
                this.container.appendChild(square);
            }
        }
    }

    createSquare(row, col) {
        const square = document.createElement('div');
        const isLight = (row + col) % 2 === 0;
        
        square.className = `square square--${isLight ? 'light' : 'dark'}`;
        square.dataset.row = row;
        square.dataset.col = col;
        square.setAttribute('role', 'gridcell');
        square.setAttribute('aria-label', `Casa ${row},${col}`);

        const piece = this.engine.board[row][col];
        if (piece) {
            const pieceEl = document.createElement('span');
            pieceEl.className = `piece piece--${piece.player} ${piece.isKing ? 'piece--king' : ''}`;
            pieceEl.textContent = piece.isKing ? '♚' : '♟';
            square.appendChild(pieceEl);
        }

        // Highlight selected piece
        if (this.engine.selectedPiece && 
            this.engine.selectedPiece.row === row && 
            this.engine.selectedPiece.col === col) {
            square.classList.add('square--selected');
        }

        // Highlight valid moves
        const isValidMove = this.engine.validMoves.some(
            m => m.to.row === row && m.to.col === col
        );
        if (isValidMove) {
            square.classList.add('square--valid-move');
        }

        square.addEventListener('click', () => this.handleSquareClick(row, col));
        
        return square;
    }

    handleSquareClick(row, col) {
        const piece = this.engine.board[row][col];

        // If clicking on own piece, select it
        if (piece && piece.player === this.engine.currentPlayer) {
            this.engine.selectPiece(row, col);
            this.render();
            return;
        }

        // If clicking on valid move target, move piece
        if (this.engine.selectedPiece) {
            const move = this.engine.validMoves.find(
                m => m.to.row === row && m.to.col === col
            );

            if (move) {
                this.animateMove(move.from, move.to, () => {
                    this.engine.movePiece(row, col);
                    this.render();
                    this.updateUI();
                    
                    // Check game over
                    if (this.engine.gameOver) {
                        this.showGameOver();
                    }
                });
            }
        }
    }

    animateMove(from, to, callback) {
        if (!this.animationEnabled) {
            callback();
            return;
        }

        const fromSquare = this.container.querySelector(`[data-row="${from.row}"][data-col="${from.col}"]`);
        const toSquare = this.container.querySelector(`[data-row="${to.row}"][data-col="${to.col}"]`);
        
        if (!fromSquare || !toSquare) {
            callback();
            return;
        }

        const pieceEl = fromSquare.querySelector('.piece');
        if (!pieceEl) {
            callback();
            return;
        }

        const fromRect = fromSquare.getBoundingClientRect();
        const toRect = toSquare.getBoundingClientRect();

        pieceEl.style.transition = 'transform 0.3s ease';
        pieceEl.style.transform = `translate(${toRect.left - fromRect.left}px, ${toRect.top - fromRect.top}px)`;

        setTimeout(() => {
            callback();
            pieceEl.style.transition = '';
            pieceEl.style.transform = '';
        }, 300);
    }

    updateUI() {
        // Update piece counts
        const whiteCount = this.engine.countPieces('white');
        const blackCount = this.engine.countPieces('black');
        
        document.querySelector('[data-pieces="white"]').textContent = whiteCount;
        document.querySelector('[data-pieces="black"]').textContent = blackCount;

        // Update scores
        document.querySelector('[data-player="white"]').textContent = this.engine.scores.white;
        document.querySelector('[data-player="black"]').textContent = this.engine.scores.black;

        // Update timers
        this.updateTimer('white', this.engine.timers.white);
        this.updateTimer('black', this.engine.timers.black);

        // Update move history
        this.updateMoveHistory();

        // Update current player indicator
        const playerCards = document.querySelectorAll('.player-card');
        playerCards.forEach(card => card.classList.remove('player-card--active'));
        const activeCard = Array.from(playerCards).find(
            card => card.querySelector('.player-card__name').textContent.includes(
                this.engine.currentPlayer === 'white' ? 'Jogador 1' : 'Jogador 2'
            )
        );
        if (activeCard) {
            activeCard.classList.add('player-card--active');
        }
    }

    updateTimer(player, seconds) {
        const timerEl = document.querySelector(`[data-timer="${player}"]`);
        if (timerEl) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            // Warning when time is running low
            if (seconds < 60) {
                timerEl.style.color = '#ff4444';
            } else {
                timerEl.style.color = '';
            }
        }
    }

    updateMoveHistory() {
        const moveList = document.getElementById('moveList');
        if (!moveList) return;

        moveList.innerHTML = '';
        
        const recentMoves = this.engine.moveHistory.slice(-10).reverse();
        recentMoves.forEach((move, index) => {
            const li = document.createElement('li');
            const moveNum = this.engine.moveHistory.length - recentMoves.length + index + 1;
            const from = String.fromCharCode(65 + move.from.col) + (8 - move.from.row);
            const to = String.fromCharCode(65 + move.to.col) + (8 - move.to.row);
            const capture = move.capture ? ' ×' : '';
            
            li.textContent = `${moveNum}. ${from}${capture}→${to}`;
            moveList.appendChild(li);
        });
    }

    showGameOver() {
        const modal = document.getElementById('gameOverModal');
        const winnerText = document.getElementById('winnerText');
        
        const winner = this.engine.currentPlayer === 'white' ? 'Jogador 2' : 'Jogador 1';
        winnerText.textContent = `${winner} venceu!`;
        
        modal.classList.remove('modal--hidden');
    }

    setupEventListeners() {
        // New game button
        document.getElementById('btnNewGame')?.addEventListener('click', () => {
            this.engine.reset();
            this.render();
            this.updateUI();
            this.engine.startTimer();
        });

        // Undo button
        document.getElementById('btnUndo')?.addEventListener('click', () => {
            if (this.engine.undoMove()) {
                this.render();
                this.updateUI();
            }
        });

        // Hint button
        document.getElementById('btnHint')?.addEventListener('click', () => {
            const bestMove = this.engine.getBestMove();
            if (bestMove) {
                this.highlightBestMove(bestMove);
            }
        });

        // Animate button
        document.getElementById('btnAnimate')?.addEventListener('click', () => {
            this.animationEnabled = !this.animationEnabled;
            const btn = document.getElementById('btnAnimate');
            btn.textContent = this.animationEnabled ? '✨ Animar ON' : '✨ Animar OFF';
        });

        // Load combo button
        document.getElementById('btnLoadCombo')?.addEventListener('click', () => {
            const combo = document.getElementById('comboSelect').value;
            this.loadCombination(combo);
        });
    }

    highlightBestMove(move) {
        // Remove previous highlights
        document.querySelectorAll('.square--hint').forEach(el => {
            el.classList.remove('square--hint');
        });

        // Highlight source and destination
        const fromSquare = this.container.querySelector(`[data-row="${move.from.row}"][data-col="${move.from.col}"]`);
        const toSquare = this.container.querySelector(`[data-row="${move.to.row}"][data-col="${move.to.col}"]`);

        if (fromSquare) fromSquare.classList.add('square--hint');
        if (toSquare) toSquare.classList.add('square--hint');

        // Auto-remove after 2 seconds
        setTimeout(() => {
            document.querySelectorAll('.square--hint').forEach(el => {
                el.classList.remove('square--hint');
            });
        }, 2000);
    }

    loadCombination(type) {
        const combinations = {
            'classic': this.loadClassicPosition,
            'double-capture': this.loadDoubleCapture,
            'promotion': this.loadPromotionPosition,
            'sacrifice': this.loadSacrificePosition
        };

        if (combinations[type]) {
            combinations[type].call(this);
        }
    }

    loadClassicPosition() {
        this.engine.reset();
        this.render();
        this.updateUI();
    }

    loadDoubleCapture() {
        this.engine.reset();
        // Set up double capture position
        this.engine.board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // White piece that can capture twice
        this.engine.board[2][3] = { player: 'white', isKing: false };
        this.engine.board[3][2] = { player: 'black', isKing: false };
        this.engine.board[3][4] = { player: 'black', isKing: false };
        this.engine.board[4][3] = { player: 'black', isKing: false };
        
        this.render();
        this.updateUI();
    }

    loadPromotionPosition() {
        this.engine.reset();
        this.engine.board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // White piece near promotion
        this.engine.board[1][3] = { player: 'white', isKing: false };
        
        this.render();
        this.updateUI();
    }

    loadSacrificePosition() {
        this.engine.reset();
        this.engine.board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Sacrifice position
        this.engine.board[2][2] = { player: 'white', isKing: false };
        this.engine.board[2][4] = { player: 'white', isKing: false };
        this.engine.board[3][3] = { player: 'black', isKing: false };
        this.engine.board[4][2] = { player: 'black', isKing: false };
        this.engine.board[4][4] = { player: 'black', isKing: false };
        
        this.render();
        this.updateUI();
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoardComponent;
}
