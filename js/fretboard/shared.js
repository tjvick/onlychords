export const fretboardStyles = {
  offsetX: 60,
  offsetY: 50,
  nutCapoThickness: 6,
  fretThickness: 2,
  neckWidth: 200,
  stringLength: 1500,
};

export function getFretPosition(fretNumber) {
  const frequencyRatio = 2 ** (fretNumber / 12);
  const lengthRatio = 1 / frequencyRatio;
  const fretPosition = fretboardStyles.stringLength * (1 - lengthRatio)
  return Math.floor(fretPosition);
}
