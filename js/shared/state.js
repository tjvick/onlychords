import {CHORD_QUALITY} from "./constants";
import {instruments} from "./instrument";
import {noteFromIndex} from "./note";
import {Key} from "./key";
import {redrawAll, redrawCircle, redrawFretboard} from "./commands";

let state = {
  activeKey: new Key(noteFromIndex(3), CHORD_QUALITY.major),
  instrument: instruments["guitar"],
  activeTones: new Set([0, 4, 7]),
  chordsInKeyVisible: true,
};

export function setKey(key) {
  if (!key.is(state.activeKey)) {
    state.activeKey = key;
    redrawAll();
  }
}

export function setChordsInKeyVisible(isVisible) {
  if (isVisible !== state.chordsInKeyVisible) {
    state.chordsInKeyVisible = isVisible;
    redrawCircle();
  }
}

export function setInstrument(instrument) {
  if (instrument.name !== state.instrument.name) {
    state.instrument = instrument;
    redrawFretboard();
  }
}

export function toggleSemitone(clickedSemitone) {
  if (state.activeTones.has(clickedSemitone)) {
    state.activeTones.delete(clickedSemitone);
  } else {
    state.activeTones.add(clickedSemitone);
  }

  redrawAll();
}


export default state;
