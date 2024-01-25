import { setChordsInKeyVisible, setInstrument } from "./shared/state";
import { redrawAll } from "./shared/commands";
import { instruments } from "./shared/instrument";

function init() {
  addFontFileToDocument().then(() => {
    redrawAll();
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

window.handleInstrumentSelect = handleInstrumentSelect;
window.handleChordsInKeyToggle = handleChordsInKeyToggle;


const analyticsData = {
  navigator: window.navigator
}

fetch('.netlify/functions/analytics', {
  method: 'POST',
  body: JSON.stringify(analyticsData)
}).then(response => {
  console.log("analytics function called");
})

init();
