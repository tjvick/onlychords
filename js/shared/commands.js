import state from "./state";
import { Piano } from "../piano/piano";
import { Fretboard } from "../fretboard/fretboard";
import {CircleOfFifths} from "../circleOfFifths/circle";

export function redrawAll() {
  new Piano().draw(state);
  new Fretboard(state.instrument).draw(state);
  new CircleOfFifths().draw(state);
}

export function redrawFretboard() {
  new Fretboard(state.instrument).draw(state);
}

export function redrawCircle() {
  new CircleOfFifths().draw(state);
}
