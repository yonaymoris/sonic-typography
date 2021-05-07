const TEXT = "Almost before we knew it, we had left the ground.";
let glyphs;
let ctx;
let canvas;
let glyphPaths = [];
let glyphPathsState1 = [];
let glyphPathsState2 = [];
let textXPos;
let oldMouseXValue = -1;
let oldMouseYValue = 0;
let snowflakes = [];

let fonts = [];

// Sequencer
// let bpm = 60;
// let beat = 0;

// let nSteps = 8;
// let currentStep = 0;

// let nTracks = 4;
// let cells = [];
// let playButton;

// // Sound
// let kit;
// let drumNames = ["kick", "snare", "hh", "hho"];
// kit = new Tone.Players(
//     {
//       "kick" : "/samples/505/kick.mp3",
//       "snare" : "/samples/505/snare.mp3",
//       "hh" : "/samples/505/hh.mp3",
//       "hho" : "/samples/505/hho.mp3",
//     }
// );
// kit.toDestination();
// Tone.Transport.scheduleRepeat(onBeat, "4n");

// function onBeat(time){
//   let velocity = 0.5;
//   currentStep = beat % nSteps;
//   for(let track = 0; track < nTracks; track++){
//     if(cells[track][currentStep]){
//       let hh = kit.player(drumNames[track]);
//       hh.start(time);
//     }
//   }
//   beat++; 
// }

let timer;
async function preload() {
  opentype.load('fonts/Girassol-Regular.ttf', function(err, font) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    } else {
       fonts.push(font);
    }
  });

  opentype.load('fonts/RobotoMono-VariableFont_wght.ttf', function(err, font) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    } else {
      fonts.push(font);
    }
  });

  opentype.load('fonts/Pangolin-Regular.ttf', function(err, font) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    } else {
      fonts.push(font);
    }
  });

  opentype.load('fonts/RockSalt-Regular.ttf', function(err, font) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    } else {
      fonts.push(font);
    }
  });

  opentype.load('fonts/Ultra-Regular.ttf', function(err, font) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    } else {
      fonts.push(font);
    }
  });
  await new Promise(resolve => (timer = setTimeout(resolve, 1000)));
  console.log("Finished loading fonts.")
  console.log(fonts);

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");

  textXPos = width/2 - 450;
  // background(220);

  ctx = document.getElementById('canvas').getContext('2d');
  // const path = currentFont.getPath(TEXT, 20, 100, 36);
  // path.draw(ctx);

  setupGlyphs(0);

  // sequence initialization

  // let probability;
  // // Initialize all sequencer cells.ON: 1. OFF: 0.
  // for(let track = 0; track < nTracks; track++){
  //   cells[track] = [];
  //   for(let step = 0; step < nSteps; step++){
  //       probability = Math.random();
  //     console.log(probability);
  //       if (probability > 0.8) cells[track][step] = 1;
  //       else cells[track][step] = 0
  //   }
  // }
}

function setupGlyphs(index) {
  // currentFont = font2;
  // let glyph = currentFont.charToGlyph("A");
  let currentFont = index;
  glyphs = fonts[currentFont].stringToGlyphs(TEXT);
  // let glyphsPath = glyphs.getPath(20, 150, 36);
  // console.log(glyphs);
  let xPos = textXPos;
  for (let glyph of glyphs) {
    let glyphPath = glyph.getPath(xPos, height/2-30, 48);
    glyphPath.fill = "#a4aba6";
    glyphPaths.push(glyphPath)
    xPos += 18;
  }

  glyphPathsState1 = [].concat(glyphPaths);
  // console.log(glyphPathsState1);
  // glyphPathsState2.concat(glyphPaths);
}

