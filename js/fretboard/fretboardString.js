import { isolate } from "../shared/utils";
import { fretboardStyles, getFretPosition } from "./shared";

class SingledFretboardString {
  constructor(instrument, stringNumber) {
    this.instrument = instrument;
    this.stringNumber = stringNumber;
    this.label = instrument.stringLabels[stringNumber];
  }

  getYPosition() {
    let outerBuffer = 5;
    const stringsWidth = fretboardStyles.neckWidth - 2 * outerBuffer;
    const stringSpacing = stringsWidth / (this.instrument.nStrings - 1);
    return outerBuffer + this.stringNumber * stringSpacing;
  }

  drawLine(ctx) {
    const y = this.getYPosition();
    const xLastFret = getFretPosition(this.instrument.nFrets);
    const xEnd = xLastFret + 15;
    isolate(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(xEnd, y);
      ctx.stroke();
    });
  }

  writeLabel(ctx) {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, -40, this.getYPosition() + 2);
  }

  draw(ctx) {
    this.drawLine(ctx);
    this.writeLabel(ctx);
  }
}

class DoubledFretboardString extends SingledFretboardString {
  constructor(instrument, stringNumber) {
    super(instrument, stringNumber);
  }

  getYPosition() {
    const outerBuffer = 10;
    const stringsWidth = fretboardStyles.neckWidth - 2 * outerBuffer;
    const stringSpacing = stringsWidth / (this.instrument.nStrings - 1);
    return outerBuffer + this.stringNumber * stringSpacing;
  }

  drawLine(ctx) {
    const y = this.getYPosition();
    const xLastFret = getFretPosition(this.instrument.nFrets);
    const xEnd = xLastFret + 15;
    isolate(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(0, y - 5);
      ctx.lineTo(xEnd, y - 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y + 5);
      ctx.lineTo(xEnd, y + 5);
      ctx.stroke();
    });
  }
}

export function getFretboardString(instrument, stringNumber) {
  switch (instrument.doubleStrings) {
    case true:
      return new DoubledFretboardString(instrument, stringNumber);
    default:
      return new SingledFretboardString(instrument, stringNumber);
  }
}
