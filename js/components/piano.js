import state from "../shared/state";
import {chordPositions, notes} from "../shared/constants";
import {getRandomColor, isolatedTranslate, scaleCanvas} from "../shared/utils";
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

function drawPianoKeys(ctx, chordRootNumber) {
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

function getTextYPosition(note) {
  return pianoStyles.keyHeight/2 - keyLabelTextHeight/2 * (note.labels.length - 1);
}

const keyLabelColor = (isAccidental) => isAccidental ? "white" : "black";
const keyLabelTextHeight = 20;

function labelPianoKeys(ctx) {
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

const ellipseWidth = 16;
const ellipseHeight = 10;

function drawToneOnPiano(ctx, x, y, fillStyle, strokeStyle, buffer=0) {
  onPiano(ctx, () => {
    ctx.beginPath();
    ctx.ellipse(x, y, ellipseWidth+buffer, ellipseHeight+buffer, 0, 0, Math.PI * 2);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  })
}

function labelToneOnPiano(ctx, x, y, label) {
  onPiano(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillText(label, x, y+2)
  })
}

const hitMap = {};

function drawTonesOnPiano(ctx, hitCtx, chordRootNumber, chordInterval, activeTones) {
  chordPositions[chordInterval].forEach((chordPosition) => {
    const x = getKeyXPosition(chordRootNumber + chordPosition.position) + pianoStyles.keyWidth / 2;
    const y = pianoStyles.keyHeight + 20;

    const isActive = activeTones.includes(chordPosition.label)
    const fillStyle = isActive ? toneColors[chordPosition.label] : "lightgray";
    const strokeStyle = isActive ? "black" : "gray";
    drawToneOnPiano(ctx, x, y, fillStyle, strokeStyle);
    labelToneOnPiano(ctx, x, y, chordPosition.label);

    const hitColor = getRandomColor();
    drawToneOnPiano(hitCtx, x, y, hitColor, hitColor, 3);
    hitMap[hitColor] = chordPosition;
  })
}


function pianoClickHandler(hitCtx) {
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
      redrawAll();
    }
  }
}

export const controllers = [];

export function drawPiano(state) {
  const {chordRootNumber, chordInterval, activeTones} = state;

  const pianoCanvas = document.getElementById("piano-canvas");
  const hitCanvas = document.getElementById("hit-canvas");

  if (pianoCanvas.getContext && hitCanvas.getContext) {
    const ctx = pianoCanvas.getContext("2d");
    const hitCtx = hitCanvas.getContext("2d");
    scaleCanvas(canvasSize, pianoCanvas, ctx);
    scaleCanvas(canvasSize, hitCanvas, hitCtx);

    drawPianoKeys(ctx, chordRootNumber);
    labelPianoKeys(ctx);
    drawTonesOnPiano(ctx, hitCtx, chordRootNumber, chordInterval, activeTones);

    const controller = new AbortController();
    pianoCanvas.addEventListener('click', pianoClickHandler(hitCtx), {signal: controller.signal});
  }
}
