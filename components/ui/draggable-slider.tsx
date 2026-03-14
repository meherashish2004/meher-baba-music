// components/ui/draggable-slider.tsx
interface DraggableSliderProps {
  value: number        // 0–100
  onChange: (val: number) => void
  onCommit?: (val: number) => void
  className?: string
}

export default function DraggableSlider({ value, onChange, onCommit, className }: DraggableSliderProps) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      step={0.1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onMouseUp={(e) => onCommit?.(Number((e.target as HTMLInputElement).value))}
      onTouchEnd={(e) => onCommit?.(Number((e.target as HTMLInputElement).value))}
      className={`w-full h-1 rounded-full appearance-none cursor-pointer
        bg-slate-600 accent-white
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-3
        [&::-webkit-slider-thumb]:h-3
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-white
        [&::-webkit-slider-thumb]:cursor-grab
        [&::-webkit-slider-thumb]:active:cursor-grabbing
        ${className}`}
      style={{
        background: `linear-gradient(to right, white ${value}%, rgb(71 85 105) ${value}%)`
      }}
    />
  )
}