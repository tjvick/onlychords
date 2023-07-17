import { KeySector } from "./keySector";
import { CHORD_QUALITY } from "../shared/constants";
import { circleStyles } from "./shared";
import { circleFillColors, font } from "../shared/theme";
import { noteFromIndex } from "../shared/note";
import { Key } from "../shared/key";

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
      shadeColor: getColor(majorChordRootNumber, CHORD_QUALITY.major),
    });
    this.minorKeySector = new KeySector(circlePositionIndex, minorKey, {
      radii: [circleStyles.innerRadius, circleStyles.middleRadius],
      labelFonts: [`19px ${font.note}`],
      superscriptFont: `15px ${font.scaleDegree}`,
      shadeColor: getColor(minorChordRootNumber, CHORD_QUALITY.minor),
    });
    this.diminishedKeySector = new KeySector(
      circlePositionIndex,
      diminishedKey,
      {
        radii: [circleStyles.innerInnerRadius, circleStyles.innerRadius],
        labelFonts: [`16px ${font.note}`, `16px ${font.note}`],
        superscriptFont: `15px ${font.scaleDegree}`,
        shadeColor: getColor(diminishedChordRootNumber, CHORD_QUALITY.diminished),
      }
    );
  }

  draw(ctx, activeKey, chordsInKeyVisible) {
    this.majorKeySector.draw(ctx, activeKey, chordsInKeyVisible);
    this.minorKeySector.draw(ctx, activeKey, chordsInKeyVisible);
    this.diminishedKeySector.draw(ctx, activeKey, chordsInKeyVisible);
  }
}


function getColor(rootNumber, chordQuality) {
  let r = (rootNumber % 4) * 70;
  let g = (rootNumber % 5) * 60;
  let b = (rootNumber % 6 + 1) * 40;
  if (chordQuality === CHORD_QUALITY.minor) {
    r = (rootNumber % 4) * 61;
    g = (rootNumber % 5) * 51;
    b = (rootNumber % 6 + 1) * 35;
  } else if (chordQuality === CHORD_QUALITY.diminished) {
    r = (rootNumber % 4 + 1) * 52;
    g = (rootNumber % 5) * 42;
    b = (rootNumber % 6) * 32;
  }

  return `rgba(${r},${g},${b})`;
}
