import state from "./state";
import {drawFretBoard} from "../components/fretboard";
import {drawPiano, controllers} from "../components/piano";


function resetPianoClickHandlers() {
  while (controllers.length > 0) {
    controllers.pop().abort();
  }
}

export function redrawPiano() {
  setTimeout(() => {
    resetPianoClickHandlers();
    drawPiano(state);
  }, 0);
}

export function redrawFretboard() {
  setTimeout(() => drawFretBoard(state.chordRootNumber, state.chordInterval, state.instrument), 0);
}

export function redrawAll() {
  redrawFretboard();
  redrawPiano();
}
