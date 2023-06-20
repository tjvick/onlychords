import state from "./state";
import { Piano } from "../piano/piano";
import { Fretboard } from "../fretboard/fretboard";
import { CircleOfFifths } from "../circleOfFifths/circle";

const circleOfFifths = new CircleOfFifths();
const piano = new Piano();

export function redrawAll() {
  piano.draw(state);
  new Fretboard(state.instrument).draw(state);
  circleOfFifths.draw(state);
}

export function redrawFretboard() {
  new Fretboard(state.instrument).draw(state);
}

export function redrawCircle() {
  circleOfFifths.draw(state);
}
