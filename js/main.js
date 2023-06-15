import state from "./shared/state";
import { instruments } from "./shared/constants";
import { redrawAll, redrawCircle, redrawFretboard } from "./shared/commands";

redrawAll();
redrawCircle();

const chordRootNumbers = {
  a: 0,
  "a-sharp": 1,
  b: 2,
  c: 3,
  "c-sharp": 4,
  d: 5,
  "d-sharp": 6,
  e: 7,
  f: 8,
  "f-sharp": 9,
  g: 10,
  "g-sharp": 11,
};
function handleChordSelect(chordRoot, interval) {
  if (chordRootNumbers.hasOwnProperty(chordRoot)) {
    state.chordRootNumber = chordRootNumbers[chordRoot];
    if (interval) {
      state.chordQuality = interval;
    }
    redrawAll();
  }
}

function handleInstrumentSelect(instrumentName) {
  if (instruments.hasOwnProperty(instrumentName)) {
    state.instrument = instruments[instrumentName];
    redrawFretboard();
  }
}

function handleChordsInKeyToggle(toggleElement) {
  state.showChordsInKey = toggleElement.checked;
  redrawCircle();
}

window.handleChordSelect = handleChordSelect;
window.handleInstrumentSelect = handleInstrumentSelect;
window.handleChordsInKeyToggle = handleChordsInKeyToggle;
