// @ts-check

(() => {
  const context = new window.AudioContext();

  const notes = {
    C: 16.35,
    "C#": 17.32,
    D: 18.35,
    "D#": 19.45,
    E: 20.6,
    F: 21.83,
    "F#": 23.12,
    G: 24.5,
    "G#": 25.96,
    A: 27.5,
    "A#": 29.14,
    B: 30.87,
  };

  const chiptune = (() => {
    const real = Array.from({ length: 8192 }, (_, n) =>
      n === 0 ? 0 : (4 / (n * Math.PI)) * Math.sin(Math.PI * n * 0.18),
    );
    const imag = real.map(() => 0);
    return { real, imag };
  })();

  function playTone(note, octave, start, duration, oscilatorType = "sine") {
    const osc = context.createOscillator();
    osc.setPeriodicWave(
      context.createPeriodicWave(chiptune.real, chiptune.imag),
    );
    if (note === "_") {
      // Pause
    } else {
      osc.frequency.value = notes[note] * 2 ** octave;
      osc.connect(context.destination);
      osc.start(context.currentTime + start);
      osc.stop(context.currentTime + start + duration);
    }
  }

  const melody = [
    // Ja, må hen leva
    "D#4/4 D#4/8. D#4/16 D#4/4 A#3/4",
    // Ja, må hen leva
    "G4/4 G4/8. G4/16 G4/4 D#4/4",
    // Ja, må hen leva uti
    "A#4/4 A#4/8. A#4/16 C5/8 A#4/8 G#4/8 G4/8",
    // hundrade år.
    "G4/4 F4/8. F4/16 F4/4 _0/4",
    // Ja, må hen leva
    "G#4/4 G#4/8. G4/16 F4/4 F4/4",
    // Ja, må hen leva
    "G4/4 G4/8. F4/16 D#4/4 D#4/4",
    // Ja, må hen leva uti
    "F4/4 F4/8. F4/16 D#4/8 D4/8 C4/8 D4/8",
    // hundrade år.
    "D#4/4 G4/8. A#4/16 D#4/2",
  ].join(" ");
  const noteLengthMultiplier = 2;

  let totalDuration = 0;
  const decodedMelody = melody.split(" ").map((item, index) => {
    const parts = (/^([_A-G]#?)(\d)(\/\d+.?)?/.exec(item) ?? []).slice(1);
    let [note, octave, noteLengthPath] = parts;
    let modifier = 1;
    if (noteLengthPath.endsWith(".")) {
      noteLengthPath = noteLengthPath.slice(0, -1);
      modifier = 1.5;
    }
    // octave = +octave + 1;

    const noteLength =
      noteLengthMultiplier *
      (1 / (noteLengthPath ? +noteLengthPath.substring(1) : 4)) *
      modifier;
    // console.log("Note is: ", item, parts, note, octave, noteLength);
    const start = totalDuration;
    const micropause = 1 / 64;
    totalDuration += noteLength + micropause;
    return { note, octave, noteLength, index, start };
  });

  // console.log("Decoded melody: ", decodedMelody);

  for (const { note, octave, start, noteLength } of decodedMelody) {
    playTone(note, +octave, start, noteLength);
  }
})();
