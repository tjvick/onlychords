import { setQuality} from "../shared/utils";
import {CircleClickCanvas} from "./circleClickCanvas";
import {redrawAll} from "../shared/commands";
import state from "../shared/state";
import {ClickableCanvas} from "../shared/canvas";
import {CircleOfFifthsSlice} from "./circleSlice";

const canvasSize = {
  width: 500,
  height: 500,
  scaleFactor: 2,
};

export class CircleOfFifths {
  canvas;
  ctx;

  constructor() {
    this.canvas = new ClickableCanvas("circle-canvas", canvasSize.width, canvasSize.height, canvasSize.scaleFactor);
    this.ctx = this.canvas.ctx;
    this.clickCanvas = new CircleClickCanvas(canvasSize);
  }

  circleClickHandler() {
    const clickCanvas = this.clickCanvas;

    return function handleCircleClick(event) {
      const clickedKey = clickCanvas.getClickedKey(event);
      if (clickedKey) {
        const { chordRootNumber, chordQuality } = clickedKey;
        setQuality(chordQuality);
        state.chordRootNumber = chordRootNumber;
        redrawAll();
      }
    };
  }

  addClickEventListener() {
    this.canvas.addClickHandler(this.circleClickHandler())
  }

  drawSlices(ctx, chordRootNumber, chordQuality, showChordsInKey) {
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((ixCirclePosition) => {
      const slice = new CircleOfFifthsSlice(ixCirclePosition);
      slice.draw(ctx, chordRootNumber, chordQuality, showChordsInKey);
    })
  }

  draw(state) {
    const { chordRootNumber, chordQuality, showChordsInKey } = state;

    this.canvas.reset();

    this.drawSlices(this.ctx, chordRootNumber, chordQuality, showChordsInKey);

    this.addClickEventListener();
  }
}
