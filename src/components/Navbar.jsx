import { useState } from 'react'
import { Bell, Moon, Radio, Sun, Trash2 } from 'lucide-react'

const notificationTone = {
  danger: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200',
}

function Navbar({ connection, isDark, notifications = [], onClearNotifications, onToggleDark }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const isConnected = connection === 'Connected'

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
            ESP32 IoT Monitoring
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-3xl">
            Dashboard Suhu & Kelembapan
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <span
              className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.8)]' : 'bg-rose-500'}`}
            />
            MQTT {connection}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={onToggleDark}
            title="Toggle dark mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              title="Notifikasi"
              onClick={() => setIsNotificationOpen((value) => !value)}
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                  {notifications.length}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-12 z-30 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-950 dark:text-white">
                      Riwayat Notifikasi
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {notifications.length} notifikasi terbaru
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClearNotifications}
                    disabled={notifications.length === 0}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-white"
                    title="Hapus notifikasi"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto p-3">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      Belum ada notifikasi.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`rounded-lg border p-3 ${notificationTone[notification.type] ?? notificationTone.success}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-bold">{notification.title}</p>
                            <span className="whitespace-nowrap text-xs font-semibold opacity-75">
                              {notification.time}
                            </span>
                          </div>
                          <p className="mt-1 text-sm opacity-90">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950 sm:inline-flex">
            <Radio className="h-4 w-4" />
            Live
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
