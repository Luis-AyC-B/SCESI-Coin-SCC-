interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export default function SegmentedControl<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="bg-divider flex rounded-[10px] p-1">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`min-h-11 cursor-pointer rounded-lg border-none px-4 py-2 text-[15px] font-semibold ${
              on ? 'bg-ink text-white' : 'text-ink bg-transparent hover:bg-black/5'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
