import state from "./state";
import {drawFretBoard} from "../components/fretboard";
import {drawPiano} from "../components/piano";


function resetPianoClickHandlers() {
  const existingCanvas = document.getElementById("piano-canvas");
  const newPianoCanvas = existingCanvas.cloneNode(true);
  existingCanvas.parentNode.replaceChild(newPianoCanvas, existingCanvas);
}

export function redrawPiano() {
  setTimeout(() => {
    resetPianoClickHandlers();
    drawPiano(state)
  }, 0);
}

export function redrawFretboard() {
  setTimeout(() => drawFretBoard(state.chordRootNumber, state.chordInterval, state.instrument), 0);
}

export function redrawAll() {
  redrawFretboard();
  redrawPiano();
}
