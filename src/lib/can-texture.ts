import { CanvasTexture, SRGBColorSpace } from "three";
import type { Flavor } from "@/data/flavors";

/** Original label artwork. No external product assets or network texture requests. */
export function createCanTexture(flavor: Flavor) {
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#101410";
  ctx.fillRect(0, 0, 1536, 1536);

  const gradient = ctx.createLinearGradient(0, 0, 1536, 0);
  gradient.addColorStop(0, "#080b08");
  gradient.addColorStop(0.35, "#1d231a");
  gradient.addColorStop(0.52, "#151b12");
  gradient.addColorStop(0.8, "#080b08");
  gradient.addColorStop(1, "#181d15");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1536, 1536);

  // Deterministic fibers and print scuffs retain detail under a moving key light.
  let seed = 81;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 6500; i++) {
    ctx.fillStyle = `rgba(225,239,209,${random() * 0.045})`;
    ctx.fillRect(random() * 1536, random() * 1536, 1, 1 + random() * 22);
  }
  ctx.save();
  ctx.translate(768, 660);
  ctx.rotate(-0.12);
  ctx.strokeStyle = flavor.color;
  ctx.globalAlpha = 0.09;
  ctx.lineWidth = 2;
  for (let i = -7; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 100 - 500, -950);
    ctx.lineTo(i * 100 + 400, 950);
    ctx.stroke();
  }
  ctx.restore();

  const center = 768;
  ctx.textAlign = "center";
  ctx.fillStyle = "#e8eee0";
  ctx.font = '600 33px "DM Sans", sans-serif';
  ctx.fillText("UNCOMPROMISING ENERGY", center, 180);

  ctx.save();
  ctx.translate(center, 235);
  ctx.fillStyle = flavor.color;
  // Two angular lightning cuts form the custom V symbol.
  ctx.beginPath();
  ctx.moveTo(-212, 0);
  ctx.lineTo(-50, 44);
  ctx.lineTo(-92, 202);
  ctx.lineTo(37, 150);
  ctx.lineTo(-128, 588);
  ctx.lineTo(-103, 310);
  ctx.lineTo(-210, 351);
  ctx.lineTo(-171, 157);
  ctx.lineTo(-251, 140);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(65, 23);
  ctx.lineTo(238, -8);
  ctx.lineTo(143, 217);
  ctx.lineTo(228, 182);
  ctx.lineTo(-55, 608);
  ctx.lineTo(72, 307);
  ctx.lineTo(-5, 331);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#f0f2e9";
  ctx.font = '800 italic 235px "Barlow Condensed", sans-serif';
  ctx.fillText("VOLT", center, 1045);
  ctx.fillStyle = flavor.color;
  ctx.font = '600 62px "Barlow Condensed", sans-serif';
  ctx.fillText("E N E R G Y", center, 1120);
  ctx.fillRect(center - 191, 1190, 382, 2);
  ctx.font = '700 50px "Barlow Condensed", sans-serif';
  ctx.fillText(flavor.label, center, 1266);
  ctx.fillStyle = "#a5ad9c";
  ctx.font = '500 27px "DM Sans", sans-serif';
  ctx.fillText("500 ml  /  GO ALL IN.", center, 1360);

  ctx.save();
  ctx.translate(1240, 840);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#85907c";
  ctx.font = '500 22px "DM Sans", sans-serif';
  ctx.fillText("VOLT ENERGY  •  INDEPENDENT DESIGN CONCEPT", 0, 0);
  ctx.restore();
  for (let i = 0; i < 37; i++) {
    ctx.fillStyle = "#748269";
    ctx.fillRect(235 + i * 5, 1080, i % 3 === 0 ? 3 : 1, 125);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
