import Link from 'next/link'
import { Home, Search, Music, ListMusic, Mic2 } from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-950 text-slate-300 flex-col h-full border-r border-slate-800 hidden md:flex">
      
      {/* Logo Area */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Meher Baba Music</h2>
      </div>
      
      {/* Main Links */}
      <div className="flex flex-col gap-1 px-4">
        <Link href="/" className="flex items-center gap-4 px-3 py-3 hover:text-white hover:bg-slate-900 rounded-md transition-colors">
          <Home className="w-5 h-5" />
          <span className="font-medium">Home</span>
        </Link>
        <Link href="/search" className="flex items-center gap-4 px-3 py-3 hover:text-white hover:bg-slate-900 rounded-md transition-colors">
          <Search className="w-5 h-5" />
          <span className="font-medium">Search</span>
        </Link>
      </div>
      
      {/* Themes / Categories */}
      <div className="mt-8 px-6">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Themes</h3>
        <div className="flex flex-col gap-1">
          <Link href="/theme/aarti" className="flex items-center gap-4 px-1 py-2 hover:text-white hover:bg-slate-900 rounded-md transition-colors">
            <ListMusic className="w-4 h-4 text-slate-400" />
            <span className="text-sm">Aartis</span>
          </Link>
          <Link href="/theme/bhajan" className="flex items-center gap-4 px-1 py-2 hover:text-white hover:bg-slate-900 rounded-md transition-colors">
            <ListMusic className="w-4 h-4 text-slate-400" />
            <span className="text-sm">Bhajans</span>
          </Link>
          <Link href="/theme/ghazal" className="flex items-center gap-4 px-1 py-2 hover:text-white hover:bg-slate-900 rounded-md transition-colors">
            <ListMusic className="w-4 h-4 text-slate-400" />
            <span className="text-sm">Ghazals</span>
          </Link>
          <Link href="/theme/qawaali" className="flex items-center gap-4 px-1 py-2 hover:text-white hover:bg-slate-900 rounded-md transition-colors">
            <ListMusic className="w-4 h-4 text-slate-400" />
            <span className="text-sm">Qawaalis</span>
          </Link>
        </div>
      </div>
      
    </div>
  )
}