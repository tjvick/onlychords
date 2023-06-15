import { constructScaledCanvas, getRandomColor } from "../shared/utils";
import { CircleClickCanvas } from "./circleClickCanvas";
import { redrawAll } from "../shared/commands";
import state from "../shared/state";
import { DiminishedKeyArea, MajorKeyArea, MinorKeyArea } from "./keyAreas";

const canvasSize = {
  width: 500,
  height: 500,
  scaleFactor: 2,
};

const circlePositionIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export class CircleOfFifths {
  canvas;
  ctx;
  abortControllers = [];

  constructor() {
    console.log("Newing up a circle");
    [this.canvas, this.ctx] = constructScaledCanvas(
      "circle-canvas",
      canvasSize
    );
    this.clickCanvas = new CircleClickCanvas(canvasSize);
  }

  shadeKeyAreas(ctx) {
    circlePositionIndices.forEach((ix) => {
      const majorKeyArea = new MajorKeyArea(ix);
      majorKeyArea.shade(ctx, "white");

      const minorKeyArea = new MinorKeyArea(ix);
      minorKeyArea.shade(ctx, "white");

      const diminishedKeyArea = new DiminishedKeyArea(ix);
      diminishedKeyArea.shade(ctx, "white");
    });
  }

  drawKeyAreas(ctx) {
    circlePositionIndices.forEach((ix) => {
      const majorKeyArea = new MajorKeyArea(ix);
      majorKeyArea.drawBorder(ctx);
      majorKeyArea.writeLabel(ctx);

      const minorKeyArea = new MinorKeyArea(ix);
      minorKeyArea.drawBorder(ctx);
      minorKeyArea.writeLabel(ctx);

      const diminishedKeyArea = new DiminishedKeyArea(ix);
      diminishedKeyArea.drawBorder(ctx);
      diminishedKeyArea.writeLabel(ctx, "gray");
    });
  }

  fillActiveKey(ctx, chordRootNumber, chordQuality, showChordsInKey) {
    const activeKeyArea =
      chordQuality === "major"
        ? new MajorKeyArea(chordRootNumber, 0)
        : new MinorKeyArea(chordRootNumber, 0);
    activeKeyArea.highlight(ctx);
    showChordsInKey && activeKeyArea.writeCornerNumber(ctx);
  }

  highlightChordsInKey(ctx, chordRootNumber, chordQuality) {
    let majorSemitones = [5, 7];
    let minorSemitones = [2, 4, 9];
    let diminishedSemitone = 11;

    if (chordQuality === "minor") {
      majorSemitones = [3, 8, 10];
      minorSemitones = [5, 7];
      diminishedSemitone = 2;
    }

    majorSemitones.forEach((semitoneNumber) => {
      const majorKeyArea = new MajorKeyArea(
        chordRootNumber + semitoneNumber,
        semitoneNumber
      );
      majorKeyArea.shade(ctx, "yellow");
      majorKeyArea.writeCornerNumber(ctx);
    });

    minorSemitones.forEach((semitoneNumber) => {
      const minorKeyArea = new MinorKeyArea(
        chordRootNumber + semitoneNumber,
        semitoneNumber
      );
      minorKeyArea.shade(ctx, "lightblue");
      minorKeyArea.writeCornerNumber(ctx);
    });

    const diminishedKeyArea = new DiminishedKeyArea(
      chordRootNumber + diminishedSemitone,
      diminishedSemitone
    );
    diminishedKeyArea.shade(ctx, "pink");
    diminishedKeyArea.writeCornerNumber(ctx);
  }

  drawInvisibleKeyButtons(ctx) {
    circlePositionIndices.forEach((ix) => {
      const majorKeyArea = new MajorKeyArea(ix);
      const color = getRandomColor();
      majorKeyArea.shade(ctx, color);
      this.clickCanvas.registerKeyButton(
        color,
        majorKeyArea.note.value,
        "major"
      );
    });

    circlePositionIndices.forEach((ix) => {
      const minorKeyArea = new MinorKeyArea(ix);
      const color = getRandomColor();
      minorKeyArea.shade(ctx, color);
      this.clickCanvas.registerKeyButton(
        color,
        minorKeyArea.note.value,
        "minor"
      );
    });
  }

  circleClickHandler() {
    const clickCanvas = this.clickCanvas;

    console.log("returning click handler");
    return function handleCircleClick(event) {
      console.log("handling an event");
      console.log(event);
      const clickedKey = clickCanvas.getClickedKey(event);
      console.log({clickedKey: clickedKey})
      if (clickedKey) {
        const { chordRootNumber, chordQuality } = clickedKey;
        console.log({chordRootNumber, chordQuality});
        state.chordQuality = chordQuality;
        state.chordRootNumber = chordRootNumber;
        console.log("redrawing all");
        redrawAll();
      }
    };
  }

  clearEventListeners() {
    console.log({nAbortControllers: this.abortControllers.length})
    while (this.abortControllers.length > 0) {
      console.log("clearing abort controller");
      this.abortControllers.pop().abort();
    }
  }

  addClickEventListener() {
    const abortController = new AbortController();
    console.log("adding an abort controller");
    this.abortControllers.push(abortController);
    console.log(this.abortControllers);
    console.log("adding click event listener");
    this.canvas.addEventListener("click", this.circleClickHandler(), {
      signal: abortController.signal,
    });
  }

  draw(state) {
    const { chordRootNumber, chordQuality, showChordsInKey } = state;

    this.clickCanvas.clear();

    this.shadeKeyAreas(this.ctx);
    this.fillActiveKey(
      this.ctx,
      chordRootNumber,
      chordQuality,
      showChordsInKey
    );
    showChordsInKey &&
      this.highlightChordsInKey(this.ctx, chordRootNumber, chordQuality);

    this.drawKeyAreas(this.ctx);
    this.drawInvisibleKeyButtons(this.clickCanvas.ctx);

    this.clearEventListeners();
    this.addClickEventListener();
  }
}
