import state from "./shared/state";
import { instruments } from "./shared/constants";
import { redrawAll, redrawCircle, redrawFretboard } from "./shared/commands";

redrawAll();
redrawCircle();

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

window.handleInstrumentSelect = handleInstrumentSelect;
window.handleChordsInKeyToggle = handleChordsInKeyToggle;
