'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { usePlayerStore, Song } from '../../../src/store/userPlayerStore'
import { Play, Music } from 'lucide-react'

export default function ThemePage() {
  const params = useParams()
  const category = params.category as string // Grabs "aarti", "bhajan", etc. from the URL
  
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { setCurrentSong, currentSong } = usePlayerStore()

  // Make the URL text look pretty for the header (e.g., "bhajan" -> "Bhajans")
  const pageTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1) + 's' 
    : 'Songs'

  useEffect(() => {
    async function fetchThemeSongs() {
      setIsLoading(true)
      
      // We use .ilike() for a case-insensitive search (matches "Aarti" or "aarti")
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .ilike('theme', category)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error("Error fetching theme songs:", error)
      } else {
        setSongs(data || [])
      }
      setIsLoading(false)
    }
    
    if (category) {
      fetchThemeSongs()
    }
  }, [category])

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">{pageTitle}</h1>
      </div>
      
      {isLoading ? (
        <div className="text-slate-500 mt-12 text-center">Loading {pageTitle}...</div>
      ) : songs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song) => {
            const isPlaying = currentSong?.id === song.id

            return (
              <div 
                key={song.id} 
                onClick={() => setCurrentSong(song)}
                className={`group flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md ${
                  isPlaying 
                    ? 'bg-slate-800 border-slate-700' 
                    : 'bg-slate-900/50 hover:bg-slate-800 border-slate-800/50 hover:border-slate-700'
                } border`}
              >
                {/* Album Art with Hover Play Icon */}
                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-slate-800">
                  {song.cover_image_url ? (
                    <img src={song.cover_image_url} alt={song.title} className="object-cover w-full h-full" />
                  ) : (
                    <Music className="absolute inset-0 m-auto h-6 w-6 text-slate-500" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Play className="h-6 w-6 text-white fill-current ml-1" />
                  </div>
                </div>
                
                {/* Song Metadata */}
                <div className="flex flex-col flex-grow truncate">
                  <h2 className={`font-medium truncate ${isPlaying ? 'text-white' : 'text-slate-200'}`}>
                    {song.title}
                  </h2>
                  <p className="text-slate-400 text-sm truncate">
                    {song.singer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-slate-500 mt-12 flex flex-col items-center justify-center text-center p-8 border border-slate-800 border-dashed rounded-xl bg-slate-900/20">
          <Music className="h-12 w-12 opacity-20 mb-4" />
          <p>No {pageTitle.toLowerCase()} found in the database yet.</p>
          <p className="text-sm mt-2">Make sure the "theme" column in Supabase is set to "{category}".</p>
        </div>
      )}
    </main>
  )
}