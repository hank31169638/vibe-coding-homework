import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  isMusicPlaying: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  toggleMusic: () => void;
  playHit: () => void;
  playSuccess: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: false,
  isMusicPlaying: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic, isMusicPlaying } = get();
    const newMutedState = !isMuted;
    
    // Update mute state
    set({ isMuted: newMutedState });
    
    // Also mute/unmute background music if it's playing
    if (backgroundMusic && isMusicPlaying) {
      backgroundMusic.muted = newMutedState;
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },

  toggleMusic: () => {
    const { backgroundMusic, isMusicPlaying, isMuted } = get();
    
    if (!backgroundMusic) {
      console.log("Background music not loaded yet");
      return;
    }
    
    const newMusicState = !isMusicPlaying;
    
    if (newMusicState) {
      // Start playing
      backgroundMusic.volume = 0.3;
      backgroundMusic.loop = true;
      backgroundMusic.muted = isMuted;
      
      // Handle when music ends (for non-looping scenarios)
      backgroundMusic.onended = () => {
        set({ isMusicPlaying: false });
      };
      
      backgroundMusic.play().catch(error => {
        console.log("Music play prevented:", error);
        set({ isMusicPlaying: false });
      });
      console.log("Background music started");
    } else {
      // Stop playing
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      console.log("Background music stopped");
    }
    
    set({ isMusicPlaying: newMusicState });
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (!hitSound) return;
    
    // If sound is muted, don't play anything
    if (isMuted) {
      console.log("Hit sound skipped (muted)");
      return;
    }
    
    // Clone the sound to allow overlapping playback
    const soundClone = hitSound.cloneNode() as HTMLAudioElement;
    soundClone.volume = 0.3;
    soundClone.muted = isMuted;
    soundClone.play().catch(error => {
      console.log("Hit sound play prevented:", error);
    });
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (!successSound) return;
    
    // If sound is muted, don't play anything
    if (isMuted) {
      console.log("Success sound skipped (muted)");
      return;
    }
    
    successSound.currentTime = 0;
    successSound.muted = isMuted;
    successSound.play().catch(error => {
      console.log("Success sound play prevented:", error);
    });
  }
}));
