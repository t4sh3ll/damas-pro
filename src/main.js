// Damas Pro - Main Application
// Integration point for REA + Harness² created components

import GameEngine from './game/Engine.js';
import BoardComponent from './components/Board.js';

class DamasPro {
    constructor() {
        this.engine = new GameEngine();
        this.board = new BoardComponent(this.engine, 'board');
        this.isAIEnabled = false;
        this.aiDifficulty = 'medium';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.engine.startTimer();
        this.board.render();
        this.board.updateUI();
        
        console.log('🎮 Damas Pro initialized');
        console.log('📊 Created with REA + Harness² methodology');
    }

    setupEventListeners() {
        // Settings
        document.querySelector('[data-action="settings"]')?.addEventListener('click', () => {
            this.toggleSettings();
        });

        // Help
        document.querySelector('[data-action="help"]')?.addEventListener('click', () => {
            this.showHelp();
        });

        // New game
        document.querySelector('[data-action="new-game"]')?.addEventListener('click', () => {
            this.newGame();
        });

        // AI toggle
        this.setupAIToggle();
    }

    setupAIToggle() {
        const aiToggle = document.getElementById('aiToggle');
        if (aiToggle) {
            aiToggle.addEventListener('change', (e) => {
                this.isAIEnabled = e.target.checked;
                if (this.isAIEnabled) {
                    this.enableAI();
                } else {
                    this.disableAI();
                }
            });
        }
    }

    enableAI() {
        console.log('🤖 AI enabled');
        // Add AI observer
        this.aiObserver = setInterval(() => {
            if (!this.engine.gameOver && this.engine.currentPlayer === 'black') {
                this.makeAIMove();
            }
        }, 1000);
    }

    disableAI() {
        console.log('🤖 AI disabled');
        if (this.aiObserver) {
            clearInterval(this.aiObserver);
            this.aiObserver = null;
        }
    }

    makeAIMove() {
        const bestMove = this.engine.getBestMove();
        if (bestMove) {
            setTimeout(() => {
                this.engine.movePiece(bestMove.to.row, bestMove.to.col);
                this.board.render();
                this.board.updateUI();
                
                if (this.engine.gameOver) {
                    this.board.showGameOver();
                }
            }, 500);
        }
    }

    newGame() {
        this.engine.reset();
        this.board.render();
        this.board.updateUI();
        this.engine.startTimer();
        console.log('🎮 New game started');
    }

    toggleSettings() {
        const settings = document.getElementById('settingsModal');
        if (settings) {
            settings.classList.toggle('modal--hidden');
        }
    }

    showHelp() {
        alert(`
🎮 COMO JOGAR DAMAS:

1. CLIQUE em uma peça sua para selecionar
2. CASELAS DESTACADAS mostram movimentos válidos
3. CLIQUE no destino para mover
4. CAPTURE peças adversárias pulando sobre elas
5. Atinga o final do tabuleiro para virar DAMA (♚)
6. VENCE quem capturar todas as peças ou bloquear adversário

DICA: Use o botão "Dica" para ver o melhor movimento!
        `);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.damasPro = new DamasPro();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DamasPro;
}
