import state, { setChordVariation } from "./state";
import { Piano } from "../piano/piano";
import { Fretboard } from "../fretboard/fretboard";
import { CircleOfFifths } from "../circleOfFifths/circle";
import { CHORD_VARIATIONS } from "./chordVariations";
import { ACCIDENTAL_MODE } from "./constants";

const circleOfFifths = new CircleOfFifths();
const piano = new Piano();
const fretboard = new Fretboard();

export function redrawAll() {
  piano.draw(state);
  fretboard.draw(state);
  circleOfFifths.draw(state);
  rewriteChordVariations(state);
  highlightChordVariation();
  updateTuningOptions();
}

export function redrawPiano() {
  piano.draw(state);
}

export function redrawFretboard() {
  fretboard.draw(state);
}

export function redrawCircle() {
  circleOfFifths.draw(state);
}

export function updateTuningOptions() {
  const tuningSelectElement = document.getElementById("tuning-select");
  tuningSelectElement.replaceChildren()

  for (const tuningId in state.instrument.tunings) {
    const tuning = state.instrument.tunings[tuningId];
    const text = `${tuning.name} (${tuning.stringLabels.toReversed().join('')})`

    const optionElement = document.createElement("option");
    optionElement.value = tuningId;
    optionElement.appendChild(document.createTextNode(text));

    tuningSelectElement.appendChild(optionElement);
  }
}

function checkEqualSet(set1, set2) {
  if (set1.size === set2.size) {
    for (let i of set1)
      if (set2.has(i) === false) {
        return false;
      }
  } else return false;
  return true;
}

export function highlightChordVariation() {
  const activeTones = state.activeTones;
  for (const variation of Object.values(CHORD_VARIATIONS)) {
    const id = "X" + variation.labelSuffix;
    const variationButton = document.getElementById(id);

    const variationTones = new Set(variation.semitoneNumbers);
    if (checkEqualSet(variationTones, activeTones)) {
      variationButton.classList.add("active");
    } else {
      variationButton.classList.remove("active");
    }
  }
}

export function rewriteChordVariations(state) {
  // constructor
  const container = document.getElementById("chord-variations-container");

  // clear
  container.replaceChildren();

  const rootNoteLabel = state.activeKey.rootNote.getLabel(ACCIDENTAL_MODE.flat);

  // build and add buttons
  for (const variation of Object.values(CHORD_VARIATIONS)) {
    // build button
    const button = document.createElement("button");
    button.appendChild(
      document.createTextNode(variation.getLabel(rootNoteLabel))
    );
    button.classList.add("chord-variation-button");
    button.id = "X" + variation.labelSuffix;
    button.title = variation.getHint(rootNoteLabel);
    button.addEventListener("click", () => {
      setChordVariation(variation);
    });

    // add button
    container.appendChild(button);
  }
}
