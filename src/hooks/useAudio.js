import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Ambient synth pad using Web Audio API.
 * Creates a lush, evolving pad sound when toggled on.
 */
export function useAudio() {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState([0, 0, 0, 0, 0]);
  const rafRef = useRef(null);
  const analyserRef = useRef(null);

  const createPad = useCallback(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);

    // Reverb via convolver (simple impulse)
    const convolver = ctx.createConvolver();
    const rate = ctx.sampleRate;
    const len = rate * 2;
    const impulse = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
      }
    }
    convolver.buffer = impulse;

    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.3;
    convolver.connect(reverbGain);
    reverbGain.connect(masterGain);

    // Dry path
    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.7;
    dryGain.connect(masterGain);

    // Low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2200;
    filter.Q.value = 0.5;
    filter.connect(dryGain);
    filter.connect(convolver);

    // LFO for gentle modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 80;
    lfo.connect(lfoGain);
    lfo.start();

    // Pad notes (lush chord)
    const notes = [
      { freq: 130.81, type: 'sine' },     // C3
      { freq: 196.00, type: 'sine' },     // G3
      { freq: 261.63, type: 'triangle' }, // C4
      { freq: 329.63, type: 'sine' },     // E4
      { freq: 392.00, type: 'sine' },     // G4
    ];

    const nodes = [];
    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = note.type;
      osc.frequency.value = note.freq;
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(filter);
      lfoGain.connect(osc.frequency);
      osc.start();
      nodes.push({ osc, gain });
    });

    // Sub bass
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.value = 65.41; // C2
    subGain.gain.value = 0.08;
    sub.connect(subGain);
    subGain.connect(filter);
    sub.start();
    nodes.push({ osc: sub, gain: subGain });

    // Analyser for visualizer bars
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    masterGain.connect(analyser);
    analyserRef.current = analyser;

    nodesRef.current = nodes;

    // Fade in
    masterGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);

    return { masterGain, ctx };
  }, []);

  const animateBars = useCallback(function animateBars() {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    // Sample 5 bars from the frequency data
    const step = Math.floor(data.length / 5);
    const newBars = [];
    for (let i = 0; i < 5; i++) {
      const idx = i * step;
      newBars.push((data[idx] || 0) / 255);
    }
    setBars(newBars);
    rafRef.current = requestAnimationFrame(animateBars);
  }, []);

  const play = useCallback(() => {
    if (ctxRef.current) {
      // Resume if suspended
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      return;
    }
    createPad();
    setIsPlaying(true);
  }, [createPad]);

  const stop = useCallback(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    // Fade out
    nodesRef.current.forEach(({ osc }) => {
      try { osc.stop(ctx.currentTime + 0.5); } catch {}
    });
    setTimeout(() => {
      ctx.close();
    }, 600);
    ctxRef.current = null;
    nodesRef.current = [];
    analyserRef.current = null;
    setIsPlaying(false);
    setBars([0, 0, 0, 0, 0]);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else play();
  }, [isPlaying, play, stop]);

  // Start bar animation when playing
  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(animateBars);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, animateBars]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        try { ctxRef.current.close(); } catch {}
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { isPlaying, toggle, bars };
}
