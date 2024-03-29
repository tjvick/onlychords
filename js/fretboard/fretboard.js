import { allSemitones } from "../shared/constants";
import { isolatedTranslate } from "../shared/utils";
import { getFretboardString } from "./fretboardString";
import { fretboardStyles } from "./shared";
import { FretboardFret } from "./fretboardFret";
import { FretboardSemitone } from "./fretboardSemitone";
import { ClickableCanvas } from "../shared/canvas";

const canvasSize = {
  width: 1200,
  height: 300,
  scaleFactor: 2,
};

export class Fretboard {
  constructor() {
    this.clickCanvas = new ClickableCanvas(
      "fretboard-canvas",
      canvasSize.width,
      canvasSize.height,
      canvasSize.scaleFactor
    );
    this.ctx = this.clickCanvas.ctx;
  }

  reset() {
    this.clickCanvas.reset();
  }

  drawStrings(instrument, tuning) {
    for (
      let stringNumber = 0;
      stringNumber < instrument.nStrings;
      stringNumber++
    ) {
      const fretboardString = getFretboardString(instrument, tuning, stringNumber);
      fretboardString.draw(this.ctx);
    }
  }

  drawFrets(instrument) {
    for (let fretNumber = 0; fretNumber <= instrument.nFrets; fretNumber++) {
      const fret = new FretboardFret(instrument, fretNumber);
      fret.draw(this.ctx);
    }
  }

  drawSemitones(instrument, tuning, activeKey, activeTones, optionalActiveTones) {
    activeTones.forEach((activeTone) => {
      const semitone = allSemitones.find(
        note => note.position === activeTone
      );
      const isOptional = optionalActiveTones.has(activeTone);
      const fretboardSemitone = new FretboardSemitone(
        instrument,
        tuning,
        activeKey.rootNote.index,
        semitone,
        isOptional
      );
      fretboardSemitone.draw(this.ctx);
    });
  }

  draw(state) {
    const { activeKey, activeTones, instrument, optionalActiveTones, tuning } = state;

    this.reset();

    const onFretboard = isolatedTranslate(
      fretboardStyles.offsetX,
      fretboardStyles.offsetY
    );
    onFretboard(this.ctx, () => {
      this.drawStrings(instrument, tuning);
      this.drawFrets(instrument);
      this.drawSemitones(
        instrument,
        tuning,
        activeKey,
        activeTones,
        optionalActiveTones
      );
    });
  }
}
