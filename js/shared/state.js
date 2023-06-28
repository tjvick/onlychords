import {CHORD_QUALITY, instruments} from "./constants";

let state = {
  chordRootNumber: 3,
  chordQuality: CHORD_QUALITY.major,
  instrument: instruments["guitar"],
  activeTones: new Set([0, 4, 7]),
  showChordsInKey: true,
};

export default state;
