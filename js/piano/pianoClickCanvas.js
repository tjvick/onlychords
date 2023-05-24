import {constructScaledCanvas} from "../shared/utils";

export class PianoClickCanvas {
  canvas; ctx;
  #hitMap = {};

  constructor(canvasSize) {
    this.scaleFactor = canvasSize.scaleFactor;
    [this.canvas, this.ctx] = constructScaledCanvas("hit-canvas", canvasSize);
  }

  registerSemitoneButton(chordPositionLabel, color) {
    this.#hitMap[color] = chordPositionLabel;
  }

  getClickedSemitone(event) {
    const canvasBox = event.target.getBoundingClientRect();
    const x = event.clientX - canvasBox.left;
    const y = event.clientY - canvasBox.top;
    const pixel = this.ctx.getImageData(x * this.scaleFactor, y * this.scaleFactor, 1, 1).data;
    const clickedColor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    return this.#hitMap[clickedColor] || null;
  }
}
