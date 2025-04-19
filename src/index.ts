import { createCanvas } from "canvas";
import { execSync } from "child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { Statistic } from "./interface";

// CONFIGURAÇÕES
const FRAME_DIR = "./temp/frames";
const OUTPUT_VIDEO = "./temp/output.mp4";
const WIDTH = 400;
const HEIGHT = 400;
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
  data.forEach((stat, index) => drawVehicle(stat, index));
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

// DESENHA UM FRAME
function drawVehicle(stat: Statistic, index: number) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // fundo branco
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();

  // posiciona e rotaciona conforme ângulo
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.rotate((stat.angle_y * Math.PI) / 180);

  // corpo da moto (mais comprido e estreito)
  ctx.fillStyle = "#FF760C";
  ctx.fillRect(-60, -15, 120, 30);

  // rodas
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.arc(-50, 20, 10, 0, Math.PI * 2); // roda traseira
  ctx.fill();

  ctx.beginPath();
  ctx.arc(50, 20, 10, 0, Math.PI * 2); // roda dianteira
  ctx.fill();

  // guidão
  ctx.strokeStyle = "#79756C";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(45, -15);
  ctx.lineTo(65, -25);
  ctx.moveTo(45, -15);
  ctx.lineTo(65, -5);
  ctx.stroke();

  ctx.restore();

  // seta esquerda (fixa no canto esquerdo)
  if (stat.arrow_rigth) {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(60, HEIGHT / 2);
    ctx.lineTo(40, HEIGHT / 2 - 10);
    ctx.lineTo(40, HEIGHT / 2 + 10);
    ctx.closePath();
    ctx.fill();
  }

  // seta direita (fixa no canto direito)
  if (stat.arrow_left) {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(WIDTH - 60, HEIGHT / 2);
    ctx.lineTo(WIDTH - 40, HEIGHT / 2 - 10);
    ctx.lineTo(WIDTH - 40, HEIGHT / 2 + 10);
    ctx.closePath();
    ctx.fill();
  }

  // exporta imagem
  const buffer = canvas.toBuffer("image/png");
  writeFileSync(
    `${FRAME_DIR}/frame_${String(index).padStart(3, "0")}.png`,
    buffer
  );
}

// GERA O VÍDEO
function generateVideoFromFrames() {
  if (!existsSync(FRAME_DIR)) {
    console.error(`Diretório ${FRAME_DIR} não encontrado.`);
    return;
  }

  try {
    const command = `ffmpeg -y -framerate ${FRAMERATE} -i ${FRAME_DIR}/frame_%03d.png -c:v libx264 -r 30 -pix_fmt yuv420p ${OUTPUT_VIDEO}`;
    console.log("🎥 Gerando vídeo...");
    execSync(command, { stdio: "inherit" });
    console.log(`✅ Vídeo gerado com sucesso: ${OUTPUT_VIDEO}`);
  } catch (error) {
    console.error("Erro ao gerar o vídeo:", error);
  }
}

// START
main();
