export const instruments = {
  guitar: {
    nFrets: 24,
    nStrings: 6,
    stringTuning: [7, 2, 10, 5, 0, 7],
    stringLabels: ["e", "B", "G", "D", "A", "E"],
  },
  mandolin: {
    nFrets: 22,
    nStrings: 4,
    stringTuning: [7, 0, 5, 10],
    stringLabels: ["E", "A", "D", "G"],
    doubleStrings: true,
  },
};

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

export class Note {
  constructor(index, label, isAccidental) {
    this.index = index;
    this.label = label;
    this.isAccidental = isAccidental;
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
  }

  nRelativeSemitones(rootNote) {
    return (12 + this.index - rootNote.index) % 12;
  }

  getLabel(accidentalSide=ACCIDENTAL_SIDE.both) {
    switch (accidentalSide) {
      case ACCIDENTAL_SIDE.flat:
        return this.higherTone + "♭";
      case ACCIDENTAL_SIDE.sharp:
        return this.lowerTone + "♯";
      default:
        return `${this.lowerTone}♯/${this.higherTone}♭`
    }
  }

  getAllLabels() {
    return [this.getLabel(ACCIDENTAL_SIDE.sharp), this.getLabel(ACCIDENTAL_SIDE.flat)];
  }
}

export const allNotes = [
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

export function noteFromIndex(noteIndex) {
  return allNotes[noteIndex];
}

export const notes = [
  {
    labels: ["A"],
    value: 0,
    isAccidental: false,
  },
  {
    labels: ["A#", "B♭"],
    value: 1,
    isAccidental: true,
  },
  {
    labels: ["B"],
    value: 2,
    isAccidental: false,
  },
  {
    labels: ["C"],
    value: 3,
    isAccidental: false,
  },
  {
    labels: ["C#", "D♭"],
    value: 4,
    isAccidental: true,
  },
  {
    labels: ["D"],
    value: 5,
    isAccidental: false,
  },
  {
    labels: ["D#", "E♭"],
    value: 6,
    isAccidental: true,
  },
  {
    labels: ["E"],
    value: 7,
    isAccidental: false,
  },
  {
    labels: ["F"],
    value: 8,
    isAccidental: false,
  },
  {
    labels: ["F#", "G♭"],
    value: 9,
    isAccidental: true,
  },
  {
    labels: ["G"],
    value: 10,
    isAccidental: false,
  },
  {
    labels: ["G#", "A♭"],
    value: 11,
    isAccidental: true,
  },
];

export class Key {
  constructor(rootNote, quality) {
    this.rootNote = rootNote;
    this.quality = quality;
  }

  is(anotherKey) {
    return this.rootNote.index === anotherKey.rootNote.index && this.quality === anotherKey.quality;
  }

  isAChordInKey(anotherKey) {
    const validScaleDegrees = scaleDegreesInKey[anotherKey.quality][this.quality];
    return validScaleDegrees.includes(this.relativeScaleDegree(anotherKey));
  }

  getLabel(accidentalSide=ACCIDENTAL_SIDE.both) {
    if (this.quality === "minor") {
      return this.rootNote.getLabel(accidentalSide) + "m";
    }

    if (this.quality === "diminished") {
      return this.rootNote.getLabel(accidentalSide) + " dim";
    }

    return this.rootNote.getLabel(accidentalSide);
  }

  relativeScaleDegree(rootKey) {
    if (this.quality === "major") {
      return this.#relativeScaleDegreeNumber(rootKey);
    } else {
      return this.#relativeScaleDegreeNumber(rootKey)?.toLowerCase();
    }
  }

  #relativeScaleDegreeNumber(rootKey) {
    const nSemitonesFromRoot = this.rootNote.nRelativeSemitones(rootKey.rootNote);

    if (rootKey.quality === CHORD_QUALITY.major) {
      return {0: "I", 2: "II", 4: "III", 5: "IV", 7: "V", 9: "VI", 11: "VII"}[nSemitonesFromRoot]
    } else if (rootKey.quality === CHORD_QUALITY.minor) {
      return {0: "I", 2: "II", 3: "III", 5: "IV", 7: "V", 8: "VI", 10: "VII"}[nSemitonesFromRoot]
    }
  }
}

export const ACCIDENTAL_SIDE = {
  sharp: "sharp",
  flat: "flat",
  both: "both",
};

export const CHORD_QUALITY = {
  major: "major",
  minor: "minor",
  diminished: "diminished"
}

const scaleDegreesInMajorKey = {
  [CHORD_QUALITY.major]: ['IV', 'V'],
  [CHORD_QUALITY.minor]: ['ii', 'iii', 'vi'],
  [CHORD_QUALITY.diminished]: ['vii'],
}

const scaleDegreesInMinorKey = {
  [CHORD_QUALITY.major]: ['III', 'VI', 'VII'],
  [CHORD_QUALITY.minor]: ['iv', 'v'],
  [CHORD_QUALITY.diminished]: ['ii'],
}

const scaleDegreesInKey = {
  [CHORD_QUALITY.major]: scaleDegreesInMajorKey,
  [CHORD_QUALITY.minor]: scaleDegreesInMinorKey,
}
