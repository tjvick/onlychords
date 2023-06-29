export class ChordVariation {
  constructor(semitoneNumbers, labelSuffix, hint) {
    this.semitoneNumbers = semitoneNumbers;
    this.labelSuffix = labelSuffix;
    this.hint = hint;
  }

  getLabel(rootNoteLabel) {
    return rootNoteLabel + this.labelSuffix;
  }

  getHint(rootNoteLabel) {
    return rootNoteLabel + ' ' + this.hint;
  }
}

export const CHORD_VARIATIONS = {
  X: new ChordVariation([0, 4, 7], '', 'major'),
  Xm: new ChordVariation([0, 3, 7], 'm', 'minor'),
  X7: new ChordVariation( [0, 4, 7, 10], '7','dominant seventh'),
  Xm7: new ChordVariation( [0, 3, 7, 10], 'm7','minor seventh'),
  Xmaj7: new ChordVariation( [0, 4, 7, 11], 'maj7','major seventh'),
  XmM7: new ChordVariation( [0, 3, 7, 11], 'mM7','minor major seventh'),
  Xsus2: new ChordVariation( [0, 2, 7], 'sus2','suspended second'),
  Xsus4: new ChordVariation( [0, 5, 7], 'sus4','suspended fourth'),
  Xdim: new ChordVariation( [0, 3, 6], 'dim','diminished'),
  Xdim7: new ChordVariation( [0, 3, 6, 9], 'dim7','diminished seventh'),
  Xm7b5: new ChordVariation( [0, 3, 6, 10], 'm7♭5','minor seventh flat five'),
  Xaug: new ChordVariation( [0, 4, 8], 'aug','augmented'),
  Xaug7: new ChordVariation( [0, 4, 8, 10], 'aug7','augmented seventh'),
  X6: new ChordVariation( [0, 4, 7, 9], '6','major sixth'),
  Xm6: new ChordVariation( [0, 3, 7, 9], 'm6','minor sixth'),
}
