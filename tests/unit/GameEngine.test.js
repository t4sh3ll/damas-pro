// Testes unitários para GameEngine
import GameEngine from '../src/game/Engine.js';

describe('GameEngine', () => {
    let engine;

    beforeEach(() => {
        engine = new GameEngine();
    });

    test('deve criar tabuleiro inicial correto', () => {
        const whitePieces = engine.countPieces('white');
        const blackPieces = engine.countPieces('black');
        
        expect(whitePieces).toBe(12);
        expect(blackPieces).toBe(12);
    });

    test('deve alternar entre jogadores', () => {
        expect(engine.currentPlayer).toBe('white');
        
        engine.movePiece(3, 3); // Move white piece
        expect(engine.currentPlayer).toBe('black');
        
        engine.movePiece(4, 3); // Move black piece
        expect(engine.currentPlayer).toBe('white');
    });

    test('deve detectar promoção a dama', () => {
        // Position white piece ready to promote
        engine.board[1][3] = { player: 'white', isKing: false };
        engine.currentPlayer = 'white';
        
        // Move to promotion row
        engine.movePiece(0, 3);
        
        expect(engine.board[0][3].isKing).toBe(true);
    });

    test('deve validar movimentos de captura', () => {
        // Set up capture position
        engine.board[2][3] = { player: 'white', isKing: false };
        engine.board[3][2] = { player: 'black', isKing: false };
        engine.board[4][1] = null;
        
        const moves = engine.getValidMoves(2, 3);
        const captureMove = moves.find(m => m.capture);
        
        expect(captureMove).toBeDefined();
    });

    test('deve detectar condição de vitória', () => {
        // Remove all black pieces except one
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (engine.board[row][col] && engine.board[row][col].player === 'black') {
                    engine.board[row][col] = null;
                }
            }
        }
        engine.board[7][1] = { player: 'black', isKing: false };
        
        engine.checkWinCondition();
        
        expect(engine.gameOver).toBe(true);
    });

    test('deve desfazer movimentos', () => {
        engine.selectPiece(2, 3);
        engine.movePiece(3, 4);
        
        const beforeUndo = engine.moveHistory.length;
        engine.undoMove();
        const afterUndo = engine.moveHistory.length;
        
        expect(afterUndo).toBe(beforeUndo - 1);
    });

    test('deve calcular melhor movimento para IA', () => {
        const bestMove = engine.getBestMove();
        
        expect(bestMove).not.toBeNull();
        expect(bestMove).toHaveProperty('from');
        expect(bestMove).toHaveProperty('to');
    });
});
