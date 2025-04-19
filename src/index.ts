import { createCanvas } from "canvas";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { Statistic } from "./interface";

// CONFIGURAÇÕES
const FRAME_DIR = "./temp/frames";
const OUTPUT_VIDEO = "./temp/output.mp4";
const WIDTH = 400;
const HEIGHT = 400;

// FUNÇÃO PRINCIPAL
async function main() {
  createTempDir(FRAME_DIR);

  data.forEach((stat, index) => {
    drawVehicle(stat, index);
  });

  generateVideoFromFrames();
}

// GERA DIRETÓRIO
function createTempDir(name: string) {
  mkdirSync(name, { recursive: true });
}

// DESENHA UM FRAME
function drawVehicle(stat: Statistic, index: number) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.rotate((stat.angle_y * Math.PI) / 180);
  ctx.fillStyle = "#FF760C";
  ctx.fillRect(-50, -25, 100, 50); // corpo do carro
  ctx.restore();

  // seta esquerda
  if (stat.arrow_left) {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(80, 190);
    ctx.lineTo(80, 210);
    ctx.closePath();
    ctx.fill();
  }

  // seta direita
  if (stat.arrow_rigth) {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(300, 200);
    ctx.lineTo(320, 190);
    ctx.lineTo(320, 210);
    ctx.closePath();
    ctx.fill();
  }

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
    const command = `ffmpeg -y -framerate 2 -i ${FRAME_DIR}/frame_%03d.png -c:v libx264 -r 30 -pix_fmt yuv420p ${OUTPUT_VIDEO}`;
    console.log("🎥 Gerando vídeo...");
    execSync(command, { stdio: "inherit" });
    console.log(`✅ Vídeo gerado com sucesso: ${OUTPUT_VIDEO}`);
  } catch (error) {
    console.error("Erro ao gerar o vídeo:", error);
  }
}

// MOCK DE DADOS
const data: Statistic[] = Array.from({ length: 120 }, (_, i) => {
  const angle_y = Math.sin(i / 10) * 10; // simula curva suave
  const angle_x = Math.cos(i / 15) * 5; // simula inclinação leve

  return {
    arrow_rigth: i % 40 < 10, // seta direita ligada de 0-9, 40-49, etc.
    arrow_left: i % 40 >= 20 && i % 40 < 30, // seta esquerda ligada de 20-29, 60-69, etc.
    angle_y: parseFloat(angle_y.toFixed(2)),
    angle_x: parseFloat(angle_x.toFixed(2)),
  };
});

// START
main();
