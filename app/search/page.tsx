'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayerStore, Song } from '../../src/store/userPlayerStore'
import { Search as SearchIcon, Play, Music } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { setCurrentSong, currentSong } = usePlayerStore()

  useEffect(() => {
    // If the search bar is empty, clear results and stop
    if (!query.trim()) {
      setResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // "Debounce" timer: wait 300ms after the user stops typing before querying Supabase
    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        // The .or() lets us search across multiple columns at once using case-insensitive matching (ilike)
        .or(`title.ilike.%${query}%,singer.ilike.%${query}%,lyrics.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(20) // Keep the results manageable

      if (error) {
        console.error("Search error:", error)
      } else {
        setResults(data || [])
      }
      setIsSearching(false)
    }, 300)

    // Cleanup the timer if the user keeps typing
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto h-full flex flex-col">
      
      {/* Search Input Area */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search for songs, singers, or specific lyrics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-white rounded-full py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-lg shadow-lg"
          autoFocus
        />
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto pr-2">
        {isSearching ? (
          <div className="text-slate-500 flex justify-center mt-12">Searching...</div>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-2">
            {results.map((song) => {
              const isPlaying = currentSong?.id === song.id
              
              return (
                <div 
                  key={song.id}
                  onClick={() => setCurrentSong(song)}
                  className={`group flex items-center gap-4 p-3 rounded-lg transition-colors cursor-pointer ${
                    isPlaying ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {/* Track Art */}
                  <div className="relative h-12 w-12 flex-shrink-0 rounded bg-slate-800 overflow-hidden">
                    {song.cover_image_url ? (
                      <img src={song.cover_image_url} alt={song.title} className="object-cover w-full h-full" />
                    ) : (
                      <Music className="absolute inset-0 m-auto h-6 w-6 text-slate-500" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-5 w-5 text-white fill-current ml-1" />
                    </div>
                  </div>
                  
                  {/* Track Info */}
                  <div className="flex flex-col flex-grow truncate">
                    <span className={`font-medium truncate ${isPlaying ? 'text-white' : 'text-slate-200'}`}>
                      {song.title}
                    </span>
                    <span className="text-sm text-slate-400 truncate">
                      {song.singer} {song.author && `• ${song.author}`}
                    </span>
                  </div>
                  
                  {/* Theme Badge */}
                  {song.theme && (
                    <div className="hidden md:flex flex-shrink-0 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-xs text-slate-400">
                      {song.theme}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : query.trim() !== '' ? (
          <div className="text-slate-500 mt-12 text-center">
            No results found for "{query}"
          </div>
        ) : (
          <div className="text-slate-600 mt-12 flex flex-col items-center justify-center gap-4 text-center">
            <SearchIcon className="h-12 w-12 opacity-20" />
            <p>Type a title, artist, or lyric to start searching</p>
          </div>
        )}
      </div>
      
    </div>
  )
}