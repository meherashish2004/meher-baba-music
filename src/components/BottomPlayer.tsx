'use client'

import { useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '../store/userPlayerStore'
import { supabase } from '@/lib/supabase'
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DraggableSlider from '@/components/ui/draggable-slider'

export default function BottomPlayer() {
  const { currentSong, isPlaying, play, pause, volume, setVolume, isLyricsOpen, toggleLyrics, setCurrentSong } = usePlayerStore()
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [localProgress, setLocalProgress] = useState(0)
  const [localVolume, setLocalVolume] = useState(volume * 100)
  const [isDragging, setIsDragging] = useState(false)

  // Effect 1: Reload audio and play when the SONG changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentSong])

  // Effect 2: Handle play/pause toggle
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Effect 3: Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
    setLocalVolume(volume * 100)
  }, [volume])

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const current = audioRef.current.currentTime
      const total = audioRef.current.duration
      setLocalProgress((current / total) * 100 || 0)
    }
  }

  const togglePlay = () => {
    if (isPlaying) pause()
    else play()
  }

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setLocalProgress(0)
      setIsDragging(false)
      if (!isPlaying) play()
    }
  }

  const handleSkipForward = async () => {
    if (!currentSong) return

    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .neq('id', currentSong.id)
      .limit(50)

    if (error) {
      console.error('Skip forward error:', error)
      return
    }

    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length)
      setCurrentSong(data[randomIndex])
      play()
    } else {
      handleSkipBack()
    }
  }

  if (!currentSong) return null

  return (
    <>
      {/* LYRICS OVERLAY */}
      <div 
        className={`fixed inset-0 bottom-24 bg-slate-950/95 backdrop-blur-2xl z-40 transition-all duration-500 ease-in-out overflow-y-auto flex flex-col md:flex-row p-6 md:p-16 gap-10 md:gap-16 items-start
          ${isLyricsOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
        `}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-6 right-6 md:top-10 md:right-10 text-slate-400 hover:text-white hover:bg-slate-800" 
          onClick={toggleLyrics}
        >
          <span className="text-2xl">↓</span>
        </Button>

        {/* Left Column: Album Art */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 md:sticky md:top-10 mt-10 md:mt-0">
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-800 shadow-2xl">
            {currentSong.cover_image_url ? (
              <img src={currentSong.cover_image_url} alt={currentSong.title} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-32 h-32 text-slate-600" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-1">{currentSong.title}</h1>
            <h2 className="text-xl text-slate-400">{currentSong.singer}</h2>
            {currentSong.author && (
              <p className="text-sm text-slate-500 mt-2">Written by {currentSong.author}</p>
            )}
          </div>
        </div>

        {/* Right Column: Lyrics */}
        <div className="w-full md:w-2/3 flex flex-col pb-12 mt-4 md:mt-0">
          {currentSong.lyrics ? (
            <div className="whitespace-pre-wrap text-2xl md:text-4xl leading-relaxed md:leading-[1.7] font-bold text-white/90">
              {currentSong.lyrics}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 border border-slate-800 rounded-xl border-dashed">
              <p className="text-lg">Lyrics haven't been added for this track yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM PLAYER */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-slate-950 border-t border-slate-800 text-white flex items-center px-4 md:px-8 z-50">
        <audio
          ref={audioRef}
          src={currentSong.audio_file_url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleSkipForward}
        />

        {/* Left: Song Info */}
        <div className="flex items-center gap-4 w-1/3">
          {currentSong.cover_image_url ? (
            <img src={currentSong.cover_image_url} alt="cover" className="h-14 w-14 rounded-md object-cover shadow-md" />
          ) : (
            <div className="h-14 w-14 rounded-md bg-slate-800 flex items-center justify-center">
              <Music className="w-6 h-6 text-slate-600" />
            </div>
          )}
          <div className="flex flex-col truncate">
            <span className="font-semibold text-sm truncate">{currentSong.title}</span>
            <span className="text-xs text-slate-400 truncate">{currentSong.singer}</span>
          </div>
        </div>

        {/* Center: Controls + Progress */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSkipBack} 
              className="text-slate-400 hover:text-white"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full h-10 w-10 flex items-center justify-center bg-white text-black hover:bg-slate-200" 
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-1" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSkipForward} 
              className="text-slate-400 hover:text-white"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="w-full flex items-center max-w-md">
            <DraggableSlider
              value={localProgress}
              onChange={(val) => { setIsDragging(true); setLocalProgress(val) }}
              onCommit={(val) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = (val / 100) * audioRef.current.duration
                }
                setIsDragging(false)
              }}
            />
          </div>
        </div>

        {/* Right: Lyrics Toggle + Volume */}
        <div className="flex items-center justify-end gap-4 w-1/3 pr-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLyrics}
            className={`transition-colors ${isLyricsOpen ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'}`}
          >
            <Mic2 className="h-5 w-5" />
          </Button>

          <Volume2 className="h-5 w-5 text-slate-400 ml-2" />
          <div className="w-24">
            <DraggableSlider
              value={localVolume}
              onChange={(val) => { setLocalVolume(val); setVolume(val / 100) }}
            />
          </div>
        </div>
      </div>
    </>
  )
}