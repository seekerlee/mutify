let audioContext;

async function playAdMutedCue() {
  audioContext ??= new AudioContext();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const startTime = audioContext.currentTime;

  for (const [frequency, delay] of [
    [880, 0],
    [1175, 0.055]
  ]) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const noteStartTime = startTime + delay;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, noteStartTime);

    gain.gain.setValueAtTime(0.04, noteStartTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStartTime + 0.09);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(noteStartTime);
    oscillator.stop(noteStartTime + 0.09);
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "play-ad-muted-cue") {
    void playAdMutedCue().catch((error) => {
      console.error("Failed to generate the ad-muted cue:", error);
    });
  }
});
