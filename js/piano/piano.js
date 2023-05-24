import {chordSemitones} from "../shared/constants";
import {constructScaledCanvas, isolatedTranslate, toggleSemitone} from "../shared/utils";
import {redrawAll} from "../shared/commands";
import {PianoKey} from "./pianoKey";
import {PianoSemiTone} from "./pianoSemitone";
import {PianoClickCanvas} from "./pianoClickCanvas";

const canvasSize = {
  width: 1200,
  height: 150,
  scaleFactor: 2,
};

const pianoStyles = {
  offsetX: 25,
  offsetY: 25,
}

export class Piano {
  canvas; ctx;
  #abortControllers = [];

  constructor() {
    [this.canvas, this.ctx] = constructScaledCanvas("piano-canvas", canvasSize);

    this.clickCanvas = new PianoClickCanvas(canvasSize);
  }

  drawPianoKeys(chordRootNumber) {
    for (let ixKey = 0; ixKey <= 24; ixKey++) {
      const key = new PianoKey(ixKey);
      key.draw(this.ctx, chordRootNumber);
    }
  }

  drawSemitones(chordRootNumber, chordQuality, activeTones) {
    chordSemitones[chordQuality].forEach((semitonePosition) => {
      const isActive = activeTones.has(semitonePosition.label);

      const semiTone = new PianoSemiTone(chordRootNumber, semitonePosition);
      semiTone.draw(this.ctx, this.clickCanvas.ctx, isActive);

      this.clickCanvas.registerSemitoneButton(semitonePosition.label, semiTone.invisibleColor);
    })
  }

  pianoClickHandler() {
    const clickCanvas = this.clickCanvas;

    return function handlePianoClick(event) {
      const clickedSemitone = clickCanvas.getClickedSemitone(event);
      if (clickedSemitone) {
        toggleSemitone(clickedSemitone);
        redrawAll();
      }
    }
  }

  clearEventListeners() {
    while (this.#abortControllers.length > 0) {
      this.#abortControllers.pop().abort();
    }
  }

  addClickEventListener() {
    const abortController = new AbortController();
    this.#abortControllers.push(abortController);
    this.canvas.addEventListener('click', this.pianoClickHandler(), {signal: abortController.signal});
  }

  draw(state) {
    const {chordRootNumber, chordQuality, activeTones} = state;

    const onPiano = isolatedTranslate(pianoStyles.offsetX, pianoStyles.offsetY);
    onPiano(this.ctx, () => onPiano(this.clickCanvas.ctx, () => {
      this.drawPianoKeys(chordRootNumber);
      this.drawSemitones(chordRootNumber, chordQuality, activeTones);
    }));

    this.clearEventListeners();
    this.addClickEventListener();
  }
}
