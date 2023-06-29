import {CHORD_QUALITY} from "./constants";
import {instruments} from "./instrument";
import {noteFromIndex} from "./note";
import {Key} from "./key";
import {highlightChordVariation, redrawAll, redrawCircle, redrawFretboard, redrawPiano} from "./commands";

let state = {
  activeKey: new Key(noteFromIndex(3), CHORD_QUALITY.major),
  instrument: instruments["guitar"],
  activeTones: new Set([0, 4, 7]),
  chordsInKeyVisible: true,
};

export function setKey(key) {
  if (!key.is(state.activeKey)) {
    if (key.quality !== state.activeKey.quality) {
      state.activeTones = key.quality === 'major'
        ? new Set([0, 4, 7])
        : new Set([0, 3, 7]);
    }
    state.activeKey = key;

    redrawAll();
    highlightChordVariation();
  }
}

export function setChordVariation(chordVariation) {
  state.activeTones = new Set(chordVariation.semitoneNumbers);

  redrawFretboard();
  redrawPiano();
  highlightChordVariation();
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

  redrawPiano();
  redrawFretboard();
  highlightChordVariation();
}


export default state;