function draw() {
  // background("#181736");
  background("#17181a");

  let t = frameCount/60;
  let fontType = Math.floor(map(mouseY, 0, height, 0, 4));
  // let bezierLevel = Math.floor(Math.floor(map(mouseX, 0, width, 4, 40))/5) * 5;
  let bezierLevel = Math.floor(map(mouseX, 0, width, 4, 40));
  
  // create a random number of snowflakes each frame
  for(var i=0; i<random(1); i++)
  {
    snowflakes.push(new snowflake(bezierLevel)); // adds new snowflake object to array
  }
  
  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes)
  {
		flake.update(t); // update snowflake position
    flake.display();// draw snowflake
	}

  // console.log(fontType, bezierLevel);

  if(fontType !== oldMouseYValue) {
    // clear();
    setupGlyphs(fontType);
    oldMouseYValue = fontType;
 }

 if(bezierLevel !== oldMouseXValue) {
    // clear();
    // console.log(glyphs);
    initDrums(40-bezierLevel);
    // reducePointsInGlyphs(bezierLevel);
    oldMouseXValue = bezierLevel;
 }

  // drawGlyphs();
  drawWithCurves(bezierLevel);
}

// function mousePressed() {
//   if(kit.loaded){
//     Tone.Transport.start();
//   }
// }

// snowflake class
function snowflake(bezierLevel){

  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50,0);
  this.initialangle = random(0,2*PI);
  this.size = bezierLevel * 0.03 * random(2,5);
  
  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width/2,2)));

  this.update = function(time)
  {

    // x position follows a circle
    let w = 0.6; // angular speed (larger = spins faster)
    let angle = w*time + this.initialangle;
		this.posX = width/2 + this.radius*sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size,0.5);
    
    // delete snowflake if past end of screen
    if(this.posY > height)
    {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index,1);
    }

  };

  this.display = function(){
    ellipse(this.posX,this.posY,this.size);
  };
}

function drawGlyphs() {
  stroke("#a4aba6");
  for (let i = 0; i < glyphPathsState1.length; i++) {
    glyphPathsState1[i].draw(ctx);
  }
}

// function reducePointsInGlyphs() {
//   glyphPathsState1 = [].concat(glyphPaths);
//   let xPos = textXPos;
//   // console.log(glyphPathsState1.length);
//   for (let j = 0; j < glyphPathsState1.length; j++) {
//     // glyph.draw(ctx, xPos, 150, 36);
//     if (glyphs[j]) {
//       console.log("Goes through???");
//       let glyphPath = glyphs[j].getPath(xPos, height/2-30, 48);
//       glyphPath.fill = "#a4aba6";
//       // console.log(glyphPath);
//       for(let i = 0; i < fontSlider.value(); i++) {
        
//         glyphPath.commands.splice(Math.floor(Math.random() * glyphPath.commands.length), 1);
//       }
//       glyphPathsState1[j] = glyphPath;
//       // glyphPath.draw(ctx);
//       xPos += 18;
//     }
//   }
// }

// let newPoint;
// function addPointsInGlyphs() {
//   glyphPathsState1 = [].concat(glyphPaths);
//   let xPos = textXPos;
//   for (let j = 0; j < glyphs; j++) {
//     let glyphPath = glyphs[j].getPath(xPos, height/2-30, 48);
//     glyphPath.fill = "#a4aba6";

//     for(let i = 0; i < fontSlider2.value(); i++) {
//       let currentIndex = Math.floor(Math.random() * (glyphPath.commands.length - 1));
//       let newPoint = glyphPath.commands[0];
//       if (newPoint) {
//         newPoint.x = (glyphPath.commands[currentIndex].x + glyphPath.commands[currentIndex+1].x) / 2;
//         newPoint.y = (glyphPath.commands[currentIndex].y + glyphPath.commands[currentIndex+1].y) / 2;
//         glyphPath.commands.push(newPoint);
//         glyphPath.commands.splice(currentIndex, 1);
//       }
//     }
//     glyphPathsState1[j] = glyphPath;
//     // glyphPath.draw(ctx);
//     xPos += 18;
//   }
// }

