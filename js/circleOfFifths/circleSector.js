import { isolate } from "../shared/utils";
import { circleStyles } from "./shared";

export class CircleSector {
  semiArcLength = Math.PI / 12;
  cx = circleStyles.centerX;
  cy = circleStyles.centerY;

  constructor(positionIndex, innerRadius, outerRadius) {
    this.angle = (positionIndex * 2 * Math.PI) / 12;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.textRadius = (innerRadius + outerRadius) / 2;

    this.path = this.buildPath();
  }

  contains(ctx, x, y) {
    return ctx.isPointInPath(this.path, x, y);
  }

  buildPath() {
    const arcStartAngle = this.angle - this.semiArcLength;
    const arcEndAngle = this.angle + this.semiArcLength;
    const innerPointX = this.innerRadius * Math.cos(arcStartAngle) + this.cx;
    const innerPointY = this.innerRadius * Math.sin(arcStartAngle) + this.cy;
    const outerPointX = this.outerRadius * Math.cos(arcEndAngle) + this.cx;
    const outerPointY = this.outerRadius * Math.sin(arcEndAngle) + this.cy;

    const path = new Path2D();
    path.arc(this.cx, this.cy, this.innerRadius, arcStartAngle, arcEndAngle);
    path.lineTo(outerPointX, outerPointY);
    path.arc(
      this.cx,
      this.cy,
      this.outerRadius,
      arcEndAngle,
      arcStartAngle,
      true
    );
    path.lineTo(innerPointX, innerPointY);

    return path;
  }

  fill(ctx, fillStyle) {
    isolate(ctx, () => {
      ctx.fillStyle = fillStyle;
      ctx.fill(this.path);
    });
  }

  outline(ctx, lineWidth, strokeStyle) {
    isolate(ctx, () => {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.stroke(this.path);
    });
  }

  label(ctx, labelLines, fonts, fillStyle) {
    isolate(ctx, () => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = fillStyle;
      const textX = this.textRadius * Math.cos(this.angle) + this.cx;
      const textY = this.textRadius * Math.sin(this.angle) + this.cy;

      const nLines = labelLines.length;
      const textHeight = 16;
      const textTop = textY - (textHeight / 2) * (nLines - 1);

      labelLines.forEach((labelLine, ixLine) => {
        ctx.font = fonts[ixLine];
        ctx.fillText(labelLine, textX, textTop + ixLine * textHeight);
      });
    });
  }

  superscript(ctx, text, font, fillStyle) {
    isolate(ctx, () => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = fillStyle;
      ctx.font = font;
      const superscriptAngle = this.angle + this.semiArcLength - Math.PI / 42;
      const superscriptRadius = this.outerRadius - 12;
      const x = superscriptRadius * Math.cos(superscriptAngle) + this.cx;
      const y = superscriptRadius * Math.sin(superscriptAngle) + this.cy;
      ctx.fillText(text, x, y);
    });
  }
}
