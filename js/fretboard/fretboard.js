import {chordSemitones} from "../shared/constants";
import {constructScaledCanvas, isolatedTranslate} from "../shared/utils";
import {getFretboardString} from "./fretboardString";
import {fretboardStyles} from "./shared";
import {FretboardFret} from "./fretboardFret";
import {FretboardSemitone} from "./fretboardSemitone";

const canvasSize = {
  width: 1200,
  height: 300,
  scaleFactor: 2,
};


export class Fretboard {
  constructor() {
    let [_, ctx] = constructScaledCanvas("fretboard-canvas", canvasSize);
    this.ctx = ctx;
  }

  drawStrings(instrument) {
    for (let stringNumber=0; stringNumber<instrument.nStrings; stringNumber++) {
      const fretboardString = getFretboardString(instrument, stringNumber);
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


