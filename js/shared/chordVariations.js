export class ChordVariation {
  constructor(semitoneNumbers, labelSuffix, hint, optionalSemitoneNumbers=[]) {
    this.semitoneNumbers = semitoneNumbers;
    this.optionalSemitoneNumbers = optionalSemitoneNumbers;
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
  X6: new ChordVariation( [0, 4, 7, 9], '6','major sixth'),
  Xm6: new ChordVariation( [0, 3, 7, 9], 'm6','minor sixth'),
  X69: new ChordVariation([0, 4, 7, 9, 14], '6/9', 'sixth added ninth'),
  X5: new ChordVariation([0, 7], '5', 'fifth'),
  X9: new ChordVariation([0, 4, 7, 10, 14], '9', 'dominant ninth'),
  Xm9: new ChordVariation([0, 3, 7, 10, 14], 'm9', 'minor ninth'),
  Xmaj9: new ChordVariation([0, 4, 7, 11, 14], 'maj9', 'major ninth'),
  X11: new ChordVariation([0, 7, 10, 14, 17], '11', 'eleventh', [7]),
  Xm11: new ChordVariation([0, 3, 7, 10, 14, 17], 'm11', 'minor eleventh', [7, 14]),
  Xmaj11: new ChordVariation([0, 4, 7, 11, 14, 17], 'maj11', 'major eleventh', [7, 14]),
  X13: new ChordVariation([0, 4, 7, 10, 14, 17, 21], '13', 'thirteenth', [7, 14, 17]),
  Xm13: new ChordVariation([0, 3, 7, 10, 14, 17, 21], 'm13', 'minor thirteenth', [7, 14, 17]),
  Xmaj13: new ChordVariation([0, 4, 7, 11, 14, 17, 21], 'maj13', 'major thirteenth', [7, 14, 17]),
  Xadd2: new ChordVariation([0, 2, 4, 7], 'add2', 'added second'),
  Xadd9: new ChordVariation([0, 4, 7, 14], 'add9', 'added ninth'),
  Xsus2: new ChordVariation( [0, 2, 7], 'sus2','suspended second'),
  Xsus4: new ChordVariation( [0, 5, 7], 'sus4','suspended fourth'),
  Xdim: new ChordVariation( [0, 3, 6], 'dim','diminished'),
  Xdim7: new ChordVariation( [0, 3, 6, 9], 'dim7','diminished seventh'),
  Xm7b5: new ChordVariation( [0, 3, 6, 10], 'm7♭5','minor seventh flat five'),
  Xaug: new ChordVariation( [0, 4, 8], 'aug','augmented'),
  Xaug7: new ChordVariation( [0, 4, 8, 10], 'aug7','augmented seventh'),
}
