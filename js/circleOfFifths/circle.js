import {setKey} from "../shared/state";
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

  reset() {
    this.keySectors = [];
    this.canvas.reset();
  }

  getClickedKeySector(event) {
    const canvasBox = event.target.getBoundingClientRect();
    const xScaleRatio = canvasBox.width / canvasSize.width;
    const yScaleRatio = canvasBox.height / canvasSize.height;
    const x = (event.clientX - canvasBox.left) * canvasSize.scaleFactor / xScaleRatio;
    const y = (event.clientY - canvasBox.top) * canvasSize.scaleFactor / yScaleRatio;

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
        setKey(clickedKeySector.key);
      }
    })
  }

  drawSlices(ctx, activeKey, chordsInKeyVisible) {
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((ixCirclePosition) => {
      const slice = new CircleOfFifthsSlice(ixCirclePosition);
      slice.draw(ctx, activeKey, chordsInKeyVisible);

      this.keySectors.push(slice.majorKeySector);
      this.keySectors.push(slice.minorKeySector);
    })
  }

  draw(state) {
    const { activeKey, chordsInKeyVisible } = state;

    this.reset();

    this.drawSlices(this.ctx, activeKey, chordsInKeyVisible);

    this.addClickEventListener();
  }
}
