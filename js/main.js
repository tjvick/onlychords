import state from './shared/state';
import {instruments} from "./shared/constants";
import {Piano} from "./piano/piano";
import {Fretboard} from "./fretboard/fretboard";

const piano = new Piano();
piano.draw(state);

const fretboard = new Fretboard();
fretboard.draw(state);

const chordRootNumbers = {
  "a": 0,
  "a-sharp": 1,
  "b": 2,
  "c": 3,
  "c-sharp": 4,
  "d": 5,
  "d-sharp": 6,
  "e": 7,
  "f": 8,
  "f-sharp": 9,
  "g": 10,
  "g-sharp": 11
}
function handleChordSelect(chordRoot, interval) {
  if (chordRootNumbers.hasOwnProperty(chordRoot)) {
    state.chordRootNumber = chordRootNumbers[chordRoot];
    if (interval) {
      state.chordQuality = interval;
    }
    new Fretboard().draw(state);
    new Piano().draw(state);
  }
}

function handleInstrumentSelect(instrumentName) {
  if (instruments.hasOwnProperty(instrumentName)) {
    state.instrument = instruments[instrumentName];
    new Fretboard().draw(state);
  }
}

window.handleChordSelect = handleChordSelect;
window.handleInstrumentSelect = handleInstrumentSelect;
