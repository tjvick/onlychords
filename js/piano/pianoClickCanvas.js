import {constructScaledCanvas, matchHitMapWithinTolerance} from "../shared/utils";
import {isBrave} from "../shared/global";

export class PianoClickCanvas {
  canvas;
  ctx;
  #hitMap = {};

  constructor(canvasSize) {
    this.scaleFactor = canvasSize.scaleFactor;
    [this.canvas, this.ctx] = constructScaledCanvas("hit-canvas", canvasSize);
  }

  registerSemitoneButton(semitonePosition, color) {
    this.#hitMap[color] = semitonePosition;
  }

  clear() {
    this.#hitMap = {};
  }

  getClickedSemitone(event) {
    const canvasBox = event.target.getBoundingClientRect();
    const x = event.clientX - canvasBox.left;
    const y = event.clientY - canvasBox.top;
    const pixel = this.ctx.getImageData(
      x * this.scaleFactor,
      y * this.scaleFactor,
      1,
      1
    ).data;
    const clickedColor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    if (isBrave) {
      return matchHitMapWithinTolerance(this.#hitMap, pixel[0], pixel[1], pixel[2]);
    }
    if (clickedColor in this.#hitMap) {
      return this.#hitMap[clickedColor];
    }
    return null;
  }
}