function drawWithCurves(level) {
  let xPos = textXPos;

  let step = level;
  let gap = Math.floor(step / 4);
  for (let glyph of glyphs) {
    let glyphPath = glyph.getPath(xPos, height/2-30, 54);

    let continuation;
    for (let i = 0; i < glyphPath.commands.length - step; i += 1) {
      // noFill();
      stroke("#ffffff");
      strokeWeight(2);
      if (continuation) {
        curve(continuation.x, continuation.y, glyphPath.commands[i+gap-1].x, glyphPath.commands[i+gap-1].y, glyphPath.commands[i+gap*2-1].x, glyphPath.commands[i+gap*2-1].y, glyphPath.commands[i+gap*3-1].x, glyphPath.commands[i+gap*3-1].y);
      } else {
        curve(glyphPath.commands[i].x, glyphPath.commands[i].y, glyphPath.commands[i+gap].x, glyphPath.commands[i+gap].y, glyphPath.commands[i+gap*2].x, glyphPath.commands[i+gap*2].y, glyphPath.commands[i+gap*3].x, glyphPath.commands[i+gap*3].y);
        continuation = {
          x: glyphPath.commands[i+3].x,
          y: glyphPath.commands[i+3].y
        }
      }
    }
    xPos += 18;
  }
}

// MAMAGENTAA
// const TWINKLE_TWINKLE = {
//   notes: [
//     {pitch: 60, startTime: 0.0, endTime: 0.5},
//     {pitch: 60, startTime: 0.5, endTime: 1.0},
//     {pitch: 67, startTime: 1.0, endTime: 1.5},
//     {pitch: 67, startTime: 1.5, endTime: 2.0},
//     {pitch: 69, startTime: 2.0, endTime: 2.5},
//     {pitch: 69, startTime: 2.5, endTime: 3.0},
//     {pitch: 67, startTime: 3.0, endTime: 4.0},
//     {pitch: 65, startTime: 4.0, endTime: 4.5},
//     {pitch: 65, startTime: 4.5, endTime: 5.0},
//     {pitch: 64, startTime: 5.0, endTime: 5.5},
//     {pitch: 64, startTime: 5.5, endTime: 6.0},
//     {pitch: 62, startTime: 6.0, endTime: 6.5},
//     {pitch: 62, startTime: 6.5, endTime: 7.0},
//     {pitch: 60, startTime: 7.0, endTime: 8.0},
//   ],
//   tempos: [{
//     time: 0, 
//     qpm: 120
//   }],
//   totalTime: 8
// };

// const ORIGINAL_TWINKLE_TWINKLE = {
//   notes: [
//     {pitch: 60, startTime: 0.0, endTime: 0.5},
//     {pitch: 60, startTime: 0.5, endTime: 1.0},
//     {pitch: 67, startTime: 1.0, endTime: 1.5},
//     {pitch: 67, startTime: 1.5, endTime: 2.0},
//     {pitch: 69, startTime: 2.0, endTime: 2.5},
//     {pitch: 69, startTime: 2.5, endTime: 3.0},
//     {pitch: 67, startTime: 3.0, endTime: 4.0},
//     {pitch: 65, startTime: 4.0, endTime: 4.5},
//     {pitch: 65, startTime: 4.5, endTime: 5.0},
//     {pitch: 64, startTime: 5.0, endTime: 5.5},
//     {pitch: 64, startTime: 5.5, endTime: 6.0},
//     {pitch: 62, startTime: 6.0, endTime: 6.5},
//     {pitch: 62, startTime: 6.5, endTime: 7.0},
//     {pitch: 60, startTime: 7.0, endTime: 8.0},
//   ],
//   tempos: [{
//     time: 0, 
//     qpm: 120
//   }],
//   totalTime: 8
// };

// const LITTLE_TEAPOT = {
//   notes: [
//     { pitch: 69, quantizedStartStep: 0, quantizedEndStep: 2, program: 0 },
//     { pitch: 71, quantizedStartStep: 2, quantizedEndStep: 4, program: 0 },
//     { pitch: 73, quantizedStartStep: 4, quantizedEndStep: 6, program: 0 },
//     { pitch: 74, quantizedStartStep: 6, quantizedEndStep: 8, program: 0 },
//     { pitch: 76, quantizedStartStep: 8, quantizedEndStep: 10, program: 0 },
//     { pitch: 81, quantizedStartStep: 12, quantizedEndStep: 16, program: 0 },
//     { pitch: 78, quantizedStartStep: 16, quantizedEndStep: 20, program: 0 },
//     { pitch: 81, quantizedStartStep: 20, quantizedEndStep: 24, program: 0 },
//     { pitch: 76, quantizedStartStep: 24, quantizedEndStep: 26, program: 0 }
//   ],
//   quantizationInfo: { stepsPerQuarter: 4 },
//   totalQuantizedSteps: 26,
// };

