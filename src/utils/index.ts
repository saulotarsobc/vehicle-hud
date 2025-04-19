import { readFileSync, writeFileSync } from "fs";
import { Statistic } from "../interface";
import path = require("path");
import sharp = require("sharp");

export async function drawSVGFrame(
  stat: Statistic,
  index: number,
  FRAME_DIR: string
) {
  const svg = generateSVG(stat);
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  writeFileSync(
    path.join(FRAME_DIR, `frame_${String(index).padStart(3, "0")}.png`),
    buffer
  );
}

function generateSVG(stat: Statistic): string {
  let svg = readFileSync("svg/hud.svg", "utf-8");

  // Atualiza o transform da tag <g id="moto" ...>
  // <g id="moto" transform="rotate(-30 630 630)">
  // <g id="moto" transform="rotate(30 630 630)">
  const rotateDeg = stat.angle_y.toFixed(2);
  svg = svg.replace(
    '<g id="moto">',
    `<g id="moto" transform="rotate(${rotateDeg} 630 630)">`
  );

  // Atualiza a cor do right_mirror com base no estado da seta
  svg = svg.replace(
    /(<path[^>]*id="right_arrow"[^>]*fill=")(#[0-9A-Fa-f]{6})(")/,
    `$1${stat.arrow_rigth ? "#F7CF52" : "#E6E6E6"}$3`
  );

  // Atualiza a cor do right_mirror com base no estado da seta
  svg = svg.replace(
    /(<path[^>]*id="left_arrow"[^>]*fill=")(#[0-9A-Fa-f]{6})(")/,
    `$1${stat.arrow_left ? "#F7CF52" : "#E6E6E6"}$3`
  );

  // Atualiza o fill do nível de temperatura
  svg = svg.replace(
    /(<path[^>]*id="level_bar"[^>]*fill=")(#[0-9A-Fa-f]{6})(")/,
    `$1${getTemperatureColor(stat.temperature)}$3`
  );

  svg = svg.replace(
    /(<ellipse[^>]*id="level_ball"[^>]*fill=")(#[0-9A-Fa-f]{6})(")/,
    `$1${getTemperatureColor(stat.temperature)}$3`
  );

  const newPath = generateLevelBarPath(stat.temperature);
  svg = svg.replace(
    /<path[^>]*id="level_bar"[^>]*d="[^"]*"[^>]*>/,
    `<path id="level_bar" d="${newPath}" fill="${getTemperatureColor(
      stat.temperature
    )}"/>`
  );

  return svg;
}

function getTemperatureColor(temp: number): string {
  if (temp < 40) return "#4FC3F7"; // Azul claro
  if (temp < 70) return "#FFD54F"; // Amarelo
  if (temp < 90) return "#FF8A65"; // Laranja
  return "#F44336"; // Vermelho intenso
}

function generateLevelBarPath(temp: number): string {
  const left = 368.463 - 5;
  const right = 368.463 + 9;
  const bottom = 618.62;
  const top = 618.62 - (Math.max(0, Math.min(100, temp)) / 100) * 157;

  return `
    M${left} ${top}
    C${left} ${top - 2.76} ${left + 2.24} ${top - 5} ${368.463} ${top - 5}
    H${right}
    C${right + 2.76} ${top - 5} ${right + 5} ${top - 2.76} ${right + 5} ${top}
    V${bottom}
    C${right + 5} ${bottom + 2.76} ${right + 2.76} ${bottom + 5} ${right} ${
    bottom + 5
  }
    H${left}
    C${left - 2.76} ${bottom + 5} ${left - 5} ${bottom + 2.76} ${
    left - 5
  } ${bottom}
    Z
  `.trim();
}
