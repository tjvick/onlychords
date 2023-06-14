import { instruments } from "./constants";

let state = {
  chordRootNumber: 3,
  chordQuality: "major",
  instrument: instruments["guitar"],
  activeTones: new Set(["R", "3", "5"]),
  showChordsInKey: true,
};

export default state;
