// Banco de Combinações de Damas
// Baseado em padrões extraídos da academia virtual

const COMBINATIONS = {
    // Combinação 1: Ataque Duplo Clássico
    "double-capture-classic": {
        name: "Ataque Duplo Clássico",
        description: "Capture duas peças adversárias em sequência",
        fen: "0/0/0/0/0b0B0B0/0B0b0B0/0/0",
        moves: ["g5-f4", "d8-c7", "f4-e5", "c7-d6", "e5-f6"],
        explanation: "Branco inicia com g5-f4, preto responde d8-c7, branco continua f4-e5 capturando...",
        difficulty: "easy",
        tags: ["ataque", "duplo", "captura"]
    },

    // Combinação 2: Sacrifício Estratégico
    "sacrifice-strategic": {
        name: "Sacrifício Estratégico",
        description: "Sacrifique uma peça para abrir linha de ataque",
        fen: "0/0/0/0b0/0B0/0b0B/0/0",
        moves: ["a7-b6", "c5-d4", "b6-c5", "d4-e3", "c5-d4"],
        explanation: "Branco sacrifica peça em b6 para desviar defesa adversária...",
        difficulty: "medium",
        tags: ["sacrifício", "estratégia", "abertura"]
    },

    // Combinação 3: Promoção com Captura
    "promotion-capture": {
        name: "Promoção com Captura",
        description: "Chegue à coronha enquanto captura peças",
        fen: "0/0/0/0/0B0/0b0/0B0/0",
        moves: ["c3-d4", "d6-c5", "d4-e5", "c5-b4", "e5-f6"],
        explanation: "Peça branca avança promovendo enquanto captura peça adversária...",
        difficulty: "medium",
        tags: ["promoção", "avanço", "coronha"]
    },

    // Combinação 4: Travamento (Stalemate)
    "stalemate-trap": {
        name: "Armadilha de Travamento",
        description: "Bloqueie todas as peças adversárias",
        fen: "0b0/0B0/0b0/0B0/0b0/0/0/0",
        moves: ["a5-b4", "c7-d6", "b4-c5", "d6-e5", "c5-d6"],
        explanation: "Posicione peças para impedir movimento adversário...",
        difficulty: "hard",
        tags: ["travamento", "bloqueio", "estratégia"]
    },

    // Combinação 5: Ataque em Zigue-Zague
    "zigzag-attack": {
        name: "Ataque em Zigue-Zague",
        description: "Capturas alternadas em diagonal",
        fen: "0/0/0/0B0/0b0/0B0/0/0",
        moves: ["e3-d4", "d6-c5", "d4-e5", "c5-b4", "e5-f6"],
        explanation: "Movimento em zigue-zague captura múltiplas peças...",
        difficulty: "medium",
        tags: ["ataque", "diagonal", "zigue-zague"]
    },

    // Combinação 6: Duplo Ataque
    "double-attack": {
        name: "Duplo Ataque",
        description: "Ameace duas peças simultaneamente",
        fen: "0/0/0/0/0B0/0b0/0b0/0",
        moves: ["c3-d4", "e5-d6", "d4-e5", "d6-c5", "e5-f6"],
        explanation: "Peça atacante ameaça duas direções ao mesmo tempo...",
        difficulty: "medium",
        tags: ["ataque", "duplo", "ameaça"]
    },

    // Combinação 7: Passagem Obligatoria
    "forced-passage": {
        name: "Passagem Obligatoria",
        description: "Forçe passagem através de linha defensiva",
        fen: "0/0/0B0/0b0/0B0/0/0",
        moves: ["e3-d4", "c7-d6", "d4-e5", "d6-e5", "e5-f6"],
        explanation: "Peça avança forçando passagem entre peças adversárias...",
        difficulty: "hard",
        tags: ["passagem", "forçado", "avanço"]
    },

    // Combinação 8: Ganho de Tempo
    "tempo-gain": {
        name: "Ganho de Tempo",
        description: "Use movimentos de pausa para ganhar vantagem",
        fen: "0/0/0/0b0/0B0/0b0/0/0",
        moves: ["a7-b6", "c5-d4", "b6-a5", "d4-c3", "a5-b4"],
        explanation: "Movimentos laterais ganham tempo enquanto posicionam...",
        difficulty: "medium",
        tags: ["tempo", "posicionamento", "estratégia"]
    },

    // Combinação 9: Armadilha Clássica
    "classic-trap": {
        name: "Armadilha Clássica",
        description: "Armadilha clássica para capturar peça importante",
        fen: "0/0/0/0B0/0b0/0b0/0",
        moves: ["e3-f4", "d6-e5", "f4-g5", "e5-d4", "g5-h6"],
        explanation: "Posicione peça para encurralar adversário...",
        difficulty: "hard",
        tags: ["armadilha", "encurralar", "tática"]
    },

    // Combinação 10: Final de Jogo
    "endgame-basic": {
        name: "Final Básico",
        description: "Final simples de dama contra peça",
        fen: "0/0/0/0/0B0/0/0b0/0",
        moves: ["d4-c5", "c7-b6", "c5-b6"],
        explanation: "Dama branca captura peça preta isolada...",
        difficulty: "easy",
        tags: ["final", "dama", "captura"]
    }
};

// Converter FEN simplificado para array 8x8
function fenToBoard(fen) {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    const rows = fen.split('/');
    
    for (let row = 0; row < 8; row++) {
        let col = 0;
        for (const char of rows[row]) {
            if (/\d/.test(char)) {
                col += parseInt(char);
            } else if (char === 'b') {
                board[row][col] = { player: 'black', isKing: false };
                col++;
            } else if (char === 'B') {
                board[row][col] = { player: 'white', isKing: false };
                col++;
            } else if (char === 'k') {
                board[row][col] = { player: 'black', isKing: true };
                col++;
            } else if (char === 'K') {
                board[row][col] = { player: 'white', isKing: true };
                col++;
            }
        }
    }
    return board;
}

export { COMBINATIONS, fenToBoard };
