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

  return svg;
}
