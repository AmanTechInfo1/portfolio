import { useRef, useState, useCallback, useEffect } from 'react';

export function useAudio() {
  const audioRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState([0, 0, 0, 0, 0]);

  const setupAudio = useCallback(() => {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const audio = new Audio('/audio/amansTone.mp3');

    audio.loop = true;
    audio.crossOrigin = 'anonymous';

    audioRef.current = audio;

    const source = ctx.createMediaElementSource(audio);
    sourceRef.current = source;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;

    analyserRef.current = analyser;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    return { ctx, audio };
  }, []);

  const animateBars = useCallback(function animateBars() {
    const analyser = analyserRef.current;

    if (!analyser) return;

    const data = new Uint8Array(
      analyser.frequencyBinCount
    );

    analyser.getByteFrequencyData(data);

    const step = Math.floor(data.length / 5);

    const newBars = [];

    for (let i = 0; i < 5; i++) {
      const index = i * step;

      newBars.push(
        (data[index] || 0) / 255
      );
    }

    setBars(newBars);

    rafRef.current =
      requestAnimationFrame(animateBars);
  }, []);

  const play = useCallback(async () => {
    let ctx = ctxRef.current;
    let audio = audioRef.current;

    if (!ctx || !audio) {
      const result = setupAudio();

      ctx = result.ctx;
      audio = result.audio;
    }

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    try {
      await audio.play();

      setIsPlaying(true);

      if (!rafRef.current) {
        rafRef.current =
          requestAnimationFrame(animateBars);
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }, [setupAudio, animateBars]);

  const stop = useCallback(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setIsPlaying(false);
    setBars([0, 0, 0, 0, 0]);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (ctxRef.current) {
        ctxRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    toggle,
    bars,
  };
}