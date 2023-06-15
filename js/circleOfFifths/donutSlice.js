import { isolate } from "../shared/utils";
import { circleStyles } from "./shared";
import {isChrome} from "../shared/global";

export class DonutSlice {
  semiArcLength = Math.PI / 12;

  constructor(positionIndex, innerRadius, outerRadius) {
    this.angle = (positionIndex * 2 * Math.PI) / 12;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.textRadius = (innerRadius + outerRadius) / 2;
  }

  buildPath(ctx) {
    isolate(ctx, () => {
      const arcStartAngle = this.angle - this.semiArcLength;
      const arcEndAngle = this.angle + this.semiArcLength;
      ctx.beginPath();
      ctx.arc(
        circleStyles.centerX,
        circleStyles.centerY,
        this.innerRadius,
        arcStartAngle,
        arcEndAngle
      );
      const outerPointX =
        this.outerRadius * Math.cos(arcEndAngle) + circleStyles.centerX;
      const outerPointY =
        this.outerRadius * Math.sin(arcEndAngle) + circleStyles.centerY;
      ctx.lineTo(outerPointX, outerPointY);
      ctx.arc(
        circleStyles.centerX,
        circleStyles.centerY,
        this.outerRadius,
        arcEndAngle,
        arcStartAngle,
        true
      );
      const innerPointX =
        this.innerRadius * Math.cos(arcStartAngle) + circleStyles.centerX;
      const innerPointY =
        this.innerRadius * Math.sin(arcStartAngle) + circleStyles.centerY;
      ctx.lineTo(innerPointX, innerPointY);
    });
  }

  fill(ctx, fillStyle) {
    isolate(ctx, () => {
      this.buildPath(ctx);
      ctx.fillStyle = fillStyle;
      ctx.fill();
    });
  }

  outline(ctx, lineWidth, strokeStyle) {
    isolate(ctx, () => {
      this.buildPath(ctx);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    });
  }

  label(ctx, labelLines, fonts, fillStyle) {
    isolate(ctx, () => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = fillStyle;
      ctx.letterSpacing = "0px";
      const x = this.textRadius * Math.cos(this.angle) + circleStyles.centerX;
      const y = this.textRadius * Math.sin(this.angle) + circleStyles.centerY;
      const nLines = labelLines.length;
      const textHeight = 16;
      const top = y - (textHeight / 2) * (nLines - 1);

      labelLines.forEach((labelLine, ixLine) => {
        ctx.font = fonts[ixLine];
        if (isChrome) {
          if (labelLine.includes("♭")) {
            labelLine = labelLine.replace("♭", " ♭ ").trim();
            ctx.wordSpacing = "-10px"
          } else {
            ctx.wordSpacing = "0px";
          }
        }
        ctx.fillText(labelLine, x, top + ixLine * textHeight);
      });
    });
  }

  superscript(ctx, text, font, fillStyle) {
    isolate(ctx, () => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillSTyle = fillStyle;
      ctx.font = font;
      const superscriptAngle = this.angle + this.semiArcLength - Math.PI / 44;
      const superscriptRadius = this.outerRadius - 12;
      const x =
        superscriptRadius * Math.cos(superscriptAngle) + circleStyles.centerX;
      const y =
        superscriptRadius * Math.sin(superscriptAngle) + circleStyles.centerY;
      ctx.fillText(text, x, y);
    });
  }
}
