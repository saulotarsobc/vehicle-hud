import { execSync } from "child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { Statistic } from "./interface";
import path = require("path");
import sharp = require("sharp");

// CONFIGURAÇÕES
const FRAME_DIR = "./temp/frames";
const OUTPUT_VIDEO = "./temp/output.mp4";
const WIDTH = 640;
const HEIGHT = 360;
const FRAMERATE = 10;
const CLIP_LENGTH = 300;

// MOCK DE DADOS
const data: Statistic[] = Array.from({ length: CLIP_LENGTH }, (_, i) => {
  const angle_y = Math.sin(i / 10) * 10; // simula curva suave
  const angle_x = Math.cos(i / 15) * 5; // simula inclinação leve

  return {
    arrow_rigth: i % 40 < 10, // seta direita ligada de 0-9, 40-49, etc.
    arrow_left: i % 40 >= 20 && i % 40 < 30, // seta esquerda ligada de 20-29, 60-69, etc.
    angle_y: parseFloat(angle_y.toFixed(2)),
    angle_x: parseFloat(angle_x.toFixed(2)),
  };
});

// FUNÇÃO PRINCIPAL
async function main() {
  clearDir(FRAME_DIR);
  createDir(FRAME_DIR);

  // Aguarda todos os frames serem gerados
  await Promise.all(data.map((stat, index) => drawSVGFrame(stat, index)));

  // Só então gera o vídeo
  generateVideoFromFrames();
}

// LIMPAR DIRETÓRIO
function clearDir(name: string) {
  if (existsSync(name)) {
    rmSync(name, { recursive: true, force: true });
  }
}

// GERA DIRETÓRIO
function createDir(name: string) {
  mkdirSync(name, { recursive: true });
}

async function drawSVGFrame(stat: Statistic, index: number) {
  const svg = generateSVG(stat);
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(
    path.join(FRAME_DIR, `frame_${String(index).padStart(3, "0")}.png`),
    buffer
  );
}

// DESENHA UM FRAME
function generateSVG(stat: Statistic): string {
  const rotateDeg = stat.angle_y.toFixed(2);
  const arrowLeft = stat.arrow_left
    ? `<polygon points="20,50 10,45 10,55" fill="blue" />`
    : "";
  const arrowRight = stat.arrow_rigth
    ? `<polygon points="180,50 190,45 190,55" fill="green" />`
    : "";

  return `
    <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      ${arrowLeft}
      ${arrowRight}
      <g transform="translate(100,50) rotate(${rotateDeg})">
        <!-- corpo da moto -->
        <rect x="-30" y="-10" width="60" height="20" fill="#FF760C" rx="5" />
        <!-- rodas -->
        <circle cx="-25" cy="12" r="6" fill="#333"/>
        <circle cx="25" cy="12" r="6" fill="#333"/>
        <!-- guidão -->
        <line x1="20" y1="-10" x2="30" y2="-20" stroke="#79756C" stroke-width="2"/>
        <line x1="20" y1="-10" x2="30" y2="0" stroke="#79756C" stroke-width="2"/>
      </g>
    </svg>
  `;
}

// GERA O VÍDEO
function generateVideoFromFrames() {
  if (!existsSync(FRAME_DIR)) {
    console.error(`Diretório ${FRAME_DIR} não encontrado.`);
    return;
  }

  try {
    const command = `ffmpeg -y -framerate ${FRAMERATE} -i ${FRAME_DIR}/frame_%03d.png -vf scale=${WIDTH}:${HEIGHT} -c:v libx264 -r 30 -pix_fmt yuv420p ${OUTPUT_VIDEO}`;

    console.log("🎥 Gerando vídeo...");
    execSync(command, { stdio: "inherit" });
    console.log(`✅ Vídeo gerado com sucesso: ${OUTPUT_VIDEO}`);
  } catch (error) {
    console.error("Erro ao gerar o vídeo:", error);
  }
}

// START
main();
