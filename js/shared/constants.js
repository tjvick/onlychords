export class Semitone {
  constructor(number, label) {
    this.position = number;
    this.label = label;
  }
}

export const allSemitones = [
  new Semitone(0, "R"),
  new Semitone(1, "m2"),
  new Semitone(2, "M2"),
  new Semitone(3, "m3"),
  new Semitone(4, "M3"),
  new Semitone(5, "P4"),
  new Semitone(6, "TT"),
  new Semitone(7, "P5"),
  new Semitone(8, "m6"),
  new Semitone(9, "M6"),
  new Semitone(10, "m7"),
  new Semitone(11, "M7"),
]

export const ACCIDENTAL_MODE = {
  sharp: "sharp",
  flat: "flat",
  both: "both",
};

export const CHORD_QUALITY = {
  major: "major",
  minor: "minor",
  diminished: "diminished"
}

