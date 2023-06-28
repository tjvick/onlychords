import { KeySector } from "./keySector";
import { CHORD_QUALITY } from "../shared/constants";
import { circleStyles } from "./shared";
import { circleFillColors } from "../shared/theme";
import {noteFromIndex} from "../shared/note";
import {Key} from "../shared/key";

export class CircleOfFifthsSlice {
  constructor(circlePositionIndex) {
    const majorChordRootNumber = (circlePositionIndex * 7) % 12;
    const minorChordRootNumber = (9 + circlePositionIndex * 7) % 12;
    const diminishedChordRootNumber = (11 + circlePositionIndex * 7) % 12;

    const majorKey = new Key(
      noteFromIndex(majorChordRootNumber),
      CHORD_QUALITY.major
    );
    const minorKey = new Key(
      noteFromIndex(minorChordRootNumber),
      CHORD_QUALITY.minor
    );
    const diminishedKey = new Key(
      noteFromIndex(diminishedChordRootNumber),
      CHORD_QUALITY.diminished
    );

    this.majorKeySector = new KeySector(circlePositionIndex, majorKey, {
      radii: [circleStyles.middleRadius, circleStyles.outerRadius],
      labelFonts: ["25px serif"],
      superscriptFont: "15px serif",
      shadeColor: circleFillColors.major,
      labelColor: "black",
    });
    this.minorKeySector = new KeySector(circlePositionIndex, minorKey, {
      radii: [circleStyles.innerRadius, circleStyles.middleRadius],
      labelFonts: ["21px serif"],
      superscriptFont: "15px serif",
      shadeColor: circleFillColors.minor,
      labelColor: "black",
    });
    this.diminishedKeySector = new KeySector(
      circlePositionIndex,
      diminishedKey,
      {
        radii: [circleStyles.innerInnerRadius, circleStyles.innerRadius],
        labelFonts: ["19px serif", "16px serif"],
        superscriptFont: "15px serif",
        shadeColor: circleFillColors.diminished,
        labelColor: "gray",
      }
    );
  }

  draw(ctx, activeKey, chordsInKeyVisible) {

    this.majorKeySector.draw(ctx, activeKey, chordsInKeyVisible);
    this.minorKeySector.draw(ctx, activeKey, chordsInKeyVisible);
    this.diminishedKeySector.draw(ctx, activeKey, chordsInKeyVisible);
  }
}
