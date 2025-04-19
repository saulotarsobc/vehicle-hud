import { execSync } from "child_process";
import { existsSync, mkdirSync, rmSync } from "fs";
import { Statistic } from "./interface";
import { drawSVGFrame } from "./utils";

// CONFIGURAÇÕES
const FRAME_DIR = "./temp/frames";
const OUTPUT_VIDEO = "./temp/output.mp4";
const WIDTH = 1280;
const HEIGHT = 720;
const FRAMERATE = 30;
const CLIP_LENGTH = 500;

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
  await Promise.all(
    data.map((stat, index) => drawSVGFrame(stat, index, FRAME_DIR))
  );

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

// DESENHA UM FRAME

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
