# 🏍️ Transformador de Dados em Vídeo

Gera visualizações animadas em vídeo a partir de dados de sensores simulando o movimento de um veículo (como uma moto). Ideal para HUDs, simulações, visualizações educacionais ou dashboards animados.

---

## 🫳 Help

- [SVG Repo](https://www.svgrepo.com/)

---

## 📈 Exemplo de Dados

<div align="center">
<table>
  <thead>
    <tr>
      <th>arrow_rigth</th>
      <th>arrow_left</th>
      <th>angle_y</th>
      <th>angle_x</th>
      <th>temperature</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>true</td>
      <td>false</td>
      <td>0.00</td>
      <td>5.00</td>
      <td>30</td>
    </tr>
    <tr>
      <td>true</td>
      <td>false</td>
      <td>1.00</td>
      <td>4.99</td>
      <td>31</td>
    </tr>
    <tr>
      <td>true</td>
      <td>false</td>
      <td>1.99</td>
      <td>4.96</td>
      <td>32</td>
    </tr>
    <tr>
      <td>true</td>
      <td>false</td>
      <td>2.96</td>
      <td>4.90</td>
      <td>34</td>
    </tr>
    <tr>
      <td>true</td>
      <td>false</td>
      <td>3.89</td>
      <td>4.82</td>
      <td>36</td>
    </tr>
     <tr>
      <td colspan="5" style="text-align: center;">...</td>
    </tr>
  </tbody>
</table>
</div>

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
