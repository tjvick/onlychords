import {pianoKeyStyles} from "./pianoKey";
import {toneColors} from "../shared/theme";
import {getRandomColor, isolate} from "../shared/utils";

const ellipseWidth = 16;
const ellipseHeight = 10;

export class PianoSemiTone {
  constructor(rootKeyIndex, chordSemitone) {
    this.label = chordSemitone.label;

    const keyIndex = rootKeyIndex + chordSemitone.position
    this.xPosition = (keyIndex * pianoKeyStyles.keyWidth) + pianoKeyStyles.keyWidth / 2;
    this.yPosition = pianoKeyStyles.keyHeight + 20;

    this.invisibleColor = getRandomColor();
  }

  drawEllipse(ctx, fillStyle, strokeStyle, buffer = 0) {
    isolate(ctx, () => {
      ctx.beginPath();
      ctx.ellipse(this.xPosition, this.yPosition, ellipseWidth + buffer, ellipseHeight + buffer, 0, 0, Math.PI * 2);
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    })
  }

  drawVisibleShape(ctx, isActive) {
    const fillStyle = isActive ? toneColors[this.label] : "lightgray";
    const strokeStyle = isActive ? "black" : "gray";
    this.drawEllipse(ctx, fillStyle, strokeStyle);
  }

  drawInvisibleShape(ctx) {
    this.drawEllipse(ctx, this.invisibleColor, this.invisibleColor, 3);
  }

  drawShape(visibleCtx, invisibleCtx, isActive) {
    this.drawVisibleShape(visibleCtx, isActive);
    this.drawInvisibleShape(invisibleCtx);
  }

  writeLabel(ctx) {
    isolate(ctx, () => {
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.fillText(this.label, this.xPosition, this.yPosition + 2)
    })
  }

  draw(visibleCtx, invisibleCtx, isActive) {
    this.drawShape(visibleCtx, invisibleCtx, isActive);
    this.writeLabel(visibleCtx);
    return this.invisibleColor;
  }
}