// rnn_steps = 20;
// rnn_temperature = 1.5;

// function mousePressed() {
//   playInterpolation();
//   console.log("Music Playing...");
// }

// // Initialize the model.
// music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
// music_rnn.initialize();

// // Create a player to play the sequence we'll get from the model.
// rnnPlayer = new mm.Player();

// function play() {
//   if (rnnPlayer.isPlaying()) {
//     rnnPlayer.stop();
//     return;
//   }
      
//   // The model expects a quantized sequence, and ours was unquantized:
//   const qns = mm.sequences.quantizeNoteSequence(ORIGINAL_TWINKLE_TWINKLE, 4);
//   music_rnn
//   .continueSequence(qns, rnn_steps, rnn_temperature)
//   .then((sample) => rnnPlayer.start(sample));
// }

// // Interpolatingg


// // Initialize the model.
// vae_temperature = 1.5;
// music_vae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2');
// music_vae.initialize();

// // Create a player to play the sampled sequence.
// vaePlayer = new mm.Player();

// function playVAE() {
//   if (vaePlayer.isPlaying()) {
//     vaePlayer.stop();
//     return;
//   }
//   music_vae
//   .sample(1, vae_temperature)
//   .then((sample) => vaePlayer.start(sample[0]));
// }

// function playInterpolation() {
//   if (vaePlayer.isPlaying()) {
//     vaePlayer.stop();
//     return;
//   }
//   // Music VAE requires quantized melodies, so quantize them first.
//   const star = mm.sequences.quantizeNoteSequence(TWINKLE_TWINKLE, 4);
//   const teapot = mm.sequences.quantizeNoteSequence(LITTLE_TEAPOT, 4);
//   music_vae
//   .interpolate([star, teapot], 4)
//   .then((sample) => {
//     const concatenated = mm.sequences.concatenate(sample);
//     vaePlayer.start(concatenated);
//   });
// }

// DRUM MACHINE

const board = new Board();
let player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/jazz_kit');

let isMouseDown = false; // So that we can drag and draw.
let playerHardStop = false;  // Actually stop the player from re-looping.

init();

function init() {
  // Set up the player.
  player.callbackObject = {
    run: (note) => board.playStep(note),
    stop: () => {
      if (playerHardStop) {
        stop();
      } else {
        play();
      }
    }
  };
  
  // Load all SoundFonts so that they're ready for clicking on cells.
  const allNotes = [];
  for (let i = 0; i < PITCHES.length; i++) {
    allNotes.push({pitch: PITCHES[i], velocity: 80, isDrum: true});
  }
  player.loadSamples({notes: allNotes});

  initDrums(6);
}

// function mousePressed() {
//   board.reset();
//   initDrums(15)
// }

function initDrums(steps) {  
  board.reset();
  let positions = [];
  let posX;
  let posY;
  for(let i = 0; i < steps; i++) {
    do {
      posX = Math.floor(Math.random() * 31);
      posY = Math.floor(Math.random() * 8);
    } while (includesCoordinates(posX, posY, positions));
    positions.push([posX, posY]);
    board.toggleCell(posY, posX);
  }

  play();
}

function includesCoordinates(x, y, arr) {
  for (let el of arr) {
    if (el[0] === x && el[1] === y) return true
  }
  
  return false;
}

function play() {
  // btnPlay.textContent = 'stop';
  // board.playEnd();
  // document.getElementById('container').classList.add('playing');
  
  // Merge the current notes and start the player.
  const sequence = board.getNoteSequence();
  player.start(sequence);
}

