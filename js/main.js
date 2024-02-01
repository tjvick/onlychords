import { setChordsInKeyVisible, setInstrument, setTuningById } from "./shared/state";
import { redrawAll, updateTuningOptions } from "./shared/commands";
import { instruments } from "./shared/instrument";
import { sendAnalyticsEvent } from "./analytics.js";

function init() {
  addFontFileToDocument().then(() => {
    const instrumentSelect = document.getElementById("instrument-select");
    handleInstrumentSelect(instrumentSelect.value);

    redrawAll();
    updateTuningOptions();
  });
}

function addFontFileToDocument() {
  const fontFile = new FontFace("Gothic A1", "url(fonts/GothicA1-Regular.ttf)");
  document.fonts.add(fontFile);
  return fontFile.load();
}

function handleInstrumentSelect(instrumentName) {
  if (instruments.hasOwnProperty(instrumentName)) {
    setInstrument(instruments[instrumentName]);
  }
}

function handleChordsInKeyToggle(toggleElement) {
  setChordsInKeyVisible(toggleElement.checked);
}

function handleTuningSelect(tuningId) {
  setTuningById(tuningId);
}

window.handleInstrumentSelect = handleInstrumentSelect;
window.handleChordsInKeyToggle = handleChordsInKeyToggle;
window.handleTuningSelect = handleTuningSelect;


init();
sendAnalyticsEvent();
