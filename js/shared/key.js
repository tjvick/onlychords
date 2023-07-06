import { ACCIDENTAL_MODE, CHORD_QUALITY } from "./constants";

export class Key {
  constructor(rootNote, quality) {
    this.rootNote = rootNote;
    this.quality = quality;
  }

  is(anotherKey) {
    return (
      this.rootNote.index === anotherKey.rootNote.index &&
      this.quality === anotherKey.quality
    );
  }

  isAChordInKey(anotherKey) {
    if (anotherKey.quality === CHORD_QUALITY.diminished) {
      return false;
    }
    const validScaleDegrees =
      scaleDegreesInKey[anotherKey.quality][this.quality];
    return validScaleDegrees.includes(this.relativeScaleDegree(anotherKey));
  }

  getLabel(accidentalMode = ACCIDENTAL_MODE.both) {
    if (this.quality === "minor") {
      return this.rootNote.getLabel(accidentalMode) + "m";
    }

    if (this.quality === "diminished") {
      return this.rootNote.getLabel(accidentalMode) + " dim";
    }

    return this.rootNote.getLabel(accidentalMode);
  }

  relativeScaleDegree(rootKey) {
    if (this.quality === "major") {
      return this.#relativeScaleDegreeNumber(rootKey);
    } else {
      return this.#relativeScaleDegreeNumber(rootKey)?.toLowerCase();
    }
  }

  #relativeScaleDegreeNumber(rootKey) {
    const nSemitonesFromRoot = this.rootNote.nRelativeSemitones(
      rootKey.rootNote
    );

    if (rootKey.quality === CHORD_QUALITY.major) {
      return { 0: "I", 2: "II", 4: "III", 5: "IV", 7: "V", 9: "VI", 11: "VII" }[
        nSemitonesFromRoot
      ];
    } else if (rootKey.quality === CHORD_QUALITY.minor) {
      return { 0: "I", 2: "II", 3: "III", 5: "IV", 7: "V", 8: "VI", 10: "VII" }[
        nSemitonesFromRoot
      ];
    } else if (rootKey.quality === CHORD_QUALITY.diminished) {
      return { 0: "I" }[nSemitonesFromRoot];
    }
  }
}

const scaleDegreesInMajorKey = {
  [CHORD_QUALITY.major]: ["IV", "V"],
  [CHORD_QUALITY.minor]: ["ii", "iii", "vi"],
  [CHORD_QUALITY.diminished]: ["vii"],
};

const scaleDegreesInMinorKey = {
  [CHORD_QUALITY.major]: ["III", "VI", "VII"],
  [CHORD_QUALITY.minor]: ["iv", "v"],
  [CHORD_QUALITY.diminished]: ["ii"],
};

const scaleDegreesInKey = {
  [CHORD_QUALITY.major]: scaleDegreesInMajorKey,
  [CHORD_QUALITY.minor]: scaleDegreesInMinorKey,
};
