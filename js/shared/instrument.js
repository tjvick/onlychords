export const instruments = {
  guitar: {
    name: "guitar",
    nFrets: 24,
    nStrings: 6,
    startingFrets: [0, 0, 0, 0, 0, 0],
    defaultTuning: "guitar-standard",
    tunings: {
      "guitar-standard": {
        name: "Standard",
        stringLabels: ["E", "B", "G", "D", "A", "E"],
        stringTuning: [7, 2, 10, 5, 0, 7]
      },
      "guitar-drop-d": {
        name: "Drop D",
        stringLabels: ["E", "B", "G", "D", "A", "D"],
        stringTuning: [7, 2, 10, 5, 0, 5]
      },
      "guitar-double-drop-d": {
        name: "Double Drop D",
        stringLabels: ["D", "B", "G", "D", "A", "D"],
        stringTuning: [5, 2, 10, 5, 0, 5]
      },
      "guitar-celtic": {
        name: "Celtic",
        stringLabels: ["D", "A", "G", "D", "A", "D"],
        stringTuning: [5, 0, 10, 5, 0, 5]
      },
      "guitar-open-a": {
        name: "Open A",
        stringLabels: ["E", "A", "E", "C#", "A", "E"],
        stringTuning: [7, 0, 7, 4, 0, 7]
      },
      "guitar-open-d": {
        name: "Open D",
        stringLabels: ["D", "A", "F#", "D", "A", "D"],
        stringTuning: [5, 0, 9, 5, 0, 5]
      },
      "guitar-open-e": {
        name: "Open E",
        stringLabels: ["E", "B", "G#", "E", "B", "E"],
        stringTuning: [7, 2, 11, 7, 2, 7]
      },
      "guitar-open-g": {
        name: "Open G",
        stringLabels: ["D", "B", "G", "D", "G", "D"],
        stringTuning: [5, 2, 10, 5, 10, 5]
      }
    }
  },
  mandolin: {
    name: "mandolin",
    nFrets: 22,
    nStrings: 4,
    startingFrets: [0, 0, 0, 0],
    doubleStrings: true,
    defaultTuning: "mandolin-standard",
    tunings: {
      "mandolin-standard": {
        name: "Standard",
        stringLabels: ["E", "A", "D", "G"],
        stringTuning: [7, 0, 5, 10]
      }
    }
  },
  banjo: {
    name: "banjo",
    nFrets: 22,
    nStrings: 5,
    startingFrets: [0, 0, 0, 0, 5],
    defaultTuning: "banjo-open-g",
    tunings: {
      "banjo-open-g": {
        name: "Open G",
        stringLabels: ["D", "B", "G", "D", "G"],
        stringTuning: [5, 2, 10, 5, 10]
      },
      "banjo-modal": {
        name: "G Modal",
        stringLabels: ["D", "C", "G", "D", "G"],
        stringTuning: [5, 3, 10, 5, 10]
      },
      "banjo-double-c": {
        name: "Double C",
        stringLabels: ["D", "C", "G", "C", "G"],
        stringTuning: [5, 3, 10, 3, 10]
      },
      "banjo-drop-c": {
        name: "Drop C",
        stringLabels: ["D", "B", "G", "C", "G"],
        stringTuning: [5, 2, 10, 3, 10]
      },
      "banjo-open-d": {
        name: "Open D",
        stringLabels: ["D", "A", "F#", "D", "F#"],
        stringTuning: [5, 0, 9, 5, 9]
      }
    }
  }
};
