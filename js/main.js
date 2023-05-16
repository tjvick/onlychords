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
  canvasWidth: 1200,
  canvasHeight: 300,
};

const fretboardStyles = {
  nutCapoThickness: 6,
  fretThickness: 2,
  neckWidth: 200,
  stringLength: 1500,
};


let currentChordRootNumber = 0;
let currentChordInterval = "major";
let currentInstrument = instruments["guitar"];


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

function drawTones(ctx, instrument, toneNumber, fillStyle, text) {
  onFretBoard(ctx, () => {
    ctx.fillStyle = fillStyle
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
          ctx.fillStyle = fillStyle
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "rgb(0, 0, 0)"
          ctx.fillText(text, fretXPosition, stringYPosition+2)
        }
      }
    }
  })
}

function draw(chordRootNumber, chordInterval, instrument) {
  const canvas = document.getElementById("fretboard-canvas");
  canvas.width = canvasStyles.canvasWidth * 2;
  canvas.height = canvasStyles.canvasHeight * 2;
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);

    const thirdInterval = chordInterval === "major" ? 4 : 3;

    drawFrets(ctx, instrument);
    drawStrings(ctx, instrument);
    labelFrets(ctx, instrument);
    labelStrings(ctx, instrument);
    drawTones(ctx, instrument, chordRootNumber, "rgb(0, 190, 0)", "R");
    drawTones(ctx, instrument, (chordRootNumber+thirdInterval) % 12, "rgb(210, 255, 0)", "3");
    drawTones(ctx, instrument,(chordRootNumber+7) % 12, "rgb(150, 210, 0)", "5");
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
    setTimeout(()=>draw(currentChordRootNumber, currentChordInterval, currentInstrument), 0);
  }
}

function handleInstrumentSelect(instrumentName) {
  if (instruments.hasOwnProperty(instrumentName)) {
    currentInstrument = instruments[instrumentName];
    setTimeout(()=>draw(currentChordRootNumber, currentChordInterval, currentInstrument), 0);
  }
}

draw(0, "major", instruments["guitar"])
