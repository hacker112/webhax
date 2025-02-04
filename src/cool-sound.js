var context = new (window.AudioContext || window.webkitAudioContext)();

var notes = {
  'C': 16.35,
  'C#': 17.32,
  'D': 18.35,
  'D#': 19.45,
  'E': 20.60,
  'F': 21.83,
  'F#': 23.12,
  'G': 24.50,
  'G#': 25.96,
  'A': 27.50,
  'A#': 29.14,
  'B': 30.87
};

// var octave = 2;
// var osc = context.createOscillator();
// osc.type = 'sawtooth';
// // osc.frequency.value = notes[note]*Math.pow(2, octave);
// osc.frequency.setValueCurveAtTime([notes["C"]*Math.pow(2, octave), notes["E"]*Math.pow(2, octave), notes["G"]*Math.pow(2, octave),
// ], context.currentTime, 3);

// osc.connect(context.destination);
// osc.start();
// osc.stop(context.currentTime + 5);

function playTone(note, octave, start, duration) {
  var osc = context.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = notes[note]*Math.pow(2, octave);
  osc.connect(context.destination);
  osc.start(context.currentTime + start);
  osc.stop(context.currentTime + start+ duration);
}

var melody = "C4 E4 G4";

melody.split(' ').forEach(function(note, index) {
  playTone(note[0], parseInt(note[1]), index, 1);
});

// playTone('C',4, 1, 1);
// playTone('E',4, 2, 1);
// playTone('G',4, 3, 1);


// function playSound(type, frequency, startTime, duration) {
//   var osc = context.createOscillator(); // instantiate an oscillator
//   osc.type = type; // this is the default - also square, sawtooth, triangle
//   osc.frequency.value = frequency; // Hz
//   osc.frequency.setValueCurveAtTime()
//   osc.connect(context.destination); // connect it to the destination
//   osc.start(context.currentTime +startTime); // start the oscillator
//   osc.stop(context.currentTime + startTime+duration); // stop 2 seconds after the current time
// }

// playSound('square', 440, 0, 1);
// playSound('sine', 500, 1, 2);