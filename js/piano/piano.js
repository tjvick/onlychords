import {allSemitones} from "../shared/constants";
import {isolatedTranslate, toggleSemitone,} from "../shared/utils";
import {redrawAll} from "../shared/commands";
import {PianoKey} from "./pianoKey";
import {PianoSemiTone} from "./pianoSemitone";
import {ClickableCanvas} from "../shared/canvas";

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
  semitones = [];

  constructor() {
    this.clickCanvas = new ClickableCanvas("piano-canvas", canvasSize.width, canvasSize.height, canvasSize.scaleFactor);
    this.ctx = this.clickCanvas.ctx;
  }

  reset() {
    this.semitones = [];
    this.clickCanvas.reset();
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
      pianoSemitone.draw(this.ctx, isActive);
      this.semitones.push(pianoSemitone);
    });
  }

  getClickedSemitone(event) {
    const canvasBox = event.target.getBoundingClientRect();
    const x = (event.clientX - canvasBox.left) * canvasSize.scaleFactor;
    const y = (event.clientY - canvasBox.top) * canvasSize.scaleFactor;

    this.ctx.save();
    this.ctx.translate(pianoStyles.offsetX, pianoStyles.offsetY);
    for (const semitone of this.semitones) {
      if (semitone.contains(this.ctx, x, y)) {
        this.ctx.restore();
        return semitone.position;
      }
    }
    this.ctx.restore();
    return null;
  }

  addClickEventListener() {
    this.clickCanvas.addClickHandler((event) => {
      const clickedSemitonePosition = this.getClickedSemitone(event);
      if (clickedSemitonePosition !== null) {
        toggleSemitone(clickedSemitonePosition);
        redrawAll();
      }
    })
  }

  draw(state) {
    const { chordRootNumber, activeTones } = state;

    this.reset();

    const onPiano = isolatedTranslate(pianoStyles.offsetX, pianoStyles.offsetY);
    onPiano(this.ctx, () => {
      this.drawPianoKeys(chordRootNumber);
      this.drawSemitones(chordRootNumber, activeTones);
    });

    this.addClickEventListener();
  }
}


