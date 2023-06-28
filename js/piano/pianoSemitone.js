import { pianoKeyStyles } from "./pianoKey";
import { toneColors } from "../shared/theme";
import { drawEllipse, getRandomColor, isolate } from "../shared/utils";

export class PianoSemiTone {
  path;

  constructor(rootKeyIndex, chordSemitone) {
    this.label = chordSemitone.label;
    this.position = chordSemitone.position;

    const keyIndex = rootKeyIndex + chordSemitone.position;
    this.xPosition =
      keyIndex * pianoKeyStyles.keyWidth + pianoKeyStyles.keyWidth / 2;
    this.yPosition = pianoKeyStyles.keyHeight + 20;
  }

  contains(ctx, x, y) {
    if (!this.path) {
      return false;
    }

    return ctx.isPointInPath(this.path, x, y);
  }

  drawShape(ctx, isActive) {
    const fillStyle = isActive ? toneColors[this.label] : "lightgray";
    const strokeStyle = isActive ? "black" : "lightgray";
    return drawEllipse(ctx, this.xPosition, this.yPosition, 0, fillStyle, strokeStyle);
  }

  writeLabel(ctx) {
    isolate(ctx, () => {
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(this.label, this.xPosition, this.yPosition + 2);
    });
  }

  draw(ctx, isActive) {
    this.path = this.drawShape(ctx, isActive);
    this.writeLabel(ctx);
  }
}
