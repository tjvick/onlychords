import {getFretboardString} from "./fretboardString";
import {getFretPosition} from "./shared";
import {toneColors} from "../shared/theme";
import {drawEllipse} from "../shared/utils";

export class FretboardSemitone {
  constructor(instrument, chordRootNumber, semitone) {
    this.instrument = instrument;
    this.label = semitone.label;
    this.position = semitone.position;

    this.noteNumber = (chordRootNumber + semitone.position) % 12;
  }

  draw(ctx) {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"

    for (let stringNumber = 0; stringNumber < this.instrument.nStrings; stringNumber++) {
      const fretboardString = getFretboardString(this.instrument, stringNumber);
      const stringYPosition = fretboardString.getYPosition();
      const stringBaseNote = this.instrument.stringTuning[stringNumber]
      for (let fretNumber = 0; fretNumber < this.instrument.nFrets; fretNumber++) {
        const fretXPosition = getFretPosition(fretNumber);
        const fretNote = (stringBaseNote + fretNumber) % 12;
        if (fretNote === this.noteNumber) {
          drawEllipse(ctx, fretXPosition, stringYPosition, 0, toneColors[this.label], "black")

          ctx.fillStyle = "rgb(0, 0, 0)"
          ctx.fillText(this.label, fretXPosition, stringYPosition + 2)
        }
      }
    }
  }
}
