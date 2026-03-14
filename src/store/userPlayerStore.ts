import { create } from 'zustand'

export interface Song {
  id: string
  title: string
  singer: string
  author: string
  cover_image_url: string
  audio_file_url: string
  duration: number
  lyrics: string
  language: string
  theme: string
}

interface PlayerStore {
  currentSong: Song | null
  isPlaying: boolean
  volume: number
  isLyricsOpen: boolean // <-- NEW
  setCurrentSong: (song: Song) => void
  play: () => void
  pause: () => void
  setVolume: (volume: number) => void
  toggleLyrics: () => void // <-- NEW
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentSong: null,
  isPlaying: false,
  volume: 1,
  isLyricsOpen: false, // <-- Starts closed
  
  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume }),
  toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen })), // <-- Flips it open/closed
}))