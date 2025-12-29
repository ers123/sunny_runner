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
  private drumGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null; // Optimized: Cached buffer
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

      this.drumGain = this.audioContext.createGain();
      this.drumGain.connect(this.audioContext.destination);
      this.drumGain.gain.value = 0.4; // Slightly louder drums

      this.createNoiseBuffer(); // Create buffer once
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
    if (this.drumGain) {
        this.drumGain.gain.value = Math.max(0, Math.min(1, volume * 1.2));
    }
  }

  private scheduleNotes() {
    if (!this.isPlaying || !this.audioContext || !this.masterGain) return;

    const secondsPerBeat = 60.0 / this.tempo;
    const scheduleAheadTime = 0.1; // Schedule 100ms ahead

    while (this.nextNoteTime < this.audioContext.currentTime + scheduleAheadTime) {
      this.playNote(this.nextNoteTime);

      // Drum Sequencing
      // Beat 1 (0), Beat 2 (2), Beat 3 (4), Beat 4 (6) in eighth notes

      // Kick: Beats 1 and 3
      if (this.noteIndex % 4 === 0) {
          this.playDrum(this.nextNoteTime, 'kick');
      }

      // Snare: Beats 2 and 4
      if (this.noteIndex % 4 === 2) {
          this.playDrum(this.nextNoteTime, 'snare');
      }

      // Hi-hats: Every eighth note
      this.playDrum(this.nextNoteTime, 'hihat');

      this.nextNoteTime += secondsPerBeat / 2; // Eighth notes
      this.noteIndex++;
    }

    // Schedule next batch
    const timeoutId = window.setTimeout(() => this.scheduleNotes(), 50);
    this.scheduledNotes.push(timeoutId);
  }

  private createNoiseBuffer() {
      if (!this.audioContext || this.noiseBuffer) return;
      const bufferSize = this.audioContext.sampleRate * 0.1; // 0.1 seconds of noise
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
  }

  private playDrum(time: number, type: 'kick' | 'snare' | 'hihat') {
      if (!this.audioContext || !this.drumGain) return;

      if (type === 'kick') {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, time);
          osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

          gain.gain.setValueAtTime(1, time);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

          osc.connect(gain);
          gain.connect(this.drumGain);

          osc.start(time);
          osc.stop(time + 0.5);
      } else if (type === 'snare') {
          if (!this.noiseBuffer) return;
          const noise = this.audioContext.createBufferSource();
          noise.buffer = this.noiseBuffer;

          const filter = this.audioContext.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 1000;

          const gain = this.audioContext.createGain();
          gain.gain.setValueAtTime(0.8, time);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.drumGain);

          noise.start(time);
      } else if (type === 'hihat') {
           if (!this.noiseBuffer) return;
           const noise = this.audioContext.createBufferSource();
           noise.buffer = this.noiseBuffer;

           const filter = this.audioContext.createBiquadFilter();
           filter.type = 'highpass';
           filter.frequency.value = 5000;

           const gain = this.audioContext.createGain();
           // Accent on beat, softer on off-beat
           const volume = this.noteIndex % 2 === 0 ? 0.3 : 0.1;
           gain.gain.setValueAtTime(volume, time);
           gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

           noise.connect(filter);
           filter.connect(gain);
           gain.connect(this.drumGain);

           noise.start(time);
      }
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

      harmonyOsc.type = 'triangle'; // Warmer harmony
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
