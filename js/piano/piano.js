import {allSemitones} from "../shared/constants";
import {isolate, isolatedTranslate,} from "../shared/utils";
import {PianoKey, pianoKeyStyles} from "./pianoKey";
import {PianoSemiTone} from "./pianoSemitone";
import {ClickableCanvas} from "../shared/canvas";
import {toggleSemitone} from "../shared/state";

const canvasSize = {
  width: 1200,
  height: 150,
  scaleFactor: 2,
};

const pianoStyles = {
  offsetX: 48,
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
    for (let ixKey = 0; ixKey <= 23; ixKey++) {
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

  drawText(activeKey) {
    const ctx = this.ctx;
    const xText = pianoKeyStyles.keyWidth * activeKey.rootNote.index + 40;
    const yText = pianoKeyStyles.keyHeight + 40;
    isolate(ctx, () => {
      ctx.font = "16px serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText("(+1 octave):", xText, yText);
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
      this.drawText(activeKey);
    });

    this.addClickEventListener();
  }
}


