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

export const chordSemitones = {
  major: [
    { label: "R", position: 0 },
    { label: "2", position: 2 },
    { label: "3", position: 4 },
    { label: "4", position: 5 },
    { label: "5", position: 7 },
    { label: "6", position: 9 },
    { label: "7", position: 11 },
    { label: "R", position: 12 },
  ],
  minor: [
    { label: "R", position: 0 },
    { label: "2", position: 2 },
    { label: "3", position: 3 },
    { label: "4", position: 5 },
    { label: "5", position: 7 },
    { label: "6", position: 8 },
    { label: "7", position: 10 },
    { label: "R", position: 12 },
  ],
};

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
