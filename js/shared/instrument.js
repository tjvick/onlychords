export const instruments = {
  guitar: {
    name: "guitar",
    nFrets: 24,
    nStrings: 6,
    stringTuning: [7, 2, 10, 5, 0, 7],
    stringLabels: ["e", "B", "G", "D", "A", "E"],
    startingFrets: [0, 0, 0, 0, 0, 0]
  },
  mandolin: {
    name: "mandolin",
    nFrets: 22,
    nStrings: 4,
    stringTuning: [7, 0, 5, 10],
    stringLabels: ["E", "A", "D", "G"],
    startingFrets: [0, 0, 0, 0],
    doubleStrings: true,
  },
  banjo: {
    name: "banjo",
    nFrets: 22,
    nStrings: 5,
    stringTuning: [5, 2, 10, 5, 10],
    stringLabels: ["d", "B", "G", "D", "g"],
    startingFrets: [0, 0, 0, 0, 5]
  }
};
