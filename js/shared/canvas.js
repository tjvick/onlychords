import { isolate } from "./utils";

export class ClickableCanvas {
  #abortControllers = [];

  constructor(id, width, height, scaleFactor) {
    const canvasElement = document.getElementById(id);
    const context = canvasElement.getContext("2d");

    canvasElement.width = width * scaleFactor;
    canvasElement.height = height * scaleFactor;
    context.scale(scaleFactor, scaleFactor);

    this.canvas = canvasElement;
    this.ctx = context;
  }

  reset() {
    this.#whiteOut();
    this.#clearClickHandlers();
  }

  addClickHandler(handlerFunction) {
    const abortController = new AbortController();
    this.#abortControllers.push(abortController);
    this.canvas.addEventListener("click", handlerFunction, {
      signal: abortController.signal,
    });
  }

  #whiteOut() {
    isolate(this.ctx, () => {
      this.ctx.beginPath();
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "white";
      this.ctx.fill();
    });
  }

  #clearClickHandlers() {
    while (this.#abortControllers.length > 0) {
      this.#abortControllers.pop().abort();
    }
  }
}
