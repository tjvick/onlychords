export const instruments = {
  guitar: {
    name: "guitar",
    nFrets: 24,
    nStrings: 6,
    stringTuning: [7, 2, 10, 5, 0, 7],
    stringLabels: ["e", "B", "G", "D", "A", "E"],
    startingFrets: [0, 0, 0, 0, 0, 0],
    tunings: {
      "guitar-standard": {
        name: "Standard",
        stringLabels: ["e", "B", "G", "D", "A", "E"],
        stringTuning: [7, 2, 10, 5, 0, 7]
      },
      "guitar-drop-d": {
        name: "Drop D",
        stringLabels: ["e", "B", "G", "D", "A", "D"],
        stringTuning: [7, 2, 10, 5, 0, 5]
      }
    }
  },
  mandolin: {
    name: "mandolin",
    nFrets: 22,
    nStrings: 4,
    stringTuning: [7, 0, 5, 10],
    stringLabels: ["E", "A", "D", "G"],
    startingFrets: [0, 0, 0, 0],
    doubleStrings: true,
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
    stringTuning: [5, 2, 10, 5, 10],
    stringLabels: ["D", "B", "G", "D", "g"],
    startingFrets: [0, 0, 0, 0, 5],
    tunings: {
      "banjo-standard": {
        name: "Standard",
        stringLabels: ["D", "B", "G", "D", "g"],
        stringTuning: [5, 2, 10, 5, 10]
      }
    }
  }
};
