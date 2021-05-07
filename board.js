const PIXELS_WIDTH = 32; // You can change this if you want more/fewer notes.

// These are the drum pitches in magenta.js. They
// are defined here: https://github.com/tensorflow/magenta-js/blob/master/music/src/core/data.ts#L34
const PITCHES = [36, 38, 42, 46, 45, 48, 50, 49, 51];

/***********************************
 * Board of dots
 ***********************************/
class Board {
  constructor() {
    this.data = [];
    this.ui = {}; // Gets populated by this.reset().
    this.reset();
    this.isPlaying = false;
  }

  reset() {
    this.data = [];
    this.ui.container = document.getElementById('container');
    this.ui.container.innerHTML = '';

    // Recreate the board.
    for (let i = 0; i < PITCHES.length; i++) {
      const pitch = PITCHES[i];
      
      // Create a row of pixels.
      this.data.push([]);
      const rowEl = document.createElement('div');
      rowEl.classList.add('row');
      rowEl.dataset.pitch = pitch;
      this.ui.container.appendChild(rowEl);

      for (let j = 0; j < PIXELS_WIDTH; j++) {
        this.data[i][j] = {on: 0};
        const button = document.createElement('button');
        button.setAttribute('aria-label', 'cell, empty');
        button.classList.add('pixel');
        button.dataset.row = i;
        button.dataset.col = j;
        button.dataset.pitch = pitch;
        
        rowEl.appendChild(button);
      }
    }
    this.ui.rows = document.querySelectorAll('.container > .row');
  }

  // Toggles a particular pixel from on to off.
  toggleCell(i, j) {
    const uiButton = document.querySelector(`.pixel[data-row="${i}"][data-col="${j}"]`);
    if (!uiButton) {
      return;
    }
  
    const row = uiButton.parentElement;
    if (row.classList.contains('hidden')) {
      return;
    }
        
    const dot = this.data[i][j];
    const pitch = PITCHES[i];
    
    if (dot.on === 0) {
      dot.on = 1;
      this.voiceButton(uiButton, pitch);
    } else {
      dot.on = 0;
      this.resetButton(uiButton);
    }
  }

  resetButton(uiButton) {
    uiButton.setAttribute('class', 'pixel');
    uiButton.setAttribute('aria-label', 'cell, empty');
  }

  voiceButton(uiButton, pitch) {
    uiButton.setAttribute('aria-label', `cell for pitch ${pitch}, on`);
    uiButton.setAttribute('class', 'pixel on');
  }

  getNoteSequence(withoutBar=false) {
    const sequence = {notes:[], quantizationInfo: {stepsPerQuarter: 4}};
    
    for (let i = 0; i < PITCHES.length; i++) {
      const row = document.querySelector(`.row[data-pitch="${PITCHES[i]}"]`);
      if (row.classList.contains('hidden')) {
        continue;
      }
      
      for (let j = 0; j < PIXELS_WIDTH; j++) {
        // This note is on.
        if (this.data[i][j].on > 0) {
          sequence.notes.push(
            { pitch: PITCHES[i],
              quantizedStartStep: j,
              quantizedEndStep: j + 1,
              isDrum: true
            },
          );
        }
      }
    }
    
    // Add a silent note on every time step so that we can draw a bar.
    if (!withoutBar) {
      for (let j = 0; j < PIXELS_WIDTH; j++) {
        sequence.notes.push(
          { pitch: PITCHES[0],
            velocity: -1,  // This makes it silent.
            isDrum: true,
            quantizedStartStep: j,
            quantizedEndStep: j + 1
          },
        );
      }
    }
    
    sequence.totalQuantizedSteps = PIXELS_WIDTH;
    return sequence;
  }

  playStep(note) {
    const r = PITCHES.indexOf(note.pitch);
    const c = note.quantizedStartStep;

    if (r != 0) {
        push();
        noStroke();
        fill(89, 56, 94, 50);
        rect(0, 0, width, height);
        pop();
    }
    // console.log(r);
    // Clear the previous step.
    const on =  document.querySelectorAll('.container .pixel.active, .pixel.bar');
    for (let p = 0; p < on.length; p++) {
      on[p].classList.remove('bar');
      if (on[p].dataset.col < c) {
        on[p].classList.remove('active');
      }
    }
  
    // Add a bar.
    const bar = document.querySelectorAll(`.pixel[data-col="${c}"]`);
    for (let p = 0; p < bar.length; p++) {
      bar[p].classList.add('bar');
    }
    
    // Add the active pixels, which overrides the bar if it exists.
    const pixels = document.querySelectorAll(`.pixel.on[data-row="${r}"][data-col="${c}"]`);
    for (let p = 0; p < pixels.length; p++) {
      pixels[p].classList.remove('bar');
      pixels[p].classList.add('active');
    }
  }
}
