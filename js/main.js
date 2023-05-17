const instruments = {
  "guitar": {
    nFrets: 24,
    nStrings: 6,
    stringTuning: [
      7, 2, 10, 5, 0, 7
    ],
    stringLabels: [
      "e", "B", "G", "D", "A", "E"
    ]
  },
  "mandolin": {
    nFrets: 22,
    nStrings: 4,
    stringTuning: [
      7, 0, 5, 10
    ],
    stringLabels: [
      "E", "A", "D", "G"
    ],
    doubleStrings: true,
  }
};

const canvasStyles = {
  fretboard: {
    width: 1200,
    height: 300,
  },
  piano: {
    width: 1200,
    height: 150,
  }
};

const fretboardStyles = {
  nutCapoThickness: 6,
  fretThickness: 2,
  neckWidth: 200,
  stringLength: 1500,
};

const chordPositions = {
  major: [
    {label: "R", position: 0},
    {label: "2", position: 2},
    {label: "3", position: 4},
    {label: "4", position: 5},
    {label: "5", position: 7},
    {label: "6", position: 9},
    {label: "7", position: 11},
    {label: "R", position: 12},
  ],
  minor: [
    {label: "R", position: 0},
    {label: "2", position: 2},
    {label: "3", position: 3},
    {label: "4", position: 5},
    {label: "5", position: 7},
    {label: "6", position: 8},
    {label: "7", position: 10},
    {label: "R", position: 12},
  ]
}

const toneColors = {
  "R": "rgb(0, 190, 0)",
  "2": "rgb(0, 100, 200)",
  "3": "rgb(210, 255, 0)",
  "4": "rgb(0, 150, 200)",
  "5": "rgb(150, 210, 0)",
  "6": "rgb(180, 0, 250)",
  "7": "rgb(250, 150, 0)",
}

let currentChordRootNumber = 0;
let currentChordInterval = "major";
let currentInstrument = instruments["guitar"];
let activeTones = ["R", "3", "5"];

function isolate(ctx, fn) {
  ctx.save();
  fn();
  ctx.restore();
}

function onFretBoard(ctx, fn) {
  isolate(ctx, () => {
    ctx.translate(60, 50);
    fn();
  })
}

function onPiano(ctx, fn) {
  isolate(ctx, () => {
    ctx.translate(25, 25);
    fn();
  })
}

function drawFrets(ctx, instrument) {
  onFretBoard(ctx,() => {
    for (let fretNumber=0; fretNumber <= instrument.nFrets; fretNumber++) {
      if (fretNumber === 0) {
        ctx.lineWidth = fretboardStyles.nutCapoThickness;
      } else {
        ctx.lineWidth = fretboardStyles.fretThickness;
      }

      const fretPosition = getFretPosition(fretNumber);
      ctx.beginPath();
      ctx.moveTo(fretPosition, 0);
      ctx.lineTo(fretPosition, fretboardStyles.neckWidth);
      ctx.stroke();
    }
  })
}

function getFretPosition(fretNumber) {
  const frequencyRatio = 2**(fretNumber/12);
  const lengthRatio = 1/frequencyRatio;
  const fretPosition = fretboardStyles.stringLength * (1 - lengthRatio)
  return Math.floor(fretPosition);
}

function labelFrets(ctx, instrument) {
  onFretBoard(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    for (let fretNumber=0; fretNumber <= instrument.nFrets; fretNumber++) {
      const fretPosition = getFretPosition(fretNumber);
      ctx.fillText(`${fretNumber}`, fretPosition, fretboardStyles.neckWidth+20);
    }
  })
}

function labelStrings(ctx, instrument) {
  onFretBoard(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"
    instrument.stringLabels.forEach((label, stringNumber) => {
      const yPosition = getStringYPosition(stringNumber, instrument);
      ctx.fillText(label, -40, yPosition+2);
    })
  })
}

function getStringYPosition(stringNumber, instrument) {
  let outerBuffer = 5;
  if (instrument.doubleStrings) {
    outerBuffer = 10;
  }
  const stringsWidth = fretboardStyles.neckWidth - (2 * outerBuffer);
  const stringSpacing = stringsWidth / (instrument.nStrings-1);
  return outerBuffer + stringNumber * stringSpacing;
}

function drawStrings(ctx, instrument) {
  onFretBoard(ctx, () => {
    const lastFretPosition = getFretPosition(instrument.nFrets);
    for (let stringNumber=0; stringNumber<instrument.nStrings; stringNumber++) {
      const stringYPosition = getStringYPosition(stringNumber, instrument);
      if (instrument.doubleStrings) {
        ctx.beginPath();
        ctx.moveTo(0, stringYPosition-5);
        ctx.lineTo(lastFretPosition+15, stringYPosition-5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, stringYPosition+5);
        ctx.lineTo(lastFretPosition+15, stringYPosition+5);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, stringYPosition);
        ctx.lineTo(lastFretPosition+15, stringYPosition);
        ctx.stroke();
      }
    }
  })
}

