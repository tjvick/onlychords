import { constructScaledCanvas } from "../shared/utils";
import { isBrave } from "../shared/global";

export class CircleClickCanvas {
  canvas;
  ctx;
  hitMap = {};

  constructor(canvasSize) {
    this.canvasSize = canvasSize;
    [this.canvas, this.ctx] = constructScaledCanvas(
      "circle-click-canvas",
      canvasSize
    );
  }

  matchHitMapWithinTolerance(r, g, b) {
    const clickedColor = `rgb(${r},${g},${b})`;

    if (this.hitMap[clickedColor]) {
      return this.hitMap[clickedColor];
    }

    const matchingRGBs = [];
    [-1, 0, 1].forEach((dr) => {
      [-1, 0, 1].forEach((dg) => {
        [-1, 0, 1].forEach((db) => {
          const rgbString = `rgb(${r+dr},${g+dg},${b+db})`
          if (rgbString in this.hitMap) {
            matchingRGBs.push(rgbString);
          }
        })
      })
    })

    if (matchingRGBs.length === 1) {
      return this.hitMap[matchingRGBs[0]];
    }
  }

  clear() {
    this.hitMap = {};
  }

  registerKeyButton(color, chordRootNumber, chordQuality) {
    this.hitMap[color] = { chordRootNumber, chordQuality };
  }

  getClickedKey(event) {
    const canvasBox = event.target.getBoundingClientRect();
    const boxX = event.clientX - canvasBox.left;
    const boxY = event.clientY - canvasBox.top;
    const canvasX =
      (boxX * this.canvasSize.width) / (canvasBox.right - canvasBox.left);
    const canvasY =
      (boxY * this.canvasSize.height) / (canvasBox.bottom - canvasBox.top);
    const pixel = this.ctx.getImageData(
      canvasX * this.canvasSize.scaleFactor,
      canvasY * this.canvasSize.scaleFactor,
      1,
      1
    ).data;
    const clickedColor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    if (isBrave) {
      return this.matchHitMapWithinTolerance(pixel[0], pixel[1], pixel[2]);
    }
    return this.hitMap[clickedColor] || null;
  }
}
