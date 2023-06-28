import { circleFillColors } from "../shared/theme";
import {ACCIDENTAL_SIDE} from "../shared/constants";
import {CircleSector} from "./circleSector";

export class KeySector {
  constructor(circlePositionIndex, key, formatConfig) {
    this.key = key;
    this.circlePositionIndex = circlePositionIndex;
    this.sector = new CircleSector(circlePositionIndex, formatConfig.radii[0], formatConfig.radii[1]);
    this.labelFonts = formatConfig.labelFonts;
    this.superscriptFont = formatConfig.superscriptFont;
    this.shadeColor = formatConfig.shadeColor;
    this.labelColor = formatConfig.labelColor;
  }

  draw(ctx, showChordsInKey, currentActiveKey) {
    const isKeyActive = this.key.is(currentActiveKey);
    const isChordInKey = this.key.isAChordInKey(currentActiveKey);

    if (showChordsInKey && isChordInKey) {
      this.#shade(ctx);
    }
    if (isKeyActive) {
      this.#highlight(ctx);
    }
    this.#drawBorder(ctx);
    this.#writeLabel(ctx);
    if (isKeyActive) {
      this.#writeCornerNumber(ctx, currentActiveKey);
    }
    if (showChordsInKey && isChordInKey) {
      this.#writeCornerNumber(ctx, currentActiveKey);
    }
  }

  #highlight(ctx) {
    this.sector.fill(ctx, circleFillColors.active);
  }

  #shade(ctx, fillStyle) {
    this.sector.fill(ctx, fillStyle || this.shadeColor);
  }

  #drawBorder(ctx, strokeStyle = "lightgray") {
    this.sector.outline(ctx, "2", strokeStyle);
  }

  #writeLabel(ctx) {
    const keyLabels = this.key.getLabel(this.#getAccidentalSide()).split(" ");

    this.sector.label(
      ctx,
      keyLabels,
      this.labelFonts,
      this.labelColor
    );
  }

  #writeCornerNumber(ctx, currentActiveKey, fillStyle = "black") {
    drawOnTop(() =>
      this.sector.superscript(
        ctx,
        this.key.relativeScaleDegree(currentActiveKey),
        this.superscriptFont,
        fillStyle
      )
    );
  }

  #getAccidentalSide() {
    if (this.circlePositionIndex < 3) {
      return ACCIDENTAL_SIDE.sharp;
    } else if (this.circlePositionIndex === 3) {
      return ACCIDENTAL_SIDE.both;
    } else {
      return ACCIDENTAL_SIDE.flat;
    }
  }
}

function drawOnTop(expression) {
  setTimeout(expression, 0);
}
