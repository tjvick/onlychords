import state from "./state";
import { Piano } from "../piano/piano";
import { Fretboard } from "../fretboard/fretboard";
import { CircleOfFifths } from "../circleOfFifths/circle";

const circleOfFifths = new CircleOfFifths();

export function redrawAll() {
  console.log("redrawing Piano");
  new Piano().draw(state);
  console.log("redrawing Fretboard");
  new Fretboard(state.instrument).draw(state);
  console.log("redrawing Circle");
  circleOfFifths.draw(state);
}

export function redrawFretboard() {
  new Fretboard(state.instrument).draw(state);
}

export function redrawCircle() {
  circleOfFifths.draw(state);
}
