import { isolate } from "../shared/utils";
import { noteFromIndex } from "../shared/note";
import { font } from "../shared/theme";

export const pianoKeyStyles = {
  keyHeight: 60,
  keyWidth: 46,
  textHeight: 20,
};

function keyColor(isAccidental, isHighlighted) {
  return isAccidental
    ? isHighlighted
      ? "black"
      : "rgba(160, 160, 160)"
    : isHighlighted
    ? "ivory"
    : "rgb(231, 231, 231)";
}

function keyLabelColor(isAccidental, isHighlighted) {
  return isAccidental
    ? isHighlighted
      ? "white"
      : "rgb(231, 231, 231)"
    : isHighlighted
    ? "black"
    : "rgb(80, 80, 80)";
}

function keyOutlineColor(isHighlighted) {
  return isHighlighted ? "rgb(80, 80, 80)" : "rgb(150, 150, 150)";
}

export class PianoKey {
  constructor(index) {
    this.index = index;
    this.note = noteFromIndex(index);
    this.xPosition = index * pianoKeyStyles.keyWidth;
    this.yPosition = 20;
  }

  isHighlighted(chordRootNumber) {
    return chordRootNumber <= this.index && this.index <= chordRootNumber + 12;
  }

  textStartingYPosition() {
    const centerLine = this.yPosition + pianoKeyStyles.keyHeight / 2;
    const nLines = this.note.getAllLabels().length - 1;
    return centerLine - (pianoKeyStyles.textHeight / 2) * nLines;
  }

  writeLabel(ctx, chordRootNumber) {
    const textXPosition = this.xPosition + pianoKeyStyles.keyWidth / 2;
    const textYPosition = this.textStartingYPosition();
    const isHighlighted = this.isHighlighted(chordRootNumber);

    isolate(ctx, () => {
      ctx.font = `16px ${font.note}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = keyLabelColor(this.note.isAccidental, isHighlighted);
      this.note.getAllLabels().forEach((labelText, ixLabel) => {
        const labelYPosition =
          textYPosition + ixLabel * pianoKeyStyles.textHeight;
        ctx.fillText(labelText, textXPosition, labelYPosition);
      });
    });
  }

  drawShape(ctx, chordRootNumber) {
    const isHighlighted = this.isHighlighted(chordRootNumber);

    isolate(ctx, () => {
      ctx.beginPath();
      ctx.rect(
        this.xPosition,
        this.yPosition,
        pianoKeyStyles.keyWidth,
        pianoKeyStyles.keyHeight
      );
      ctx.fillStyle = keyColor(this.note.isAccidental, isHighlighted);
      ctx.fill();
      ctx.strokeStyle = keyOutlineColor(isHighlighted);
      ctx.stroke();
    });
  }

  draw(ctx, chordRootNumber) {
    this.drawShape(ctx, chordRootNumber);
    this.writeLabel(ctx, chordRootNumber);
  }
}