function drawTones(ctx, instrument, toneNumber, label) {
  onFretBoard(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"

    for (let stringNumber=0; stringNumber < instrument.nStrings; stringNumber++) {
      const stringYPosition = getStringYPosition(stringNumber, instrument);
      const stringBaseNote = instrument.stringTuning[stringNumber]
      for (let fretNumber=0; fretNumber < instrument.nFrets; fretNumber ++) {
        const fretXPosition = getFretPosition(fretNumber);
        const fretNote = (stringBaseNote + fretNumber) % 12;
        if (fretNote === toneNumber) {

          const ellipseWidth = 16;
          const ellipseHeight = 10;
          ctx.beginPath();
          ctx.ellipse(fretXPosition, stringYPosition, ellipseWidth, ellipseHeight, 0, 0, Math.PI * 2);
          ctx.fillStyle = toneColors[label]
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "rgb(0, 0, 0)"
          ctx.fillText(label, fretXPosition, stringYPosition+2)
        }
      }
    }
  })
}

function drawFretBoard(chordRootNumber, chordInterval, instrument) {
  const canvas = document.getElementById("fretboard-canvas");
  canvas.width = canvasStyles.fretboard.width * 2;
  canvas.height = canvasStyles.fretboard.height * 2;
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);

    drawFrets(ctx, instrument);
    drawStrings(ctx, instrument);
    labelFrets(ctx, instrument);
    labelStrings(ctx, instrument);
    activeTones.forEach((activeTone) => {
      const note = chordPositions[chordInterval].find((note) => note.label === activeTone);
      drawTones(ctx, instrument, (chordRootNumber+note.position) % 12, note.label);
    })
    // drawTones(ctx, instrument, (chordRootNumber+thirdInterval) % 12, "3");
    // drawTones(ctx, instrument,(chordRootNumber+7) % 12, "5");
  }
}


const notes = [
  {
    label: ["A"],
    value: 0,
    accidental: false,
  }, {
    label: ["A#","B♭"],
    value: 1,
    accidental: true,
  }, {
    label: ["B"],
    value: 2,
    accidental: false,
  }, {
    label: ["C"],
    value: 3,
    accidental: false,
  }, {
    label: ["C#","D♭"],
    value: 4,
    accidental: true,
  }, {
    label: ["D"],
    value: 5,
    accidental: false,
  }, {
    label: ["D#","E♭"],
    value: 6,
    accidental: true,
  }, {
    label: ["E"],
    value: 7,
    accidental: false,
  }, {
    label: ["F"],
    value: 8,
    accidental: false,
  }, {
    label: ["F#","G♭"],
    value: 9,
    accidental: true,
  }, {
    label: ["G"],
    value: 10,
    accidental: false,
  }, {
    label: ["G#","A♭"],
    value: 11,
    accidental: true,
  }
]


const pianoStyles = {
  keyHeight: 60,
  keyWidth: 46,
}

function getKeyXPosition(ixKey) {
  return ixKey * (pianoStyles.keyWidth);
}

function labelPianoKeys(ctx, chordRootNumber) {
  const textLineHeight = 20;

  onPiano(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"

    const textFillStyles = (accidental) => accidental ? "white" : "black";

    for (let ixKey = 0; ixKey <= 24; ixKey++) {
      const note = notes[ixKey % 12];
      const keyXPosition = getKeyXPosition(ixKey);

      ctx.fillStyle = textFillStyles(note.accidental);
      let textYPosition = pianoStyles.keyHeight/2 - textLineHeight/2 * (note.label.length - 1);
      note.label.forEach((label, ixLabel) => {
        ctx.fillText(label, keyXPosition+(pianoStyles.keyWidth/2), (textYPosition + ixLabel*textLineHeight))
      })
    }
  })
}

function drawPianoKeys(ctx, chordRootNumber) {
  onPiano(ctx, () => {
    const accidentalStyles = (faded) => faded ? "gray" : "black";
    const naturalStyles = (faded) => faded ? "lightgray" : "ivory";

    for (let ixKey = 0; ixKey <= 24; ixKey++) {
      const note = notes[ixKey % 12];
      const keyXPosition = getKeyXPosition(ixKey);

      let faded = true;
      if (chordRootNumber <= ixKey && ixKey <= chordRootNumber + 12) {
        faded = false;
      }

      ctx.beginPath()
      ctx.rect(keyXPosition, 0, pianoStyles.keyWidth, pianoStyles.keyHeight)
      ctx.fillStyle = note.accidental ? accidentalStyles(faded) : naturalStyles(faded);
      ctx.fill();
      ctx.strokeStyle = "rgba(100, 100, 100, 1)";
      ctx.stroke();
    }
  })
}

