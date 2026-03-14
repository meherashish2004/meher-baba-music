'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, Music, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [singer, setSinger] = useState('Madhusudhan')
  const [author, setAuthor] = useState('')
  const [theme, setTheme] = useState('')
  const [language, setLanguage] = useState('')
  const [lyrics, setLyrics] = useState('')
  
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !audioFile) {
      setStatus({ type: 'error', message: 'Title and Audio File are required!' })
      return
    }

    setIsUploading(true)
    setStatus({ type: null, message: '' })

    try {
      // 1. Upload Audio File
      // We use Date.now() to ensure the file name is always unique
      const audioExt = audioFile.name.split('.').pop()
      const audioFileName = `audio/${Date.now()}-${Math.random().toString(36).substring(7)}.${audioExt}`
      
      const { data: audioData, error: audioError } = await supabase.storage
        .from('music-assets')
        .upload(audioFileName, audioFile)

      if (audioError) throw audioError

      // Get the public URL for the uploaded audio
      const { data: { publicUrl: audioUrl } } = supabase.storage
        .from('music-assets')
        .getPublicUrl(audioData.path)

      // 2. Upload Cover Image (Optional)
      let coverUrl = null
      if (coverFile) {
        const coverExt = coverFile.name.split('.').pop()
        const coverFileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${coverExt}`
        
        const { data: coverData, error: coverError } = await supabase.storage
          .from('music-assets')
          .upload(coverFileName, coverFile)

        if (coverError) throw coverError

        const { data: { publicUrl: tempCoverUrl } } = supabase.storage
          .from('music-assets')
          .getPublicUrl(coverData.path)
          
        coverUrl = tempCoverUrl
      }

      // 3. Save everything to the Database
      const { error: dbError } = await supabase
        .from('songs')
        .insert([{
          title,
          singer,
          author,
          theme,
          language,
          lyrics,
          audio_file_url: audioUrl,
          cover_image_url: coverUrl,
        }])

      if (dbError) throw dbError

      // 4. Success! Clear the form
      setStatus({ type: 'success', message: `Successfully published "${title}"!` })
      setTitle('')
      setAuthor('')
      setTheme('')
      setLanguage('')
      setLyrics('')
      setAudioFile(null)
      setCoverFile(null)
      
      // Reset file inputs manually
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
      fileInputs.forEach(input => input.value = '')

    } catch (error: any) {
      console.error("Upload failed:", error)
      setStatus({ type: 'error', message: error.message || 'Something went wrong during upload.' })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto min-h-screen pb-32">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Upload className="h-8 w-8 text-slate-400" />
          Upload New Song
        </h1>
        <p className="text-slate-400 mt-2">Add a new track directly to your database and storage bucket.</p>
      </div>

      {status.type && (
        <div className={`p-4 rounded-lg mb-8 flex items-center gap-3 ${status.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
          {status.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {status.message}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Song Title *</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-slate-500" placeholder="e.g., Aarti Meher Baba" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Singer</label>
            <input type="text" value={singer} onChange={(e) => setSinger(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-slate-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Author / Lyricist</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-slate-500" placeholder="e.g., Bhau Kalchuri" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Theme</label>
            <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-slate-500" placeholder="e.g., Bhajan, Aarti" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Language</label>
            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-slate-500" placeholder="e.g., Hindi, Telugu" />
          </div>
        </div>

        {/* Files */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Music className="h-4 w-4" /> Audio File (.mp3) *
            </label>
            <input required type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Cover Art (.jpg, .png)
            </label>
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer" />
          </div>
        </div>

        {/* Lyrics */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <label className="text-sm font-medium text-slate-300">Lyrics</label>
          <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} rows={10} className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-slate-500 resize-y" placeholder="Paste the full lyrics here..."></textarea>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={isUploading}
          className="w-full bg-white text-black font-bold py-4 rounded-md hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Uploading to Supabase...</>
          ) : (
            'Publish Song'
          )}
        </button>
      </form>
    </div>
  )
}