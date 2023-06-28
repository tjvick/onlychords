import { KeySector } from "./keySector";
import { CHORD_QUALITY } from "../shared/constants";
import { circleStyles } from "./shared";
import {circleFillColors, font} from "../shared/theme";
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
      labelFonts: [`24px ${font.note}`],
      superscriptFont: `15px ${font.scaleDegree}`,
      shadeColor: circleFillColors.gray,
      labelColor: "black",
    });
    this.minorKeySector = new KeySector(circlePositionIndex, minorKey, {
      radii: [circleStyles.innerRadius, circleStyles.middleRadius],
      labelFonts: [`19px ${font.note}`],
      superscriptFont: `15px ${font.scaleDegree}`,
      shadeColor: circleFillColors.gray,
      labelColor: "black",
    });
    this.diminishedKeySector = new KeySector(
      circlePositionIndex,
      diminishedKey,
      {
        radii: [circleStyles.innerInnerRadius, circleStyles.innerRadius],
        labelFonts: [`16px ${font.note}`, `16px ${font.note}`],
        superscriptFont: `15px ${font.scaleDegree}`,
        shadeColor: circleFillColors.gray,
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
