const instruments = {
  "guitar": {
    n_frets: 24,
    n_strings: 6,
    string_tuning: [
      7, 2, 10, 5, 0, 7
    ],
    stringLabels: [
      "e", "B", "G", "D", "A", "E"
    ]
  },
  "mandolin": {
    n_frets: 22,
    n_strings: 4,
    string_tuning: [
      7, 0, 5, 10
    ],
    stringLabels: [
      "E", "A", "D", "G"
    ]
  }
};

const canvas_styles = {
  canvas_width: 1200,
  canvas_height: 300,
};

const fretboard_styles = {
  nut_capo_width: 6,
  fret_width: 2,
  neck_width: 200,
  string_length: 1500,
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

function draw_frets(ctx, instrument) {
  onFretBoard(ctx,() => {
    for (let fret_number=0; fret_number <= instrument.n_frets; fret_number++) {
      if (fret_number === 0) {
        ctx.lineWidth = fretboard_styles.nut_capo_width;
      } else {
        ctx.lineWidth = fretboard_styles.fret_width;
      }

      const fret_position = get_fret_position(fret_number);
      ctx.beginPath();
      ctx.moveTo(fret_position, 0);
      ctx.lineTo(fret_position, fretboard_styles.neck_width);
      ctx.stroke();
    }
  })
}

function get_fret_position(fret_number) {
  const frequency_ratio = 2**(fret_number/12);
  const length_ratio = 1/frequency_ratio;
  const fret_position = fretboard_styles.string_length * (1 - length_ratio)
  return Math.floor(fret_position);
}

function label_frets(ctx, instrument) {
  onFretBoard(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    for (let fret_number=0; fret_number <= instrument.n_frets; fret_number++) {
      const fret_position = get_fret_position(fret_number);
      ctx.fillText(`${fret_number}`, fret_position, fretboard_styles.neck_width+20);
    }
  })
}

function label_strings(ctx, instrument) {
  onFretBoard(ctx, () => {
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"
    instrument.stringLabels.forEach((label, string_number) => {
      const y_position = get_string_y_position(string_number, instrument);
      ctx.fillText(label, -40, y_position+2);
    })
  })
}

function get_string_y_position(string_number, instrument) {
  const outer_buffer = 5;
  const strings_width = fretboard_styles.neck_width - (2 * outer_buffer);
  const string_spacing = strings_width / (instrument.n_strings-1);
  return outer_buffer + string_number * string_spacing;
}

function draw_strings(ctx, instrument) {
  onFretBoard(ctx, () => {
    const last_fret_position = get_fret_position(instrument.n_frets);
    for (let string_number=0; string_number<instrument.n_strings; string_number++) {
      const string_y_position = get_string_y_position(string_number, instrument);
      ctx.beginPath();
      ctx.moveTo(0, string_y_position);
      ctx.lineTo(last_fret_position, string_y_position);
      ctx.stroke();
    }
  })
}

function draw_tones(ctx, instrument, toneNumber, fillStyle, text) {
  onFretBoard(ctx, () => {
    ctx.fillStyle = fillStyle
    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"

    for (let string_number=0; string_number < instrument.n_strings; string_number++) {
      const string_y_position = get_string_y_position(string_number, instrument);
      const string_base_note = instrument.string_tuning[string_number]
      for (let fret_number=0; fret_number < instrument.n_frets; fret_number ++) {
        const fret_x_position = get_fret_position(fret_number);
        const fret_note = (string_base_note + fret_number) % 12;
        if (fret_note === toneNumber) {

          const ellipse_width = 16;
          const ellipse_height = 10;
          ctx.beginPath();
          ctx.ellipse(fret_x_position, string_y_position, ellipse_width, ellipse_height, 0, 0, Math.PI * 2);
          ctx.fillStyle = fillStyle
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "rgb(0, 0, 0)"
          ctx.fillText(text, fret_x_position, string_y_position+2)
        }
      }
    }
  })
}

function draw(chordRootNumber, chordInterval, instrument) {
  const canvas = document.getElementById("fretboard-canvas");
  canvas.width = canvas_styles.canvas_width * 2;
  canvas.height = canvas_styles.canvas_height * 2;
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);

    const thirdInterval = chordInterval === "major" ? 4 : 3;

    draw_frets(ctx, instrument);
    draw_strings(ctx, instrument);
    label_frets(ctx, instrument);
    label_strings(ctx, instrument);
    draw_tones(ctx, instrument, chordRootNumber, "rgb(0, 190, 0)", "R");
    draw_tones(ctx, instrument, (chordRootNumber+thirdInterval) % 12, "rgb(210, 255, 0)", "3");
    draw_tones(ctx, instrument,(chordRootNumber+7) % 12, "rgb(150, 210, 0)", "5");
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
function handleChordSelect(chordRoot) {
  if (chordRootNumbers.hasOwnProperty(chordRoot)) {
    currentChordRootNumber = chordRootNumbers[chordRoot];
    draw(currentChordRootNumber, currentChordInterval, currentInstrument);
  }
}

function handleIntervalSelect(interval) {
  if (["major", "minor"].includes(interval)) {
    currentChordInterval = interval;
    draw(currentChordRootNumber, currentChordInterval, currentInstrument);
  }
}

function handleInstrumentSelect(instrumentName) {
  if (instruments.hasOwnProperty(instrumentName)) {
    currentInstrument = instruments[instrumentName];
    draw(currentChordRootNumber, currentChordInterval, currentInstrument)
  }
}

draw(0, "major", instruments["guitar"])
