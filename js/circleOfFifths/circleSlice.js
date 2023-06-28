import { KeySector } from "./keySector";
import { CHORD_QUALITY, Key, noteFromIndex } from "../shared/constants";
import { circleStyles } from "./shared";
import { circleFillColors } from "../shared/theme";

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

  draw(ctx, currentActiveChordNumber, currentChordQuality, showChordsInKey) {
    const currentActiveKey = new Key(
      noteFromIndex(currentActiveChordNumber),
      currentChordQuality
    );

    this.majorKeySector.draw(ctx, showChordsInKey, currentActiveKey);
    this.minorKeySector.draw(ctx, showChordsInKey, currentActiveKey);
    this.diminishedKeySector.draw(ctx, showChordsInKey, currentActiveKey);
  }
}
