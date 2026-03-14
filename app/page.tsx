'use client' // Required because we are using React state and onClick events

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayerStore, Song } from '@/src/store/userPlayerStore'
import { Play } from 'lucide-react'

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([])
  const { setCurrentSong } = usePlayerStore()

  // Fetch songs from Supabase when the page loads
  useEffect(() => {
    async function fetchSongs() {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false }) // Newest songs first
      
      if (error) {
        console.error("Error fetching songs:", error)
      } else {
        setSongs(data || [])
      }
    }
    
    fetchSongs()
  }, [])

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Listen Now</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song) => (
          <div 
            key={song.id} 
            onClick={() => setCurrentSong(song)}
            className="group flex items-center gap-4 p-3 bg-slate-900/50 hover:bg-slate-800 border border-slate-800/50 hover:border-slate-700 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            {/* Album Art with Hover Play Icon */}
            <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-slate-800">
              {song.cover_image_url && (
                <img src={song.cover_image_url} alt={song.title} className="object-cover w-full h-full" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Play className="h-6 w-6 text-white fill-current ml-1" />
              </div>
            </div>
            
            {/* Song Metadata */}
            <div className="flex flex-col flex-grow truncate">
              <h2 className="text-white font-medium truncate">{song.title}</h2>
              <p className="text-slate-400 text-sm truncate">
                {song.singer} {song.theme && `• ${song.theme}`}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State Fallback */}
      {songs.length === 0 && (
        <div className="text-slate-500 mt-12 text-center flex flex-col items-center">
          <p>No songs found.</p>
          <p className="text-sm">Make sure you added one in your Supabase table!</p>
        </div>
      )}
    </main>
  )
}