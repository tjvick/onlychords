import {fretboardStyles, getFretPosition, getStringYPosition} from "./shared";
import { isolate } from "../shared/utils";

export class FretboardFret {
  constructor(instrument, fretNumber) {
    this.instrument = instrument;
    this.fretNumber = fretNumber;
    this.fretPosition = getFretPosition(fretNumber);
  }

  getNeckWidth() {
    const nStringsOnNeckHere = this.instrument.startingFrets.filter(startingFret => startingFret <= this.fretNumber).length;
    const neckWidth = getStringYPosition(nStringsOnNeckHere-1, this.instrument.nStrings);
    return neckWidth + fretboardStyles.neckEdgeBuffer;
  }

  drawNutLine(ctx) {
    const stringsStartingHere = this.instrument.startingFrets.filter(startingFret => startingFret === this.fretNumber);
    const firstStringStartingHere = this.instrument.startingFrets.indexOf(this.fretNumber);
    const nStringsStartingHere = stringsStartingHere.length;
    if (nStringsStartingHere > 0) {
      const yStartNut = getStringYPosition(firstStringStartingHere, this.instrument.nStrings);
      const yEndNut = getStringYPosition(firstStringStartingHere+nStringsStartingHere-1, this.instrument.nStrings);

      isolate(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(this.fretPosition, yStartNut - fretboardStyles.neckEdgeBuffer);
        ctx.lineTo(this.fretPosition, yEndNut + fretboardStyles.neckEdgeBuffer);
        ctx.lineWidth = fretboardStyles.nutCapoThickness;
        ctx.stroke();
      });
    }
  }

  drawLine(ctx) {
    isolate(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(this.fretPosition, 0);
      ctx.lineTo(this.fretPosition, this.getNeckWidth());
      ctx.lineWidth =
        this.fretNumber === 100
          ? fretboardStyles.nutCapoThickness
          : fretboardStyles.fretThickness;
      ctx.stroke();
    });
  }

  writeLabel(ctx) {
    isolate(ctx, () => {
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `${this.fretNumber}`,
        this.fretPosition,
        fretboardStyles.neckWidth + 20
      );
    });
  }

  draw(ctx) {
    this.drawLine(ctx);
    this.drawNutLine(ctx);
    this.writeLabel(ctx);
  }
}
