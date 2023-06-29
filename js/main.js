import { setChordsInKeyVisible, setInstrument } from "./shared/state";
import {redrawAll} from "./shared/commands";
import { instruments } from "./shared/instrument";

function init() {
  const fontFile = new FontFace(
    "Gothic A1",
    "url(./fonts/GothicA1-Regular.ttf)"
  );
  document.fonts.add(fontFile);
  fontFile.load().then(() => {
    redrawAll();
  });
}


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

init();
