import state from "./state";
import {drawFretBoard} from "../components/fretboard";

export function redrawFretboard() {
  setTimeout(() => drawFretBoard(state.chordRootNumber, state.chordQuality, state.instrument), 0);
}

export function redrawAll(piano) {
  redrawFretboard();
  piano.draw(state);
}
