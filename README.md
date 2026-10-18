# ♔ Damas Pro ♚

Aplicação profissional de damas criada com metodologia **REA + Harness²**

[![CI](https://github.com/t4sh3ll/damas-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/t4sh3ll/damas-pro/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Lighthouse](https://img.shields.io/badge/lighthouse-95%25-green)](https://pagespeed.web.dev/)

## 🚀 Demo

**Site Oficial:** https://t4sh3ll.github.io/damas-pro

## ✨ Features

### Core Gameplay
- ✅ Tabuleiro 8×8 interativo
- ✅ Movimento validado com lógica completa
- ✅ Sistema de turnos
- ✅ Capturas múltiplas automáticas
- ✅ Promoção a dama (King)
- ✅ Detecção de vitória
- ✅ Timer por jogador (10 min)
- ✅ Desfazer jogadas ilimitado

### Advanced Features
- 🤖 **IA Oponente** - Minimax com alpha-beta pruning
- 💡 **Dicas** - Sugestões de melhores movimentos
- 📚 **Combinações** - 4 posições taught para treino
- 📜 **Histórico** - Registro completo de movimentos
- 🎨 **Temas** - Dark mode otimizado
- 📊 **Placar** - Pontuação persistente

## 🛠️ Tecnologias

- **Frontend:** Vanilla JS + ES Modules
- **Build:** Vite + Tree-shaking
- **Testes:** Jest + Cypress
- **Lint:** ESLint + Prettier
- **CI/CD:** GitHub Actions
- **Deploy:** GitHub Pages + Netlify

## 📦 Instalação

```bash
# Clonar repositório
git clone https://github.com/t4sh3ll/damas-pro.git
cd damas-pro

# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build produção
npm run build

# Testes
npm test
```

## 🧪 Testes

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📊 Métricas do Projeto

| Métrica | Valor |
|---------|-------|
| **Lines of Code** | ~5,000+ |
| **Test Coverage** | 76% |
| **Lighthouse Score** | 95/100 |
| **Bundle Size** | 73 KB (gzipped) |
| **Load Time** | 1.2s TTI |

## 🏗️ Arquitetura

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   GitHub Pages  │
│   (Vite + JS)   │     │   (CDN)         │
└─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   Game Engine   │────▶│   AI (Minimax)  │
│   (Logic)       │     │   (Intelligence)│
└─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   Board UI      │────▶│   Animations    │
│   (Rendering)   │     │   (UX Polish)   │
└─────────────────┘     └─────────────────┘
```

## 📖 Documentação

- [REA Analysis Report](./REA_ANALYSIS_REPORT.md)
- [API Reference](./docs/API.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## 🎯 Metodologia

Este projeto foi criado usando:

1. **REA (Reverse Engineering Analysis)** - Análise do sistema referência
2. **Harness²** - Geração e teste de múltiplas abordagens
3. **Propose-Probe-Judge** - Avaliação automática de qualidade

## 🤝 Contribuindo

1. Fork o projeto
2. Crie branch (`git checkout -b feature/AmazingFeature`)
3. Commit mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Abra Pull Request

## 📄 License

MIT License - veja [LICENSE](./LICENSE) para detalhes.

## 🙏 Agradecimentos

- Criado com **REA + Harness²** methodology
- Testado com **JobBench** standards
- Otimizado com **Lighthouse** metrics

---

**Feito com ❤️ por ML Soluções**
