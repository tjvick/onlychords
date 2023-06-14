import { notes } from "../shared/constants";

const ACCIDENTAL_SIDE = {
  sharp: "sharp",
  flat: "flat",
  both: "both",
};

export class KeyAreaLabel {
  constructor(
    chordRootNumber,
    circlePositionIndex,
    chordQuality,
    nSemitonesFromRoot
  ) {
    this.circlePositionIndex = circlePositionIndex;
    this.note = notes[chordRootNumber % 12];
    this.chordQuality = chordQuality;
    this.nSemitonesFromRoot = nSemitonesFromRoot;
  }

  getAccidentalSide() {
    if (this.circlePositionIndex < 3) {
      return ACCIDENTAL_SIDE.sharp;
    } else if (this.circlePositionIndex === 3) {
      return ACCIDENTAL_SIDE.both;
    } else {
      return ACCIDENTAL_SIDE.flat;
    }
  }

  getPrimaryLabel() {
    const labels = this.note.labels;
    if (labels.length === 1) {
      return labels[0];
    }

    const accidentalSide = this.getAccidentalSide();
    switch (accidentalSide) {
      case ACCIDENTAL_SIDE.both:
        return `${labels[1]}/${labels[0]}`;
      case ACCIDENTAL_SIDE.flat:
        return labels[1];
      default:
        return labels[0];
    }
  }

  getLabels() {
    if (this.chordQuality === "minor") {
      return [this.getPrimaryLabel() + "m"];
    }

    if (this.chordQuality === "diminished") {
      return [this.getPrimaryLabel(), "dim"];
    }

    return [this.getPrimaryLabel()];
  }

  getRelativeToneNumber() {
    const majorSemitoneScaleDegrees = {
      0: "I",
      3: "III", // on a minor scale
      5: "IV", // in a major scale
      7: "V", // in a major scale
      8: "VI", // in a minor scale
      10: "VII", // in a minor scale
    };
    if (this.chordQuality === "major") {
      return majorSemitoneScaleDegrees[this.nSemitonesFromRoot];
    }

    const minorSemitoneScaleDegrees = {
      0: "i",
      2: "ii", // in a major scale
      4: "iii", // in a major scale
      5: "iv", // in a minor scale
      7: "v", // in a minor scale
      9: "vi", // in a major scale
    };
    if (this.chordQuality === "minor") {
      return minorSemitoneScaleDegrees[this.nSemitonesFromRoot];
    }

    const diminishedSemitoneScaleDegrees = {
      2: "ii",
      11: "vii",
    };
    return diminishedSemitoneScaleDegrees[this.nSemitonesFromRoot];
  }
}
