/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Background Music System - Procedural Chiptune Generator
 * Creates cheerful, upbeat music for Rainbow Sparkle Runner
 */

class BGMSystem {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrack: number = 0;
  private isPlaying: boolean = false;
  private scheduledNotes: number[] = [];
  private nextNoteTime: number = 0;
  private tempo: number = 140; // BPM
  private noteIndex: number = 0;

  // Musical scales for cheerful sounds
  private scales = {
    // C Major Pentatonic (very happy, no dissonance)
    happy: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
    // G Major Pentatonic
    upbeat: [196.00, 220.00, 246.94, 293.66, 329.63, 392.00],
    // D Major Pentatonic
    energetic: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33]
  };

  // Melody patterns for each track
  private melodies = {
    track1: [0, 2, 4, 5, 4, 2, 0, 0, 2, 4, 5, 4, 2, 1, 0, 0], // Cheerful bounce
    track2: [0, 4, 5, 4, 2, 5, 4, 2, 0, 4, 5, 4, 2, 4, 2, 0], // Energetic jump
    track3: [0, 2, 4, 2, 5, 4, 2, 0, 4, 5, 4, 2, 5, 4, 2, 0]  // Playful skip
  };

  initialize() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // 30% volume
    }
  }

  start(trackNumber?: number) {
    this.initialize();

    if (this.audioContext!.state === 'suspended') {
      this.audioContext!.resume();
    }

    // Randomly select track if not specified
    if (trackNumber === undefined) {
      this.currentTrack = Math.floor(Math.random() * 3) + 1;
    } else {
      this.currentTrack = trackNumber;
    }

    this.isPlaying = true;
    this.nextNoteTime = this.audioContext!.currentTime;
    this.noteIndex = 0;
    this.scheduleNotes();
  }

  stop() {
    this.isPlaying = false;
    this.scheduledNotes.forEach(id => clearTimeout(id));
    this.scheduledNotes = [];
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  private scheduleNotes() {
    if (!this.isPlaying || !this.audioContext || !this.masterGain) return;

    const secondsPerBeat = 60.0 / this.tempo;
    const scheduleAheadTime = 0.1; // Schedule 100ms ahead

    while (this.nextNoteTime < this.audioContext.currentTime + scheduleAheadTime) {
      this.playNote(this.nextNoteTime);
      this.nextNoteTime += secondsPerBeat / 2; // Eighth notes
      this.noteIndex++;
    }

    // Schedule next batch
    const timeoutId = window.setTimeout(() => this.scheduleNotes(), 50);
    this.scheduledNotes.push(timeoutId);
  }

  private playNote(time: number) {
    if (!this.audioContext || !this.masterGain) return;

    // Select scale and melody based on current track
    const scaleKey = this.currentTrack === 1 ? 'happy' :
                     this.currentTrack === 2 ? 'upbeat' : 'energetic';
    const melodyKey = `track${this.currentTrack}` as keyof typeof this.melodies;

    const scale = this.scales[scaleKey];
    const melody = this.melodies[melodyKey];

    const notePattern = melody[this.noteIndex % melody.length];
    const frequency = scale[notePattern];

    // Create oscillator for the note
    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    oscillator.type = 'square'; // Chiptune sound
    oscillator.frequency.value = frequency;

    // ADSR envelope (simple)
    const noteDuration = 0.15;
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(0.15, time + 0.01); // Attack
    noteGain.gain.linearRampToValueAtTime(0.1, time + 0.05); // Decay
    noteGain.gain.setValueAtTime(0.1, time + noteDuration - 0.02); // Sustain
    noteGain.gain.linearRampToValueAtTime(0, time + noteDuration); // Release

    oscillator.connect(noteGain);
    noteGain.connect(this.masterGain);

    oscillator.start(time);
    oscillator.stop(time + noteDuration);

    // Add harmony note (fifth) on certain beats for richness
    if (this.noteIndex % 4 === 0) {
      const harmonyOsc = this.audioContext.createOscillator();
      const harmonyGain = this.audioContext.createGain();

      harmonyOsc.type = 'square';
      harmonyOsc.frequency.value = frequency * 1.5; // Perfect fifth

      harmonyGain.gain.setValueAtTime(0, time);
      harmonyGain.gain.linearRampToValueAtTime(0.08, time + 0.01);
      harmonyGain.gain.linearRampToValueAtTime(0.05, time + 0.05);
      harmonyGain.gain.linearRampToValueAtTime(0, time + noteDuration);

      harmonyOsc.connect(harmonyGain);
      harmonyGain.connect(this.masterGain);

      harmonyOsc.start(time);
      harmonyOsc.stop(time + noteDuration);
    }

    // Bass note on downbeats
    if (this.noteIndex % 8 === 0) {
      const bassOsc = this.audioContext.createOscillator();
      const bassGain = this.audioContext.createGain();

      bassOsc.type = 'triangle'; // Warmer bass
      bassOsc.frequency.value = frequency / 2; // Octave lower

      bassGain.gain.setValueAtTime(0, time);
      bassGain.gain.linearRampToValueAtTime(0.2, time + 0.01);
      bassGain.gain.linearRampToValueAtTime(0, time + 0.2);

      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain);

      bassOsc.start(time);
      bassOsc.stop(time + 0.2);
    }
  }
}

// Singleton instance
export const bgm = new BGMSystem();
