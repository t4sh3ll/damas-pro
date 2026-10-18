import { defineConfig } from 'vite';

export default defineConfig({
  base: '/damas-pro/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['express', 'sqlite3'],
          game: ['./src/game/Core.js', './src/game/Engine.js'],
          ui: ['./src/components/Board.js', './src/components/Piece.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
