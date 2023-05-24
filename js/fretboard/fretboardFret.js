import {fretboardStyles, getFretPosition} from "./shared";
import {isolate} from "../shared/utils";

export class FretboardFret {
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
