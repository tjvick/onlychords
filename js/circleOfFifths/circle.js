import {constructScaledCanvas, getRandomColor, setQuality} from "../shared/utils";
import {CircleClickCanvas} from "./circleClickCanvas";
import {redrawAll} from "../shared/commands";
import state from "../shared/state";
import {DiminishedKeyArea, MajorKeyArea, MinorKeyArea} from "./keyAreas";
import {circleFillColors} from "../shared/theme";

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

  outlineActiveKey(ctx, chordRootNumber, chordQuality) {
    const activeKeyArea =
      chordQuality === "major"
        ? new MajorKeyArea(chordRootNumber, 0)
        : new MinorKeyArea(chordRootNumber, 0);
    activeKeyArea.drawBorder(ctx, "black");
  };

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
      majorKeyArea.shade(ctx, circleFillColors.major);
      majorKeyArea.writeCornerNumber(ctx);
    });

    minorSemitones.forEach((semitoneNumber) => {
      const minorKeyArea = new MinorKeyArea(
        chordRootNumber + semitoneNumber,
        semitoneNumber
      );
      minorKeyArea.shade(ctx, circleFillColors.minor);
      minorKeyArea.writeCornerNumber(ctx);
    });

    const diminishedKeyArea = new DiminishedKeyArea(
      chordRootNumber + diminishedSemitone,
      diminishedSemitone
    );
    diminishedKeyArea.shade(ctx, circleFillColors.diminished);
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

  clearEventListeners() {
    while (this.abortControllers.length > 0) {
      this.abortControllers.pop().abort();
    }
  }

  addClickEventListener() {
    const abortController = new AbortController();
    this.abortControllers.push(abortController);
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
    this.outlineActiveKey(this.ctx,
      chordRootNumber,
      chordQuality);

    this.clearEventListeners();
    this.addClickEventListener();
  }
}
