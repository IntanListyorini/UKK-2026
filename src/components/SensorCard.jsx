function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  accent,
  footer,
  badge,
  badgeClass,
  cardClass = 'border-white/70 bg-white dark:border-slate-800 dark:bg-slate-900',
  glowClass = 'from-slate-400/15 via-transparent to-transparent',
  action,
}) {
  return (
    <article className={`group relative overflow-hidden rounded-lg border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${cardClass}`}>
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${glowClass}`} />
      <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 rounded-full bg-white/35 blur-2xl dark:bg-white/5" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-bold tracking-normal text-slate-950 dark:text-white">
                {value}
              </span>
              {unit && <span className="pb-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{unit}</span>}
            </div>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-white/75 shadow-sm ring-1 ring-black/5 transition group-hover:scale-105 dark:bg-slate-950/55 dark:ring-white/10 ${accent}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${badgeClass}`}>{badge}</span>
          {action}
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{footer}</p>
      </div>
    </article>
  )
}

export default SensorCard
