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
  new Semitone(13, "m9"),
  new Semitone(14, "M9"),
  new Semitone(15, "m10"),
  new Semitone(16, "M10"),
  new Semitone(17, "P11"),
  new Semitone(18, "♯11"),
  new Semitone(19, "P12"),
  new Semitone(20, "m13"),
  new Semitone(21, "M13"),
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

