import { setQuality} from "../shared/utils";
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
  keySectors = [];

  constructor() {
    this.canvas = new ClickableCanvas("circle-canvas", canvasSize.width, canvasSize.height, canvasSize.scaleFactor);
    this.ctx = this.canvas.ctx;
  }

  getClickedKeySector(event) {
    const canvasBox = event.target.getBoundingClientRect();
    const x = (event.clientX - canvasBox.left) * canvasSize.scaleFactor;
    const y = (event.clientY - canvasBox.top) * canvasSize.scaleFactor;

    for (const keySector of this.keySectors) {
      if (keySector.contains(this.ctx, x, y)) {
        return keySector;
      }
    }
    return null;
  }

  addClickEventListener() {
    this.canvas.addClickHandler((event) => {
      const clickedKeySector = this.getClickedKeySector(event);
      if (clickedKeySector !== null) {
        state.chordRootNumber = clickedKeySector.key.rootNote.index;
        setQuality(clickedKeySector.key.quality);
        redrawAll();
      }
    })
  }

  drawSlices(ctx, chordRootNumber, chordQuality, showChordsInKey) {
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((ixCirclePosition) => {
      const slice = new CircleOfFifthsSlice(ixCirclePosition);
      slice.draw(ctx, chordRootNumber, chordQuality, showChordsInKey);

      this.keySectors.push(slice.majorKeySector);
      this.keySectors.push(slice.minorKeySector);
    })
  }

  draw(state) {
    const { chordRootNumber, chordQuality, showChordsInKey } = state;

    this.canvas.reset();

    this.drawSlices(this.ctx, chordRootNumber, chordQuality, showChordsInKey);

    this.addClickEventListener();
  }
}
