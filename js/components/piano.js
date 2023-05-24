import state from "../shared/state";
import {chordPositions, notes} from "../shared/constants";
import {constructScaledCanvas, getRandomColor, isolatedTranslate, scaleCanvas} from "../shared/utils";
import {toneColors} from "../shared/theme";
import {redrawAll} from "../shared/commands";

const canvasSize = {
  width: 1200,
  height: 150,
  scaleFactor: 2,
};

const pianoStyles = {
  offsetX: 25,
  offsetY: 25,
  keyHeight: 60,
  keyWidth: 46,
}

const onPiano = isolatedTranslate(pianoStyles.offsetX, pianoStyles.offsetY);

function getKeyXPosition(ixKey) {
  return ixKey * (pianoStyles.keyWidth);
}

const accidentalKeyColor = isHighlighted => isHighlighted ? "black" : "gray";
const naturalKeyColor = isHighlighted => isHighlighted ? "ivory" : "lightgray";
const keyOutlineColor = "rgba(100, 100, 100, 1)";

function getTextYPosition(note) {
  return pianoStyles.keyHeight/2 - keyLabelTextHeight/2 * (note.labels.length - 1);
}

const keyLabelColor = (isAccidental) => isAccidental ? "white" : "black";
const keyLabelTextHeight = 20;

const ellipseWidth = 16;
const ellipseHeight = 10;


export class Piano {
  canvas; ctx; hitCanvas; hitCtx;
  #abortControllers = [];
  #hitMap = {};

  constructor() {
    [this.canvas, this.ctx] = constructScaledCanvas("piano-canvas", canvasSize);
    [this.hitCanvas, this.hitCtx] = constructScaledCanvas("hit-canvas", canvasSize);
  }

  drawPianoKeys(chordRootNumber) {
    const ctx = this.ctx;

    onPiano(ctx, () => {
      for (let ixKey = 0; ixKey <= 24; ixKey++) {
        const note = notes[ixKey % 12];
        const keyXPosition = getKeyXPosition(ixKey);
        const isHighlighted = chordRootNumber <= ixKey && ixKey <= chordRootNumber + 12;

        ctx.beginPath()
        ctx.rect(keyXPosition, 0, pianoStyles.keyWidth, pianoStyles.keyHeight)
        ctx.fillStyle = note.isAccidental ? accidentalKeyColor(isHighlighted) : naturalKeyColor(isHighlighted);
        ctx.fill();
        ctx.strokeStyle = keyOutlineColor;
        ctx.stroke();
      }
    })
  }

  labelPianoKeys() {
    const ctx = this.ctx;

    onPiano(ctx, () => {
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"

      for (let ixKey = 0; ixKey <= 24; ixKey++) {
        const note = notes[ixKey % 12];
        const textXPosition = getKeyXPosition(ixKey) + (pianoStyles.keyWidth / 2);
        const textYPosition = getTextYPosition(note);

        ctx.fillStyle = keyLabelColor(note.isAccidental);
        note.labels.forEach((labelText, ixLabel) => {
          const labelYPosition = textYPosition + (ixLabel * keyLabelTextHeight);
          ctx.fillText(labelText, textXPosition, labelYPosition);
        })
      }
    })
  }

  static drawToneOnPiano(ctx, x, y, fillStyle, strokeStyle, buffer=0) {
    onPiano(ctx, () => {
      ctx.beginPath();
      ctx.ellipse(x, y, ellipseWidth+buffer, ellipseHeight+buffer, 0, 0, Math.PI * 2);
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    })
  }

  labelToneOnPiano(x, y, label) {
    const ctx = this.ctx;

    onPiano(ctx, () => {
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.fillText(label, x, y+2)
    })
  }

  drawTonesOnPiano(chordRootNumber, chordInterval, activeTones) {
    chordPositions[chordInterval].forEach((chordPosition) => {
      const x = getKeyXPosition(chordRootNumber + chordPosition.position) + pianoStyles.keyWidth / 2;
      const y = pianoStyles.keyHeight + 20;

      const isActive = activeTones.includes(chordPosition.label)
      const fillStyle = isActive ? toneColors[chordPosition.label] : "lightgray";
      const strokeStyle = isActive ? "black" : "gray";
      Piano.drawToneOnPiano(this.ctx, x, y, fillStyle, strokeStyle);
      this.labelToneOnPiano(x, y, chordPosition.label);

      const hitColor = getRandomColor();
      Piano.drawToneOnPiano(this.hitCtx, x, y, hitColor, hitColor, 3);
      this.#hitMap[hitColor] = chordPosition;
    })
  }

  pianoClickHandler() {
    const hitCtx = this.hitCtx;
    const hitMap = this.#hitMap;
    const piano = this;

    return function handlePianoClick(event) {
      const canvasBox = event.target.getBoundingClientRect();
      const x = event.clientX - canvasBox.left;
      const y = event.clientY - canvasBox.top;
      const pixel = hitCtx.getImageData(x * canvasSize.scaleFactor, y * canvasSize.scaleFactor, 1, 1).data;
      const clickedColor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
      const clickedTone = hitMap[clickedColor]?.label || null;
      if (clickedTone) {
        if (state.activeTones.includes(clickedTone)) {
          state.activeTones = state.activeTones.filter((tone) => tone !== clickedTone);
        } else {
          state.activeTones.push(clickedTone);
        }
        redrawAll(new Piano());
      }
    }
  }

  draw(state) {
    const {chordRootNumber, chordInterval, activeTones} = state;

    this.drawPianoKeys(chordRootNumber);
    this.labelPianoKeys();
    this.drawTonesOnPiano(chordRootNumber, chordInterval, activeTones);

    while (this.#abortControllers.length > 0) {
      this.#abortControllers.pop().abort();
    }

    const abortController = new AbortController();
    this.#abortControllers.push(abortController);
    this.canvas.addEventListener('click', this.pianoClickHandler(), {signal: abortController.signal});
  }
}

