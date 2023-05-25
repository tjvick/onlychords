import { pianoKeyStyles } from "./pianoKey";
import { toneColors } from "../shared/theme";
import { drawEllipse, getRandomColor, isolate } from "../shared/utils";

export class PianoSemiTone {
  constructor(rootKeyIndex, chordSemitone) {
    this.label = chordSemitone.label;

    const keyIndex = rootKeyIndex + chordSemitone.position;
    this.xPosition =
      keyIndex * pianoKeyStyles.keyWidth + pianoKeyStyles.keyWidth / 2;
    this.yPosition = pianoKeyStyles.keyHeight + 20;

    this.invisibleColor = getRandomColor();
  }

  drawVisibleShape(ctx, isActive) {
    const fillStyle = isActive ? toneColors[this.label] : "lightgray";
    const strokeStyle = isActive ? "black" : "gray";
    drawEllipse(ctx, this.xPosition, this.yPosition, 0, fillStyle, strokeStyle);
  }

  drawInvisibleShape(ctx) {
    drawEllipse(
      ctx,
      this.xPosition,
      this.yPosition,
      3,
      this.invisibleColor,
      this.invisibleColor
    );
  }

  drawShape(visibleCtx, invisibleCtx, isActive) {
    this.drawVisibleShape(visibleCtx, isActive);
    this.drawInvisibleShape(invisibleCtx);
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

  draw(visibleCtx, invisibleCtx, isActive) {
    this.drawShape(visibleCtx, invisibleCtx, isActive);
    this.writeLabel(visibleCtx);
    return this.invisibleColor;
  }
}
