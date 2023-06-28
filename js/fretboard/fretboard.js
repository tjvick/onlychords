import {allSemitones} from "../shared/constants";
import { isolatedTranslate } from "../shared/utils";
import { getFretboardString } from "./fretboardString";
import { fretboardStyles } from "./shared";
import { FretboardFret } from "./fretboardFret";
import { FretboardSemitone } from "./fretboardSemitone";
import {ClickableCanvas} from "../shared/canvas";

const canvasSize = {
  width: 1200,
  height: 300,
  scaleFactor: 2,
};

export class Fretboard {
  constructor(instrument) {
    this.clickCanvas = new ClickableCanvas("fretboard-canvas", canvasSize.width, canvasSize.height, canvasSize.scaleFactor);
    this.ctx = this.clickCanvas.ctx;
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

  drawSemitones(chordRootNumber, activeTones) {
    activeTones.forEach((activeTone) => {
      const semitone = allSemitones.find(
        (note) => note.position === activeTone
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
    const { chordRootNumber, activeTones } = state;

    const onFretboard = isolatedTranslate(
      fretboardStyles.offsetX,
      fretboardStyles.offsetY
    );
    onFretboard(this.ctx, () => {
      this.drawStrings();
      this.drawFrets();
      this.drawSemitones(chordRootNumber, activeTones);
    });
  }
}
