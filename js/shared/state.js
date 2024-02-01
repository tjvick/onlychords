import { CHORD_QUALITY } from "./constants";
import { instruments } from "./instrument";
import { noteFromIndex } from "./note";
import { Key } from "./key";
import {
  highlightChordVariation,
  redrawAll,
  redrawCircle,
  redrawFretboard,
  redrawPiano,
  updateTuningOptions
} from "./commands";
import { CHORD_VARIATIONS } from "./chordVariations";

let state = {
  activeKey: new Key(noteFromIndex(3), CHORD_QUALITY.major),
  instrument: instruments["guitar"],
  tuning: instruments["guitar"].tunings["guitar-standard"],
  activeTones: new Set([0, 4, 7]),
  optionalActiveTones: new Set([]),
  chordsInKeyVisible: true
};

export function setKey(key) {
  if (!key.is(state.activeKey)) {
    if (key.quality !== state.activeKey.quality) {
      if (key.quality === CHORD_QUALITY.major) {
        changeStateForChordVariation(CHORD_VARIATIONS.X);
      } else if (key.quality === CHORD_QUALITY.minor) {
        changeStateForChordVariation(CHORD_VARIATIONS.Xm);
      } else if (key.quality === CHORD_QUALITY.diminished) {
        changeStateForChordVariation(CHORD_VARIATIONS.Xdim);
      }
    }
    state.activeKey = key;
    redrawAll();
  }
}

export function setChordVariation(chordVariation) {
  changeStateForChordVariation(chordVariation);
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

    updateTuningOptions();
    redrawFretboard();
  }
}

export function setTuningById(tuningId) {
  state.tuning = state.instrument.tunings[tuningId];

  redrawFretboard();
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

function changeStateForChordVariation(chordVariation) {
  state.activeTones = new Set(chordVariation.semitoneNumbers);
  state.optionalActiveTones = new Set(chordVariation.optionalSemitoneNumbers);
}

export default state;
