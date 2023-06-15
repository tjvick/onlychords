import state from "./state";
import { Piano } from "../piano/piano";
import { Fretboard } from "../fretboard/fretboard";
import { CircleOfFifths } from "../circleOfFifths/circle";

export function redrawAll() {
  console.log("redrawing Piano");
  new Piano().draw(state);
  console.log("redrawing Fretboard");
  new Fretboard(state.instrument).draw(state);
  console.log("redrawing Circle");
  new CircleOfFifths().draw(state);
}

export function redrawFretboard() {
  new Fretboard(state.instrument).draw(state);
}

export function redrawCircle() {
  new CircleOfFifths().draw(state);
}
