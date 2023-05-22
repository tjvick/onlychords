import state from "../shared/state";
import {chordPositions} from "../shared/constants";
import {isolate, isolatedTranslate} from "../shared/utils";
import {toneColors} from "../shared/theme";

const canvasSize = {
  width: 1200,
  height: 300,
  scaleFactor: 2,
};

const fretboardStyles = {
  offsetX: 60,
  offsetY: 50,
  nutCapoThickness: 6,
  fretThickness: 2,
  neckWidth: 200,
  stringLength: 1500,
};

const onFretBoard = isolatedTranslate(fretboardStyles.offsetX, fretboardStyles.offsetY);

function drawFrets(ctx, instrument) {
  onFretBoard(ctx,() => {
    for (let fretNumber=0; fretNumber <= instrument.nFrets; fretNumber++) {
      if (fretNumber === 0) {
        ctx.lineWidth = fretboardStyles.nutCapoThickness;
      } else {
        ctx.lineWidth = fretboardStyles.fretThickness;
      }

      const fretPosition = getFretPosition(fretNumber);
      ctx.beginPath();
      ctx.moveTo(fretPosition, 0);
      ctx.lineTo(fretPosition, fretboardStyles.neckWidth);
      ctx.stroke();
    }
  })
}

function getFretPosition(fretNumber) {
  const frequencyRatio = 2**(fretNumber/12);
  const lengthRatio = 1/frequencyRatio;
  const fretPosition = fretboardStyles.stringLength * (1 - lengthRatio)
  return Math.floor(fretPosition);
}

function labelFrets(ctx, instrument) {
  onFretBoard(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    for (let fretNumber=0; fretNumber <= instrument.nFrets; fretNumber++) {
      const fretPosition = getFretPosition(fretNumber);
      ctx.fillText(`${fretNumber}`, fretPosition, fretboardStyles.neckWidth+20);
    }
  })
}

function labelStrings(ctx, instrument) {
  onFretBoard(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"
    instrument.stringLabels.forEach((label, stringNumber) => {
      const yPosition = getStringYPosition(stringNumber, instrument);
      ctx.fillText(label, -40, yPosition+2);
    })
  })
}

function getStringYPosition(stringNumber, instrument) {
  let outerBuffer = 5;
  if (instrument.doubleStrings) {
    outerBuffer = 10;
  }
  const stringsWidth = fretboardStyles.neckWidth - (2 * outerBuffer);
  const stringSpacing = stringsWidth / (instrument.nStrings-1);
  return outerBuffer + stringNumber * stringSpacing;
}

function drawStrings(ctx, instrument) {
  onFretBoard(ctx, () => {
    const lastFretPosition = getFretPosition(instrument.nFrets);
    for (let stringNumber=0; stringNumber<instrument.nStrings; stringNumber++) {
      const stringYPosition = getStringYPosition(stringNumber, instrument);
      if (instrument.doubleStrings) {
        ctx.beginPath();
        ctx.moveTo(0, stringYPosition-5);
        ctx.lineTo(lastFretPosition+15, stringYPosition-5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, stringYPosition+5);
        ctx.lineTo(lastFretPosition+15, stringYPosition+5);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, stringYPosition);
        ctx.lineTo(lastFretPosition+15, stringYPosition);
        ctx.stroke();
      }
    }
  })
}

function drawTones(ctx, instrument, toneNumber, label) {
  onFretBoard(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"

    for (let stringNumber=0; stringNumber < instrument.nStrings; stringNumber++) {
      const stringYPosition = getStringYPosition(stringNumber, instrument);
      const stringBaseNote = instrument.stringTuning[stringNumber]
      for (let fretNumber=0; fretNumber < instrument.nFrets; fretNumber ++) {
        const fretXPosition = getFretPosition(fretNumber);
        const fretNote = (stringBaseNote + fretNumber) % 12;
        if (fretNote === toneNumber) {

          const ellipseWidth = 16;
          const ellipseHeight = 10;
          ctx.beginPath();
          ctx.ellipse(fretXPosition, stringYPosition, ellipseWidth, ellipseHeight, 0, 0, Math.PI * 2);
          ctx.fillStyle = toneColors[label]
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "rgb(0, 0, 0)"
          ctx.fillText(label, fretXPosition, stringYPosition+2)
        }
      }
    }
  })
}

export function drawFretBoard(chordRootNumber, chordInterval, instrument) {
  const canvas = document.getElementById("fretboard-canvas");
  canvas.width = canvasSize.width * canvasSize.scaleFactor;
  canvas.height = canvasSize.height * canvasSize.scaleFactor;
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.scale(canvasSize.scaleFactor, canvasSize.scaleFactor);

    drawFrets(ctx, instrument);
    drawStrings(ctx, instrument);
    labelFrets(ctx, instrument);
    labelStrings(ctx, instrument);
    state.activeTones.forEach((activeTone) => {
      const note = chordPositions[chordInterval].find((note) => note.label === activeTone);
      drawTones(ctx, instrument, (chordRootNumber+note.position) % 12, note.label);
    })
  }
}
