const context = new (window.AudioContext || window.webkitAudioContext)();

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

function playTone(note, octave, start, duration) {
  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.value = notes[note] * 2 ** octave;
  osc.connect(context.destination);
  osc.start(context.currentTime + start);
  osc.stop(context.currentTime + start + duration);
}

const melody = "C4 D4/8 E4 C#4/16";

const decodedMelody = melody.split(" ").map((item, index) => {
  const parts = /^([A-G]#?)(\d)(\/\d+)?/.exec(item).slice(1);
  let [note, octave, noteLength] = parts;
  noteLength = noteLength ?? "/4";
  console.log("Note is: ", parts, note, octave, noteLength);
  return { note, octave, noteLength, index };
});

// playTone(note, parseInt(octave), index, 1);
