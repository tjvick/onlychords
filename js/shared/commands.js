import state from "./state";
import {Piano} from "../piano/piano";
import {Fretboard} from "../components/fretboard";

export function redrawAll() {
  new Piano().draw(state);
  new Fretboard().draw(state);
}
