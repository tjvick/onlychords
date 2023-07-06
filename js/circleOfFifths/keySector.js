import { circleFillColors } from "../shared/theme";
import { ACCIDENTAL_MODE } from "../shared/constants";
import { CircleSector } from "./circleSector";

export class KeySector {
  constructor(circlePositionIndex, key, formatConfig) {
    this.key = key;
    this.circlePositionIndex = circlePositionIndex;
    this.sector = new CircleSector(
      circlePositionIndex,
      formatConfig.radii[0],
      formatConfig.radii[1]
    );
    this.labelFonts = formatConfig.labelFonts;
    this.superscriptFont = formatConfig.superscriptFont;
    this.shadeColor = formatConfig.shadeColor;
  }

  contains(ctx, x, y) {
    const imageData = ctx.getImageData(x, y, 1, 1);
    return this.hasColor(ctx, ...imageData.data);
  }

  hasColor(ctx, r, g, b) {
    return this.shadeColor === `rgba(${r},${g},${b})`
  }

  draw(ctx, currentActiveKey, chordsInKeyVisible) {
    const isKeyActive = this.key.is(currentActiveKey);
    const isChordInKey = this.key.isAChordInKey(currentActiveKey);

    if (chordsInKeyVisible && isChordInKey) {
      // this.#shade(ctx);
    }
    this.#shade(ctx);

    if (isKeyActive) {
      this.#highlight(ctx);
    }
    this.#drawBorder(ctx);
    if (isKeyActive) {
      drawOnTop(() => this.#drawBorder(ctx, "black"));
    }
    this.#writeLabel(ctx);
    if (isKeyActive && chordsInKeyVisible) {
      // this.#writeCornerNumber(ctx, currentActiveKey);
    }
    if (chordsInKeyVisible && isChordInKey) {
      // this.#writeCornerNumber(ctx, currentActiveKey);
    }
  }

  #highlight(ctx) {
    this.sector.fill(ctx, circleFillColors.active);
  }

  #shade(ctx, fillStyle) {
    this.sector.fill(ctx, fillStyle || this.shadeColor);
  }

  #drawBorder(ctx, strokeStyle = "rgb(199, 199, 199)") {
    this.sector.outline(ctx, "2", strokeStyle);
  }

  #writeLabel(ctx) {
    const keyLabels = this.key.getLabel(this.#getAccidentalSide()).split(" ");

    this.sector.label(ctx, keyLabels, this.labelFonts, "black");
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
    if (this.circlePositionIndex < 3 || this.circlePositionIndex > 9) {
      return ACCIDENTAL_MODE.sharp;
    } else if (this.circlePositionIndex === 3) {
      return ACCIDENTAL_MODE.both;
    } else {
      return ACCIDENTAL_MODE.flat;
    }
  }
}

function drawOnTop(expression) {
  setTimeout(expression, 0);
}
