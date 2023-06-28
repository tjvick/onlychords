import state from "./state";
import { Piano } from "../piano/piano";
import { Fretboard } from "../fretboard/fretboard";
import { CircleOfFifths } from "../circleOfFifths/circle";

const circleOfFifths = new CircleOfFifths();
const piano = new Piano();
const fretboard = new Fretboard();

export function redrawAll() {
  piano.draw(state);
  fretboard.draw(state);
  circleOfFifths.draw(state);
}

export function redrawFretboard() {
  fretboard.draw(state);
}

export function redrawCircle() {
  circleOfFifths.draw(state);
}
