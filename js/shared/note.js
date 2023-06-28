import {ACCIDENTAL_MODE} from "./constants";

export class Note {
  constructor(index, label) {
    this.index = index;
    this.label = label;
    this.isAccidental = false;
  }

  nRelativeSemitones(rootNote) {
    return (12 + this.index - rootNote.index) % 12;
  }

  getLabel() {
    return this.label;
  }

  getAllLabels() {
    return [this.label];
  }
}

export class AccidentalNote {
  constructor(index, lowerToneLabel, higherToneLabel) {
    this.index = index;
    this.lowerTone = lowerToneLabel;
    this.higherTone = higherToneLabel;
    this.isAccidental = true;
  }

  nRelativeSemitones(rootNote) {
    return (12 + this.index - rootNote.index) % 12;
  }

  getLabel(accidentalMode = ACCIDENTAL_MODE.both) {
    switch (accidentalMode) {
      case ACCIDENTAL_MODE.flat:
        return this.higherTone + "♭";
      case ACCIDENTAL_MODE.sharp:
        return this.lowerTone + "♯";
      default:
        return `${this.lowerTone}♯/${this.higherTone}♭`
    }
  }

  getAllLabels() {
    return [this.getLabel(ACCIDENTAL_MODE.sharp), this.getLabel(ACCIDENTAL_MODE.flat)];
  }
}

export function noteFromIndex(noteIndex) {
  return notes[noteIndex % 12];
}

const notes = [
  new Note(0, "A"),
  new AccidentalNote(1, "A", "B"),
  new Note(2, "B"),
  new Note(3, "C"),
  new AccidentalNote(4, "C", "D"),
  new Note(5, "D"),
  new AccidentalNote(6, "D", "E"),
  new Note(7, "E"),
  new Note(8, "F"),
  new AccidentalNote(9, "F", "G"),
  new Note(10, "G"),
  new AccidentalNote(11, "G", "A"),
]
