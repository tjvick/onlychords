export function isolate(ctx, fn) {
  ctx.save();
  fn();
  ctx.restore();
}

export function isolatedTranslate(offsetX, offsetY) {
  return (ctx, fn) => {
    isolate(ctx, () => {
      ctx.translate(offsetX, offsetY);
      fn();
    });
  };
}

const ellipseWidth = 16;
const ellipseHeight = 10;
export function drawEllipse(ctx, x, y, buffer, fillStyle, strokeStyle) {
  const ellipsePath = new Path2D();
  isolate(ctx, () => {
    ellipsePath.ellipse(
      x,
      y,
      ellipseWidth + buffer,
      ellipseHeight + buffer,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = fillStyle;
    ctx.fill(ellipsePath);
    ctx.strokeStyle = strokeStyle;
    ctx.stroke(ellipsePath);
  });
  return ellipsePath;
}
