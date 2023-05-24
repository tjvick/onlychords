import {chordSemitones} from "../shared/constants";
import {constructScaledCanvas, isolate, isolatedTranslate} from "../shared/utils";
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


class FretboardString {
  constructor(instrument, stringNumber) {
    this.label = instrument.stringLabels[stringNumber];
    this.instrument = instrument;
    this.yPosition = getStringYPosition(stringNumber, instrument)
  }

  drawLine(ctx) {
    const y = this.yPosition;
    const xLastFret = getFretPosition(this.instrument.nFrets);
    const xEnd = xLastFret + 15;
    isolate(ctx, () => {
      if (this.instrument.doubleStrings) {
        ctx.beginPath();
        ctx.moveTo(0, y-5);
        ctx.lineTo(xEnd, y-5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, y+5);
        ctx.lineTo(xEnd, y+5);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(xEnd, y);
        ctx.stroke();
      }
    })
  }

  writeLabel(ctx) {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"
    ctx.fillText(this.label, -40, this.yPosition+2);
  }

  draw(ctx) {
    this.drawLine(ctx);
    this.writeLabel(ctx);
  }
}


class FretboardFret {
  constructor(fretNumber) {
    this.fretNumber = fretNumber;
    this.fretPosition = getFretPosition(fretNumber);
  }

  drawLine(ctx) {
    isolate(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(this.fretPosition, 0);
      ctx.lineTo(this.fretPosition, fretboardStyles.neckWidth);
      ctx.lineWidth = this.fretNumber === 0
        ? fretboardStyles.nutCapoThickness
        : fretboardStyles.fretThickness;
      ctx.stroke();
    })
  }

  writeLabel(ctx) {
    isolate(ctx, () => {
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.fillText(`${this.fretNumber}`, this.fretPosition, fretboardStyles.neckWidth + 20);
    })
  }

  draw(ctx) {
    this.drawLine(ctx);
    this.writeLabel(ctx);
  }
}


class FretboardSemitone {
  constructor(instrument, chordRootNumber, semitone) {
    this.instrument = instrument;
    this.label = semitone.label;
    this.position = semitone.position;

    this.noteNumber = (chordRootNumber+semitone.position) % 12;
  }

  draw(ctx) {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"

    for (let stringNumber=0; stringNumber < this.instrument.nStrings; stringNumber++) {
      const stringYPosition = getStringYPosition(stringNumber, this.instrument);
      const stringBaseNote = this.instrument.stringTuning[stringNumber]
      for (let fretNumber=0; fretNumber < this.instrument.nFrets; fretNumber ++) {
        const fretXPosition = getFretPosition(fretNumber);
        const fretNote = (stringBaseNote + fretNumber) % 12;
        if (fretNote === this.noteNumber) {

          const ellipseWidth = 16;
          const ellipseHeight = 10;
          ctx.beginPath();
          ctx.ellipse(fretXPosition, stringYPosition, ellipseWidth, ellipseHeight, 0, 0, Math.PI * 2);
          ctx.fillStyle = toneColors[this.label]
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "rgb(0, 0, 0)"
          ctx.fillText(this.label, fretXPosition, stringYPosition+2)
        }
      }
    }
  }
}


export class Fretboard {
  canvas; ctx;

  constructor() {
    [this.canvas, this.ctx] = constructScaledCanvas("fretboard-canvas", canvasSize);
  }

  drawStrings(instrument) {
    for (let stringNumber=0; stringNumber<instrument.nStrings; stringNumber++) {
      const fretboardString = new FretboardString(instrument, stringNumber);
      fretboardString.draw(this.ctx);
    }
  }

  drawFrets(instrument) {
    for (let fretNumber=0; fretNumber <= instrument.nFrets; fretNumber++) {
      const fret = new FretboardFret(fretNumber);
      fret.draw(this.ctx);
    }
  }

  drawSemitones(instrument, chordRootNumber, chordQuality, activeTones) {
    activeTones.forEach((activeTone) => {
      const semitone = chordSemitones[chordQuality].find((note) => note.label === activeTone);
      const fretboardSemitone = new FretboardSemitone(instrument, chordRootNumber, semitone);
      fretboardSemitone.draw(this.ctx);
    })
  }

  draw(state) {
    const {instrument, chordRootNumber, chordQuality, activeTones} = state;

    const onFretboard = isolatedTranslate(fretboardStyles.offsetX, fretboardStyles.offsetY);
    onFretboard(this.ctx, () => {
      this.drawStrings(instrument);
      this.drawFrets(instrument);
      this.drawSemitones(instrument, chordRootNumber, chordQuality, activeTones);
    })
  }
}


function getFretPosition(fretNumber) {
  const frequencyRatio = 2**(fretNumber/12);
  const lengthRatio = 1/frequencyRatio;
  const fretPosition = fretboardStyles.stringLength * (1 - lengthRatio)
  return Math.floor(fretPosition);
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

