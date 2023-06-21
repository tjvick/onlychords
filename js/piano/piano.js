import {allSemitones} from "../shared/constants";
import {
  constructScaledCanvas,
  isolate,
  isolatedTranslate,
  toggleSemitone,
} from "../shared/utils";
import { redrawAll } from "../shared/commands";
import { PianoKey } from "./pianoKey";
import { PianoSemiTone } from "./pianoSemitone";
import { PianoClickCanvas } from "./pianoClickCanvas";

const canvasSize = {
  width: 1200,
  height: 150,
  scaleFactor: 2,
};

const pianoStyles = {
  offsetX: 25,
  offsetY: 25,
};

export class Piano {
  canvas;
  ctx;
  #abortControllers = [];

  constructor() {
    [this.canvas, this.ctx] = constructScaledCanvas("piano-canvas", canvasSize);

    this.clickCanvas = new PianoClickCanvas(canvasSize);
  }

  clearCanvas() {
    isolate(this.ctx, () => {
      this.ctx.beginPath();
      this.ctx.rect(0, 0, canvasSize.width, canvasSize.height);
      this.ctx.fillStyle = "white";
      this.ctx.fill();
    })
  }

  drawPianoKeys(chordRootNumber) {
    for (let ixKey = 0; ixKey <= 24; ixKey++) {
      const key = new PianoKey(ixKey);
      key.draw(this.ctx, chordRootNumber);
    }
  }

  drawSemitones(chordRootNumber, activeTones) {
    allSemitones.forEach((semitone) => {
      const isActive = activeTones.has(semitone.position);

      const pianoSemitone = new PianoSemiTone(chordRootNumber, semitone);
      pianoSemitone.draw(this.ctx, this.clickCanvas.ctx, isActive);

      this.clickCanvas.registerSemitoneButton(
        semitone.position,
        pianoSemitone.invisibleColor
      );
    });
  }

  pianoClickHandler() {
    const clickCanvas = this.clickCanvas;

    return function handlePianoClick(event) {
      const clickedSemitonePosition = clickCanvas.getClickedSemitone(event);
      if (clickedSemitonePosition !== null) {
        toggleSemitone(clickedSemitonePosition);
        redrawAll();
      }
    };
  }

  clearEventListeners() {
    while (this.#abortControllers.length > 0) {
      this.#abortControllers.pop().abort();
    }
  }

  addClickEventListener() {
    const abortController = new AbortController();
    this.#abortControllers.push(abortController);
    this.canvas.addEventListener("click", this.pianoClickHandler(), {
      signal: abortController.signal,
    });
  }

  draw(state) {
    const { chordRootNumber, activeTones } = state;

    this.clearCanvas();
    this.clickCanvas.clear();

    const onPiano = isolatedTranslate(pianoStyles.offsetX, pianoStyles.offsetY);
    onPiano(this.ctx, () =>
      onPiano(this.clickCanvas.ctx, () => {
        this.drawPianoKeys(chordRootNumber);
        this.drawSemitones(chordRootNumber, activeTones);
      })
    );

    this.clearEventListeners();
    this.addClickEventListener();
  }
}
