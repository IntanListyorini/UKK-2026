import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function SensorCharts({
  temperatureData,
  humidityData,
  temperatureStatus,
  humidityStatus,
  lastUpdate,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-lg border border-sky-200 bg-gradient-to-br from-white via-sky-50/60 to-cyan-50 p-5 shadow-sm shadow-sky-100/70 dark:border-sky-500/25 dark:from-slate-900 dark:via-sky-950/30 dark:to-slate-950 dark:shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Grafik Realtime
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-normal text-slate-950 dark:text-white">
              Suhu per Waktu
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${temperatureStatus.tone}`}>
              {temperatureStatus.label}
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {lastUpdate}
            </span>
          </div>
        </div>

        <div className="mt-5 h-[330px] min-h-[330px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temperatureData} margin={{ top: 10, right: 16, left: -20, bottom: 8 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-slate-500 dark:text-slate-400"
                minTickGap={24}
              />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-slate-500 dark:text-slate-400"
                unit=" C"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid rgb(226 232 240)',
                  boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
                }}
                formatter={(value) => [`${value} C`, 'Suhu']}
              />
              <Line
                type="monotone"
                dataKey="suhu"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 6 }}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border border-cyan-200 bg-gradient-to-br from-white via-cyan-50/60 to-sky-50 p-5 shadow-sm shadow-cyan-100/70 dark:border-cyan-500/25 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-950 dark:shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Grafik Realtime
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-normal text-slate-950 dark:text-white">
              Kelembaban per Waktu
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${humidityStatus.tone}`}>
              {humidityStatus.label}
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {lastUpdate}
            </span>
          </div>
        </div>

        <div className="mt-5 h-[330px] min-h-[330px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={humidityData} margin={{ top: 10, right: 16, left: -20, bottom: 8 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-slate-500 dark:text-slate-400"
                minTickGap={24}
              />
              <YAxis
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-slate-500 dark:text-slate-400"
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid rgb(226 232 240)',
                  boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
                }}
                formatter={(value) => [`${value}%`, 'Kelembaban']}
              />
              <Line
                type="monotone"
                dataKey="kelembaban"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 6 }}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

export default SensorCharts
