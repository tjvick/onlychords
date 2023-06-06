import {constructScaledCanvas, getRandomColor, isolate} from "../shared/utils";
import {CircleClickCanvas} from "./circleClickCanvas";
import {redrawAll} from "../shared/commands";
import state from "../shared/state";

const canvasSize = {
  width: 500,
  height: 500,
  scaleFactor: 2,
}

const majorLabels = ['A', 'E', 'B', 'G♭/F#', 'D♭', 'A♭', 'E♭', 'B♭', 'F', 'C', 'G', 'D'];
const minorLabels = ['f#', 'c#', 'g#', 'e♭/d#', 'b♭', 'f', 'c', 'g', 'd', 'a', 'e', 'b'];

const styles = {
  centerX: 250,
  centerY: 250,
  innerRadius: 120,
  middleRadius: 170,
  outerRadius: 220,
  innerTextRadius: 145,
  outerTextRadius: 195,
}

export class CircleOfFifths {
  canvas;
  ctx;
  abortControllers = [];

  constructor () {
    [this.canvas, this.ctx] = constructScaledCanvas("circle-canvas", canvasSize);

    this.clickCanvas = new CircleClickCanvas(canvasSize);
  }

  drawRing(ctx) {
    isolate(ctx, () => {
      ctx.beginPath();
      ctx.arc(styles.centerX, styles.centerY, styles.innerRadius, 0, 2*Math.PI)
      ctx.lineWidth = "2";
      ctx.strokeStyle = "lightgray";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(styles.centerX, styles.centerY, styles.middleRadius, 0, 2*Math.PI)
      ctx.lineWidth = "2";
      ctx.strokeStyle = "lightgray";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(styles.centerX, styles.centerY, styles.outerRadius, 0, 2*Math.PI)
      ctx.lineWidth = "2";
      ctx.strokeStyle = "lightgray";
      ctx.stroke();
    })
  }

  drawDividers(ctx) {
    isolate(ctx, () => {
      const offset = 2*Math.PI / 24;
      for (let ix=0; ix<12; ix++) {
        let angle = ix * (2*Math.PI / 12) + offset;
        const innerPointX = styles.innerRadius * Math.cos(angle) + styles.centerX;
        const innerPointY = styles.innerRadius * Math.sin(angle) + styles.centerY;
        const outerPointX = styles.outerRadius * Math.cos(angle) + styles.centerX;
        const outerPointY = styles.outerRadius * Math.sin(angle) + styles.centerY;
        ctx.beginPath();
        ctx.moveTo(innerPointX, innerPointY);
        ctx.lineTo(outerPointX, outerPointY);
        ctx.lineWidth = "2";
        ctx.strokeStyle = "lightgray";
        ctx.stroke();
      }
    })
  }

  fillDonutSlice(ctx, clockAngle, innerRadius, outerRadius, fillStyle) {
    const angle = -clockAngle * 2 * Math.PI / 12;
    const offset = 2 * Math.PI / 24;

    isolate(ctx, () => {
      ctx.beginPath();
      ctx.arc(styles.centerX, styles.centerY, innerRadius, angle-offset, angle+offset);
      const outerPointX = outerRadius * Math.cos(angle+offset) + styles.centerX;
      const outerPointY = outerRadius * Math.sin(angle+offset) + styles.centerY;
      ctx.lineTo(outerPointX, outerPointY);
      ctx.arc(styles.centerX, styles.centerY, outerRadius, angle+offset, angle-offset, true);
      ctx.fillStyle = fillStyle;
      ctx.fill();
    })
  }

  fillActiveKey(ctx, chordRootNumber, chordQuality) {
    if (chordQuality === "major") {
      const clockAngle = (chordRootNumber * 5 ) % 12;
      this.fillDonutSlice(ctx, clockAngle, styles.middleRadius, styles.outerRadius, "green");
    } else {
      const clockAngle = (3 + chordRootNumber * 5 ) % 12;
      this.fillDonutSlice(ctx, clockAngle, styles.innerRadius, styles.middleRadius, "green");
    }
  }

  drawInvisibleKeyButtons(ctx) {
    majorLabels.forEach((label, clockAngle) => {
      const color = getRandomColor();
      this.fillDonutSlice(ctx, -clockAngle, styles.middleRadius, styles.outerRadius, color);
      this.clickCanvas.registerKeyButton(label, color);
    })

    minorLabels.forEach((label, clockAngle) => {
      const color = getRandomColor();
      this.fillDonutSlice(ctx, -clockAngle, styles.innerRadius, styles.middleRadius, color);
      this.clickCanvas.registerKeyButton(label, color);
    })
  }

  writeLabels(ctx) {
    isolate(ctx, () => {
      ctx.font = "24px serif";
      ctx.textAlign = "center";
      majorLabels.forEach((label, ix) => {
        const angle = ix * (2*Math.PI / 12);
        const x = styles.outerTextRadius * Math.cos(angle) + styles.centerX;
        const y = styles.outerTextRadius * Math.sin(angle) + styles.centerY + 8;
        ctx.fillText(label, x, y);
      })

      minorLabels.forEach((label, ix) => {
        const angle = ix * (2*Math.PI / 12);
        const x = styles.innerTextRadius * Math.cos(angle) + styles.centerX;
        const y = styles.innerTextRadius * Math.sin(angle) + styles.centerY + 8;
        ctx.fillText(label, x, y);
      })
    })
  }

  writeRingLabels(ctx) {
    isolate(ctx, () => {
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.fillText("Major", styles.centerX, styles.centerY - styles.outerRadius - 20 + 8);
      ctx.fillText("Minor", styles.centerX, styles.centerY - styles.innerRadius + 20 + 8);
    })
  }

  circleClickHandler() {
    const clickCanvas = this.clickCanvas;

    return function handleCircleClick(event) {
      const clickedKey = clickCanvas.getClickedKey(event);
      if (clickedKey) {
        if (clickedKey.toUpperCase() === clickedKey) {
          const clockAngle = majorLabels.indexOf(clickedKey);
          const chordRootNumber = ((12 - clockAngle) * 5) % 12;
          state.chordQuality = "major";
          state.chordRootNumber = chordRootNumber;
        } else {
          const clockAngle = minorLabels.indexOf(clickedKey);
          const chordRootNumber = ((21 - clockAngle) * 5) % 12;
          state.chordQuality = "minor";
          state.chordRootNumber = chordRootNumber;
        }
        redrawAll();
      }
    }
  }

  clearEventListeners() {
    while (this.abortControllers.length > 0) {
      this.abortControllers.pop().abort();
    }
  }

  addClickEventListener() {
    const abortController = new AbortController();
    this.abortControllers.push(abortController);
    this.canvas.addEventListener("click", this.circleClickHandler(), {
      signal: abortController.signal,
    });
  }


  draw(state) {
    const {chordRootNumber, chordQuality} = state;

    this.drawRing(this.ctx);
    this.drawDividers(this.ctx);
    this.fillActiveKey(this.ctx, chordRootNumber, chordQuality);
    this.writeLabels(this.ctx);
    this.writeRingLabels(this.ctx);
    this.drawInvisibleKeyButtons(this.clickCanvas.ctx);

    this.clearEventListeners();
    this.addClickEventListener();
  }
}
