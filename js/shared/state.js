import {instruments} from "./constants";

let state = {
  chordRootNumber: 0,
  chordQuality: "major",
  instrument: instruments["guitar"],
  activeTones: new Set(["R", "3", "5"]),
};

export default state;
