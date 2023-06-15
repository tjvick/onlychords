import { notes } from "../shared/constants";
import { circleStyles } from "./shared";
import { DonutSlice } from "./donutSlice";
import { KeyAreaLabel } from "./keyAreaLabel";

class KeyArea {
  constructor(
    positionIndex,
    innerRadius,
    outerRadius,
    keyAreaLabel,
    fonts,
    superscriptFont
  ) {
    this.fonts = fonts;
    this.superscriptFont = superscriptFont;
    this.keyAreaLabel = keyAreaLabel;
    this.donutSlice = new DonutSlice(positionIndex, innerRadius, outerRadius);
  }

  highlight(ctx) {
    this.donutSlice.fill(ctx, "green");
  }

  shade(ctx, fillStyle) {
    this.donutSlice.fill(ctx, fillStyle);
  }

  drawBorder(ctx) {
    this.donutSlice.outline(ctx, "2", "lightgray");
  }

  writeLabel(ctx, fillStyle = "black") {
    this.donutSlice.label(
      ctx,
      this.keyAreaLabel.getLabels(),
      this.fonts,
      fillStyle
    );
  }

  writeCornerNumber(ctx, fillStyle = "black") {
    this.donutSlice.superscript(
      ctx,
      this.keyAreaLabel.getRelativeToneNumber(),
      this.superscriptFont,
      fillStyle
    );
  }
}

export class MajorKeyArea extends KeyArea {
  constructor(chordRootNumber, nSemitonesFromRoot) {
    const positionIndex = (chordRootNumber * 7) % 12;
    const note = notes[chordRootNumber % 12];
    const keyAreaLabel = new KeyAreaLabel(
      chordRootNumber,
      positionIndex,
      "major",
      nSemitonesFromRoot
    );
    super(
      positionIndex,
      circleStyles.middleRadius,
      circleStyles.outerRadius,
      keyAreaLabel,
      ["26px serif"],
      "15px serif"
    );
    this.note = note;
  }
}

export class MinorKeyArea extends KeyArea {
  constructor(chordRootNumber, nSemitonesFromRoot) {
    const positionIndex = (9 + chordRootNumber * 7) % 12;
    const note = notes[chordRootNumber % 12];
    const keyAreaLabel = new KeyAreaLabel(
      chordRootNumber,
      positionIndex,
      "minor",
      nSemitonesFromRoot
    );
    super(
      positionIndex,
      circleStyles.innerRadius,
      circleStyles.middleRadius,
      keyAreaLabel,
      ["23px serif"],
      "15px serif"
    );
    this.note = note;
  }
}

export class DiminishedKeyArea extends KeyArea {
  constructor(chordRootNumber, nSemitonesFromRoot) {
    const positionIndex = (7 + chordRootNumber * 7) % 12;
    const note = notes[chordRootNumber % 12];
    const keyAreaLabel = new KeyAreaLabel(
      chordRootNumber,
      positionIndex,
      "diminished",
      nSemitonesFromRoot
    );
    super(
      positionIndex,
      circleStyles.innerInnerRadius,
      circleStyles.innerRadius,
      keyAreaLabel,
      ["20px serif", "16px serif"],
      "15px serif"
    );
    this.note = note;
  }
}
