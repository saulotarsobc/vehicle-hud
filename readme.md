# 🏍️ Transformador de Dados em Vídeo

Gera visualizações animadas em vídeo a partir de dados de sensores simulando o movimento de um veículo (como uma moto). Ideal para HUDs, simulações, visualizações educacionais ou dashboards animados.

---

## 🫳 Help

- [SVG Repo](https://www.svgrepo.com/)

## 📈 Exemplo de Dados

```plaintext
arrow_rigth  arrow_left  angle_y  angle_x  temperature
True         False       0.00     5.00      30
True         False       1.00     4.99      31
True         False       1.99     4.96      32
True         False       2.96     4.90      34
True         False       3.89     4.82      36
```

````

---

## 🎥 Saída em Vídeo

<div align="center">
  <img src="demo/demo.gif" width="100%" alt="Demo animada do HUD" />
</div>

---

## 🚀 Funcionalidades

- Visualização vetorial com SVG
- Rotação da moto com base em `angle_y`
- Setas (esquerda/direita) animadas
- Barra de temperatura dinâmica
- Conversão dos quadros em vídeo com `FFmpeg`
- Compatível com dados simulados ou reais

---

## 🛠️ Como usar

### 1. Instale as dependências

```bash
npm install
```

### 2. Gere os frames e o vídeo

```bash
npm run start
```

Ou direto com `tsx`:

```bash
npx tsx src/index.ts
```

### 3. Verifique os resultados

- Frames PNG: `./temp/frames`
- Vídeo final: `./temp/output.mp4`

---

## 🧰 Tecnologias usadas

- [TypeScript](https://www.typescriptlang.org/)
- [Sharp](https://sharp.pixelplumbing.com/) — conversão SVG → PNG
- [FFmpeg](https://ffmpeg.org/) — geração de vídeo
- SVG customizado com lógica interativa

---

## 📂 Estrutura

```bash
├── svg/
│   └── hud.svg        # Arquivo SVG base da moto e HUD
├── temp/
│   └── frames/        # Frames individuais gerados
│   └── output.mp4     # Vídeo final gerado
├── src/
│   └── index.ts       # Script principal
├── interface.ts       # Tipagem dos dados
├── README.md
```

---

## 🧪 Futuras melhorias

- Visualização em tempo real com Canvas/WebGL
- Leitura de dados via WebSocket
- Suporte a múltiplos veículos
- Overlay de velocidade, acelerômetro, HUD 3D

---

## 🧠 Desenvolvido por

[Hcode Consultoria e Treinamentos](https://hcode.com.br)
🐘 Mascote oficial: Hedgehog Laranja `#FF760C` e Cinza `#79756C`
````
