/**
 * Web Audio Engine for Yalla Games
 * Provides synthesized procedural game sound effects, room soundboard,
 * and live microphone capture with audio analysis for speaking visualizers.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private micVolume: number = 0;
  private isListeningMic: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getContext(): AudioContext | null {
    this.initContext();
    return this.ctx;
  }

  // SOUND EFFECTS
  public playDiceRoll() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Synthesize 5 rapid wooden clacks
      for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280 + Math.random() * 180, now + i * 0.06);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600 + Math.random() * 400, now + i * 0.06);
        filter.Q.value = 4;

        gain.gain.setValueAtTime(0.2, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.06);
      }
    } catch {
      // Audio fallback
    }
  }

  public playPawnStep() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio fallback
    }
  }

  public playPawnCapture() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Punchy impact bass + noise
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio fallback
    }
  }

  public playDominoSnap() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(190, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  public playWheelTick() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback
    }
  }

  public playVictoryFanfare() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {
      // Audio fallback
    }
  }

  // SOUNDBOARD EFFECTS
  public playSoundboard(effect: 'applause' | 'cheer' | 'laugh' | 'airhorn' | 'jackpot' | 'drumroll') {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;

      if (effect === 'airhorn') {
        const chord = [370, 370, 440, 554];
        chord.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.setValueAtTime(0.15, now + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
        });
      } else if (effect === 'jackpot') {
        const arpeggio = [523, 659, 783, 1046, 1318, 1567, 2093];
        arpeggio.forEach((f, i) => {
          if (!this.ctx) return;
          const t = now + i * 0.07;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.3);
        });
      } else if (effect === 'drumroll') {
        for (let i = 0; i < 18; i++) {
          const t = now + i * 0.04;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140 + Math.random() * 40, t);
          gain.gain.setValueAtTime(0.1 + (i / 18) * 0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.05);
        }
      } else {
        // Applause / Cheer / Laugh sound synthesis
        for (let i = 0; i < 20; i++) {
          const t = now + Math.random() * 0.8;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = effect === 'laugh' ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(300 + Math.random() * 500, t);
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.15);
        }
      }
    } catch {
      // Audio fallback
    }
  }

  // REAL MICROPHONE CAPTURE & ANALYZER
  public async startMicrophone(): Promise<boolean> {
    try {
      this.initContext();
      if (!this.ctx) return false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micStream = stream;
      this.micSource = this.ctx.createMediaStreamSource(stream);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.5;

      this.micSource.connect(this.analyser);
      this.isListeningMic = true;
      this.monitorMicLevel();
      return true;
    } catch (err) {
      console.warn('Microphone permission not granted or device unavailable:', err);
      return false;
    }
  }

  public stopMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    this.isListeningMic = false;
    this.micVolume = 0;
  }

  private monitorMicLevel() {
    if (!this.isListeningMic || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    const update = () => {
      if (!this.isListeningMic || !this.analyser) {
        this.micVolume = 0;
        return;
      }
      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      this.micVolume = Math.min(1, avg / 80); // Normalized 0 to 1

      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  public getLiveMicLevel(): number {
    return this.micVolume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public isAudioMuted(): boolean {
    return this.isMuted;
  }
}

export const audioEngine = new AudioEngine();
