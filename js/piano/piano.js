import {allSemitones} from "../shared/constants";
import {isolatedTranslate, } from "../shared/utils";
import {PianoKey} from "./pianoKey";
import {PianoSemiTone} from "./pianoSemitone";
import {ClickableCanvas} from "../shared/canvas";
import {toggleSemitone} from "../shared/state";

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
    this.canvas = new ClickableCanvas("piano-canvas", canvasSize.width, canvasSize.height, canvasSize.scaleFactor);
    this.ctx = this.canvas.ctx;
  }

  reset() {
    this.semitones = [];
    this.canvas.reset();
  }

  drawPianoKeys(activeKey) {
    for (let ixKey = 0; ixKey <= 24; ixKey++) {
      const pianoKey = new PianoKey(ixKey);
      pianoKey.draw(this.ctx, activeKey.rootNote.index);
    }
  }

  drawSemitones(activeKey, activeTones) {
    allSemitones.forEach((semitone) => {
      const isActive = activeTones.has(semitone.position);

      const pianoSemitone = new PianoSemiTone(activeKey.rootNote.index, semitone);
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
    this.canvas.addClickHandler((event) => {
      const clickedSemitonePosition = this.getClickedSemitone(event);
      if (clickedSemitonePosition !== null) {
        toggleSemitone(clickedSemitonePosition);
      }
    })
  }

  draw(state) {
    const { activeKey, activeTones } = state;

    this.reset();

    const onPiano = isolatedTranslate(pianoStyles.offsetX, pianoStyles.offsetY);
    onPiano(this.ctx, () => {
      this.drawPianoKeys(activeKey);
      this.drawSemitones(activeKey, activeTones);
    });

    this.addClickEventListener();
  }
}


