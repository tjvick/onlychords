import { instruments } from "./constants";

let state = {
  chordRootNumber: 3,
  chordQuality: "major",
  instrument: instruments["guitar"],
  activeTones: new Set([0, 4, 7]),
  showChordsInKey: true,
};

export default state;
