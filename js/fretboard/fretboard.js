import { chordSemitones } from "../shared/constants";
import { constructScaledCanvas, isolatedTranslate } from "../shared/utils";
import { getFretboardString } from "./fretboardString";
import { fretboardStyles } from "./shared";
import { FretboardFret } from "./fretboardFret";
import { FretboardSemitone } from "./fretboardSemitone";

const canvasSize = {
  width: 1200,
  height: 300,
  scaleFactor: 2,
};

export class Fretboard {
  constructor(instrument) {
    let [_, ctx] = constructScaledCanvas("fretboard-canvas", canvasSize);
    this.ctx = ctx;
    this.instrument = instrument;
  }

  drawStrings() {
    for (
      let stringNumber = 0;
      stringNumber < this.instrument.nStrings;
      stringNumber++
    ) {
      const fretboardString = getFretboardString(this.instrument, stringNumber);
      fretboardString.draw(this.ctx);
    }
  }

  drawFrets() {
    for (
      let fretNumber = 0;
      fretNumber <= this.instrument.nFrets;
      fretNumber++
    ) {
      const fret = new FretboardFret(fretNumber);
      fret.draw(this.ctx);
    }
  }

  drawSemitones(chordRootNumber, chordQuality, activeTones) {
    activeTones.forEach((activeTone) => {
      const semitone = chordSemitones[chordQuality].find(
        (note) => note.label === activeTone
      );
      const fretboardSemitone = new FretboardSemitone(
        this.instrument,
        chordRootNumber,
        semitone
      );
      fretboardSemitone.draw(this.ctx);
    });
  }

  draw(state) {
    const { chordRootNumber, chordQuality, activeTones } = state;

    const onFretboard = isolatedTranslate(
      fretboardStyles.offsetX,
      fretboardStyles.offsetY
    );
    onFretboard(this.ctx, () => {
      this.drawStrings();
      this.drawFrets();
      this.drawSemitones(chordRootNumber, chordQuality, activeTones);
    });
  }
}
