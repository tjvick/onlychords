import { constructScaledCanvas } from "../shared/utils";

export class CircleClickCanvas {
  canvas;
  ctx;
  hitMap = {};

  constructor(canvasSize) {
    this.canvasSize = canvasSize;
    [this.canvas, this.ctx] = constructScaledCanvas("circle-click-canvas", canvasSize);
  }

  registerKeyButton(label, color) {
    this.hitMap[color] = label;
  }

  getClickedKey(event) {
    const canvasBox = event.target.getBoundingClientRect();
    const boxX = event.clientX - canvasBox.left;
    const boxY = event.clientY - canvasBox.top;
    const canvasX = boxX * this.canvasSize.width / (canvasBox.right - canvasBox.left);
    const canvasY = boxY * this.canvasSize.height / (canvasBox.bottom - canvasBox.top);
    const pixel = this.ctx.getImageData(
      canvasX * this.canvasSize.scaleFactor,
      canvasY * this.canvasSize.scaleFactor,
      1,
      1
    ).data;
    const clickedColor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    return this.hitMap[clickedColor] || null;
  }
}