function getRandomColor() {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

const hitMap = {};

function drawTonesOnPiano(ctx, hitCtx, chordRootNumber, chordInterval) {
  const ellipseWidth = 16;
  const ellipseHeight = 10;

  onPiano(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"

    chordPositions[chordInterval].forEach((chordPosition) => {
      const x = getKeyXPosition(chordRootNumber + chordPosition.position) + pianoStyles.keyWidth / 2;
      const y = pianoStyles.keyHeight + 20;
      ctx.beginPath();
      ctx.ellipse(x, y, ellipseWidth, ellipseHeight, 0, 0, Math.PI * 2);
      ctx.fillStyle = activeTones.includes(chordPosition.label) ? toneColors[chordPosition.label] : "lightgray";
      ctx.fill();
      ctx.strokeStyle = activeTones.includes(chordPosition.label) ? "black" : "gray";
      ctx.stroke();

      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.fillText(chordPosition.label, x, y+2)
    });
  })

  onPiano(hitCtx, () => {
    chordPositions[chordInterval].forEach((chordPosition) => {
      const x = getKeyXPosition(chordRootNumber + chordPosition.position) + pianoStyles.keyWidth / 2;
      const y = pianoStyles.keyHeight + 20;

      const hitColor = getRandomColor();
      hitCtx.beginPath();
      hitCtx.ellipse(x, y, ellipseWidth+3, ellipseHeight+3, 0, 0, Math.PI * 2);
      hitCtx.fillStyle = hitColor;
      hitCtx.fill();

      hitMap[hitColor] = chordPosition;
    });
  })
}

function pianoClickHandler(pianoCanvas, pianoCtx, hitCtx) {
  return function handlePianoClick(event) {
    const canvasBox = pianoCanvas.getBoundingClientRect();
    const x = event.clientX - canvasBox.left;
    const y = event.clientY - canvasBox.top;
    const pixel = hitCtx.getImageData(x*2, y*2, 1, 1).data;
    const clickedColor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    const clickedTone = hitMap[clickedColor]?.label || null;
    if (clickedTone) {
      if (activeTones.includes(clickedTone)) {
        activeTones = activeTones.filter((tone) => tone !== clickedTone);
      } else {
        activeTones.push(clickedTone);
      }
      drawFretBoard(currentChordRootNumber, currentChordInterval, currentInstrument);
      pianoCanvas.outerHTML = pianoCanvas.outerHTML;
      drawPiano(currentChordRootNumber, currentChordInterval);
    }
  }
}

function drawPiano(chordRootNumber, chordInterval) {
  const pianoCanvas = document.getElementById("piano-canvas");
  const hitCanvas = document.getElementById("hit-canvas");
  pianoCanvas.width = canvasStyles.piano.width * 2;
  pianoCanvas.height = canvasStyles.piano.height * 2;
  hitCanvas.width = canvasStyles.piano.width * 2;
  hitCanvas.height = canvasStyles.piano.height * 2;

  if (pianoCanvas.getContext && hitCanvas.getContext) {
    const ctx = pianoCanvas.getContext("2d");
    const hitCtx = hitCanvas.getContext("2d");
    ctx.scale(2, 2);
    hitCtx.scale(2, 2);

    drawPianoKeys(ctx, chordRootNumber);
    labelPianoKeys(ctx, chordRootNumber);
    drawTonesOnPiano(ctx, hitCtx, chordRootNumber, chordInterval);
    pianoCanvas.addEventListener('click', pianoClickHandler(pianoCanvas, ctx, hitCtx));
  }
}

const chordRootNumbers = {
  "a": 0,
  "a-sharp": 1,
  "b": 2,
  "c": 3,
  "c-sharp": 4,
  "d": 5,
  "d-sharp": 6,
  "e": 7,
  "f": 8,
  "f-sharp": 9,
  "g": 10,
  "g-sharp": 11
}
function handleChordSelect(chordRoot, interval) {
  if (chordRootNumbers.hasOwnProperty(chordRoot)) {
    if (interval) {
      currentChordInterval = interval;
    }
    currentChordRootNumber = chordRootNumbers[chordRoot];
    setTimeout(()=>{
        drawFretBoard(currentChordRootNumber, currentChordInterval, currentInstrument);
        drawPiano(currentChordRootNumber, currentChordInterval);
      }, 0)
    ;
  }
}

function handleInstrumentSelect(instrumentName) {
  if (instruments.hasOwnProperty(instrumentName)) {
    currentInstrument = instruments[instrumentName];
    setTimeout(() => drawFretBoard(currentChordRootNumber, currentChordInterval, currentInstrument), 0);
  }
}

drawFretBoard(0, "major", instruments["guitar"])
drawPiano(0, "major")


window.handleChordSelect = handleChordSelect;
window.handleInstrumentSelect = handleInstrumentSelect;
