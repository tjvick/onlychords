import state from "./state";

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
  isolate(ctx, () => {
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      ellipseWidth + buffer,
      ellipseHeight + buffer,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  });
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

export function constructScaledCanvas(elementId, canvasSize) {
  const canvas = document.getElementById(elementId);
  const ctx = canvas.getContext("2d");
  scaleCanvas(canvasSize, canvas, ctx);
  return [canvas, ctx];
}

export function toggleSemitone(clickedSemitone) {
  if (state.activeTones.has(clickedSemitone)) {
    state.activeTones.delete(clickedSemitone);
  } else {
    state.activeTones.add(clickedSemitone);
  }
}

export function setQuality(chordQuality) {
  if (state.chordQuality !== chordQuality) {
    state.chordQuality = chordQuality;
    state.activeTones = chordQuality === 'major'
      ? new Set([0, 4, 7])
      : new Set([0, 3, 7]);
  }
}
