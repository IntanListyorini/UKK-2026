import { Lock, PlugZap } from 'lucide-react'

function RelayControl({ mode, relays, onToggle }) {
  const isManual = mode === 'MANUAL'

  return (
    <section className="rounded-lg border border-violet-200 bg-gradient-to-br from-white via-violet-50/70 to-fuchsia-50 p-5 shadow-sm shadow-violet-100/70 dark:border-violet-500/25 dark:from-slate-900 dark:via-violet-950/30 dark:to-slate-950 dark:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Kontrol Relay
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-normal text-slate-950 dark:text-white">
            Output Perangkat
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
            isManual
              ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {!isManual && <Lock className="h-4 w-4" />}
          {isManual ? 'MANUAL aktif' : 'AUTO terkunci'}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {Object.entries(relays).map(([key, value], index) => {
          const active = value === 'ON'

          return (
            <button
              key={key}
              type="button"
              disabled={!isManual}
              onClick={() => onToggle(key)}
              className={`group rounded-lg border p-4 text-left transition duration-300 ${
                active
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-200 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-sky-500/25 dark:hover:bg-sky-500/10'
              } disabled:cursor-not-allowed disabled:opacity-55`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-900">
                    <PlugZap className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">Relay {index + 1}</p>
                  </div>
                </div>

                <span
                  className={`h-6 w-11 rounded-full p-1 transition ${
                    active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full bg-white transition ${
                      active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default RelayControl
