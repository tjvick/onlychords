import {getFretPosition, getStringYPosition} from "./shared";
import { toneColors } from "../shared/theme";
import { drawEllipse } from "../shared/utils";

export class FretboardSemitone {
  constructor(instrument, chordRootNumber, semitone, isOptional) {
    this.instrument = instrument;
    this.label = semitone.label;
    this.position = semitone.position;
    this.isOptional = isOptional;

    this.noteNumber = (chordRootNumber + semitone.position) % 12;
  }

  draw(ctx) {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (
      let stringNumber = 0;
      stringNumber < this.instrument.nStrings;
      stringNumber++
    ) {
      const stringYPosition = getStringYPosition(stringNumber, this.instrument.nStrings);
      const stringOpenNote = this.instrument.stringTuning[stringNumber];
      for (
        let fretNumber = 0;
        fretNumber < this.instrument.nFrets - this.instrument.startingFrets[stringNumber];
        fretNumber++
      ) {
        const fretXPosition = getFretPosition(fretNumber+this.instrument.startingFrets[stringNumber]);
        const fretNote = (stringOpenNote + fretNumber) % 12;
        if (fretNote === this.noteNumber) {
          drawEllipse(
            ctx,
            fretXPosition,
            stringYPosition,
            0,
            this.isOptional ? "white" : toneColors[this.label],
            "black"
          );

          ctx.fillStyle = "rgb(0, 0, 0)";
          ctx.fillText(this.label, fretXPosition, stringYPosition + 2);
        }
      }
    }
  }
}
