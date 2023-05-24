import state from "./state";
import {Piano} from "../piano/piano";
import {Fretboard} from "../fretboard/fretboard";

export function redrawAll() {
  new Piano().draw(state);
  new Fretboard().draw(state);
}
