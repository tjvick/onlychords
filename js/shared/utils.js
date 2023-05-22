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
    })
  }
}

export function getRandomColor() {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

export function scaleCanvas(canvasSize, canvasElement, context) {
  canvasElement.width = canvasSize.width * canvasSize.scaleFactor;
  canvasElement.height = canvasSize.height * canvasSize.scaleFactor;
  context.scale(canvasSize.scaleFactor, canvasSize.scaleFactor);
}
