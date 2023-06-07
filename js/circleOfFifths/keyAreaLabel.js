import {notes} from "../shared/constants";

const ACCIDENTAL_SIDE = {
  sharp: "sharp",
  flat: "flat",
  both: "both",
}

export class KeyAreaLabel {
  constructor(chordRootNumber, circlePositionIndex, chordQuality) {
    this.circlePositionIndex = circlePositionIndex;
    this.note = notes[chordRootNumber % 12];
    this.chordQuality = chordQuality;
  }

  getAccidentalSide() {
    if (this.circlePositionIndex < 3) {
      return ACCIDENTAL_SIDE.sharp;
    } else if (this.circlePositionIndex === 3) {
      return ACCIDENTAL_SIDE.both;
    } else {
      return ACCIDENTAL_SIDE.flat
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
        return `${labels[1]}/${labels[0]}`
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
      return [this.getPrimaryLabel(), "dim"]
    }

    return [this.getPrimaryLabel()]
  }
}
