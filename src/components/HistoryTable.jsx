function HistoryTable({ rows }) {
  function escapeCsvValue(value) {
    const text = String(value ?? '')

    if (/[",\n\r]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`
    }

    return text
  }

  function handleExportCsv() {
    if (rows.length === 0) return

    const headers = ['Waktu', 'Topic', 'Suhu', 'Kelembaban', 'LDR', 'Mode', 'Relay']
    const csvRows = rows.map((row) => [
      row.time,
      row.topic,
      row.suhu,
      row.kelembaban,
      row.ldr,
      row.mode,
      row.relay,
    ])
    const csvContent = [headers, ...csvRows]
      .map((row) => row.map(escapeCsvValue).join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')

    link.href = url
    link.download = `riwayat-sensor-${timestamp}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-cyan-50/60 p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Riwayat
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-normal text-slate-950 dark:text-white">
            Log Data Sensor
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {rows.length} data terbaru
          </span>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={rows.length === 0}
            className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-bold">Waktu</th>
                <th className="px-4 py-3 font-bold">Topic</th>
                <th className="px-4 py-3 font-bold">Suhu</th>
                <th className="px-4 py-3 font-bold">Kelembaban</th>
                <th className="px-4 py-3 font-bold">LDR</th>
                <th className="px-4 py-3 font-bold">Mode</th>
                <th className="px-4 py-3 font-bold">Relay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    Menunggu data MQTT masuk...
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {row.time}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {row.topic}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{row.suhu} C</td>
                    <td className="whitespace-nowrap px-4 py-3">{row.kelembaban} %</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {row.ldr}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-sky-100 px-2 py-1 text-xs font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                        {row.mode}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">
                      {row.relay}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default HistoryTable
