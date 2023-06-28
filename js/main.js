import {setChordsInKeyVisible, setInstrument} from "./shared/state";
import { redrawAll } from "./shared/commands";
import {instruments} from "./shared/instrument";

redrawAll();

function handleInstrumentSelect(instrumentName) {
  if (instruments.hasOwnProperty(instrumentName)) {
    setInstrument(instruments[instrumentName]);
  }
}

function handleChordsInKeyToggle(toggleElement) {
  setChordsInKeyVisible(toggleElement.checked);
}

window.handleInstrumentSelect = handleInstrumentSelect;
window.handleChordsInKeyToggle = handleChordsInKeyToggle;
