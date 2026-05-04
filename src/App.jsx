import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  Cpu,
  Droplets,
  Eye,
  Flame,
  Moon,
  Power,
  RefreshCw,
  Sun,
  ThermometerSun,
} from 'lucide-react'
import Navbar from './components/Navbar'
import SensorCard from './components/SensorCard'
import RelayControl from './components/RelayControl'
import TemperatureChart from './components/Chart'
import HistoryTable from './components/HistoryTable'
import { connectMqtt, publishMessage, TOPICS } from './services/mqttService'

const initialRelays = {
  relay1: 'OFF',
  relay2: 'OFF',
  relay3: 'OFF',
  relay4: 'OFF',
}

function getTemperatureStatus(value) {
  const temperature = Number(value)

  if (Number.isNaN(temperature)) {
    return {
      label: 'Menunggu',
      tone: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      ring: 'ring-slate-200 dark:ring-slate-700',
      card: 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
      glow: 'from-slate-400/15 via-transparent to-slate-200/10',
    }
  }

  if (temperature > 30) {
    return {
      label: 'Bahaya',
      tone: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
      ring: 'ring-rose-200 dark:ring-rose-500/30',
      card: 'border-rose-200 bg-rose-50 shadow-rose-100/80 dark:border-rose-500/30 dark:bg-rose-950/40 dark:shadow-none',
      glow: 'from-rose-500/25 via-orange-400/10 to-transparent',
    }
  }

  if (temperature >= 26) {
    return {
      label: 'Warning',
      tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
      ring: 'ring-amber-200 dark:ring-amber-500/30',
      card: 'border-amber-200 bg-amber-50 shadow-amber-100/80 dark:border-amber-500/30 dark:bg-amber-950/40 dark:shadow-none',
      glow: 'from-amber-400/30 via-yellow-300/10 to-transparent',
    }
  }

  if (temperature >= 20) {
    return {
      label: 'Normal',
      tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
      ring: 'ring-emerald-200 dark:ring-emerald-500/30',
      card: 'border-emerald-200 bg-emerald-50 shadow-emerald-100/80 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:shadow-none',
      glow: 'from-emerald-400/25 via-teal-300/10 to-transparent',
    }
  }

  return {
    label: 'Dingin',
    tone: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
    ring: 'ring-cyan-200 dark:ring-cyan-500/30',
    card: 'border-cyan-200 bg-cyan-50 shadow-cyan-100/80 dark:border-cyan-500/30 dark:bg-cyan-950/40 dark:shadow-none',
    glow: 'from-cyan-400/25 via-blue-300/10 to-transparent',
  }
}

function getHumidityStatus(value) {
  const nextHumidity = Number(value)

  if (Number.isNaN(nextHumidity)) {
    return {
      label: 'Menunggu',
      tone: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      card: 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
      glow: 'from-slate-400/15 via-transparent to-slate-200/10',
    }
  }

  if (nextHumidity < 40) {
    return {
      label: 'Kering',
      tone: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
      card: 'border-orange-200 bg-orange-50 shadow-orange-100/80 dark:border-orange-500/30 dark:bg-orange-950/40 dark:shadow-none',
      glow: 'from-orange-400/25 via-amber-300/10 to-transparent',
    }
  }

  if (nextHumidity <= 70) {
    return {
      label: 'Ideal',
      tone: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
      card: 'border-sky-200 bg-sky-50 shadow-sky-100/80 dark:border-sky-500/30 dark:bg-sky-950/40 dark:shadow-none',
      glow: 'from-sky-400/25 via-cyan-300/10 to-transparent',
    }
  }

  return {
    label: 'Lembap',
    tone: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    card: 'border-violet-200 bg-violet-50 shadow-violet-100/80 dark:border-violet-500/30 dark:bg-violet-950/40 dark:shadow-none',
    glow: 'from-violet-400/25 via-fuchsia-300/10 to-transparent',
  }
}

function getLdrStatus(value) {
  if (value === 'GELAP') {
    return {
      label: 'GELAP',
      tone: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
      card: 'border-indigo-200 bg-indigo-50 shadow-indigo-100/80 dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:shadow-none',
      glow: 'from-indigo-500/25 via-slate-400/10 to-transparent',
    }
  }

  if (value === 'TERANG') {
    return {
      label: 'TERANG',
      tone: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300',
      card: 'border-yellow-200 bg-yellow-50 shadow-yellow-100/80 dark:border-yellow-500/30 dark:bg-yellow-950/40 dark:shadow-none',
      glow: 'from-yellow-300/30 via-amber-300/10 to-transparent',
    }
  }

  return {
    label: 'Menunggu',
    tone: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    card: 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
    glow: 'from-slate-400/15 via-transparent to-slate-200/10',
  }
}

function getModeStatus(value) {
  if (value === 'MANUAL') {
    return {
      label: 'MANUAL',
      tone: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
      card: 'border-violet-200 bg-violet-50 shadow-violet-100/80 dark:border-violet-500/30 dark:bg-violet-950/40 dark:shadow-none',
      glow: 'from-violet-400/25 via-fuchsia-300/10 to-transparent',
    }
  }

  return {
    label: 'AUTO',
    tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    card: 'border-emerald-200 bg-emerald-50 shadow-emerald-100/80 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:shadow-none',
    glow: 'from-emerald-400/25 via-lime-300/10 to-transparent',
  }
}

function normalizePayload(value) {
  return String(value).trim().toUpperCase()
}

function LoadingScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(14,165,233,0.28),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_46%,#064e3b_100%)]" />
      <div className="loading-grid absolute inset-0 opacity-35" />
      <div className="loading-scan absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-300/15 to-transparent" />
      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <div className="loading-orbit absolute inset-0 rounded-full border border-sky-300/25">
            <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.9)]" />
          </div>
          <div className="loading-orbit loading-orbit-reverse absolute inset-4 rounded-full border border-emerald-300/20">
            <span className="absolute bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
          </div>
          <div className="loading-ring flex h-24 w-24 items-center justify-center rounded-full border border-sky-400/30 bg-white/10 shadow-[0_0_50px_rgba(14,165,233,0.42)] backdrop-blur">
            <Cpu className="h-10 w-10 text-sky-200" />
          </div>
        </div>
        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">
          ESP32 IoT Monitoring
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-normal sm:text-4xl">
          Menyiapkan Dashboard
        </h1>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-bold text-slate-200">
          {['MQTT', 'Sensor', 'Relay'].map((item) => (
            <span
              key={item}
              className="loading-chip rounded-md border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-6 h-1.5 w-full max-w-72 overflow-hidden rounded-full bg-white/10">
          <div className="loading-bar h-full rounded-full bg-sky-300" />
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Activity className="h-4 w-4 text-emerald-300" />
          Sinkronisasi data realtime...
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [connection, setConnection] = useState('Disconnected')
  const clientRef = useRef(null)
  const snapshotRef = useRef({
    temperature: '--',
    humidity: '--',
    ldr: 'MENUNGGU',
    mode: 'AUTO',
    relays: initialRelays,
  })
  const [temperature, setTemperature] = useState('--')
  const [humidity, setHumidity] = useState('--')
  const [ldr, setLdr] = useState('MENUNGGU')
  const [mode, setMode] = useState('AUTO')
  const [relays, setRelays] = useState(initialRelays)
  const [lastUpdate, setLastUpdate] = useState('-')
  const [temperatureHistory, setTemperatureHistory] = useState([])
  const [sensorHistory, setSensorHistory] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showHeatAlert, setShowHeatAlert] = useState(false)

  const temperatureStatus = useMemo(
    () => getTemperatureStatus(temperature),
    [temperature],
  )
  const humidityStatus = useMemo(() => getHumidityStatus(humidity), [humidity])
  const ldrStatus = useMemo(() => getLdrStatus(ldr), [ldr])
  const modeStatus = useMemo(() => getModeStatus(mode), [mode])

  function addNotification(type, title, message, time = new Date()) {
    const formattedTime = time.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    setNotifications((items) => [
      {
        id: `${time.getTime()}-${type}-${Math.random().toString(16).slice(2)}`,
        type,
        title,
        message,
        time: formattedTime,
      },
      ...items.slice(0, 9),
    ])
  }

  function handleClearNotifications() {
    setNotifications([])
  }

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => {
      setIsLoading(false)
    }, 1600)

    return () => window.clearTimeout(loadingTimer)
  }, [])

  useEffect(() => {
    if (isLoading) return undefined

    const mqttClient = connectMqtt({
      onConnect: () => {
        setConnection('Connected')
        addNotification('success', 'MQTT Connected', 'Dashboard berhasil terhubung ke broker MQTT.')
      },
      onDisconnect: () => {
        setConnection('Disconnected')
        addNotification('danger', 'MQTT Disconnected', 'Koneksi ke broker MQTT terputus.')
      },
      onError: () => {
        setConnection('Disconnected')
        addNotification('danger', 'MQTT Error', 'Gagal menerima koneksi MQTT dengan normal.')
      },
      onMessage: (topic, payload) => {
        const message = String(payload).trim()
        const normalized = normalizePayload(message)
        const time = new Date()
        const formattedTime = time.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        const nextSnapshot = {
          ...snapshotRef.current,
          relays: { ...snapshotRef.current.relays },
        }

        setLastUpdate(formattedTime)

        if (topic === TOPICS.suhu) {
          const nextTemperature = Number.parseFloat(message)
          const displayTemperature = Number.isNaN(nextTemperature) ? message : nextTemperature
          const previousTemperature = Number(snapshotRef.current.temperature)
          nextSnapshot.temperature = displayTemperature
          setTemperature(displayTemperature)

          if (!Number.isNaN(nextTemperature)) {
            setTemperatureHistory((items) => [
              ...items.slice(-19),
              {
                time: formattedTime,
                suhu: nextTemperature,
              },
            ])
            setShowHeatAlert(nextTemperature > 30)

            if (nextTemperature > 30 && (Number.isNaN(previousTemperature) || previousTemperature <= 30)) {
              addNotification(
                'danger',
                'Suhu Bahaya',
                `Suhu mencapai ${nextTemperature} C. Periksa ruang dan pendingin.`,
                time,
              )
            } else if (
              nextTemperature >= 26 &&
              nextTemperature <= 30 &&
              (Number.isNaN(previousTemperature) || previousTemperature < 26 || previousTemperature > 30)
            ) {
              addNotification(
                'warning',
                'Suhu Warning',
                `Suhu mencapai ${nextTemperature} C. Pantau kondisi ruangan.`,
                time,
              )
            }
          }
        }

        if (topic === TOPICS.kelembaban) {
          const nextHumidity = Number.parseFloat(message)
          const displayHumidity = Number.isNaN(nextHumidity) ? message : nextHumidity
          nextSnapshot.humidity = displayHumidity
          setHumidity(displayHumidity)
        }

        if (topic === TOPICS.ldr) {
          const nextLdr = normalized.includes('GELAP') || normalized === '0' ? 'GELAP' : 'TERANG'
          nextSnapshot.ldr = nextLdr
          setLdr(nextLdr)
        }

        if (topic === TOPICS.mode) {
          const nextMode = normalized === 'MANUAL' ? 'MANUAL' : 'AUTO'
          nextSnapshot.mode = nextMode
          setMode(nextMode)
        }

        Object.entries(TOPICS.relays).forEach(([key, relayTopic]) => {
          if (topic === relayTopic) {
            nextSnapshot.relays[key] = normalized === 'ON' || normalized === '1' ? 'ON' : 'OFF'
            setRelays((current) => ({
              ...current,
              [key]: nextSnapshot.relays[key],
            }))
          }
        })

        snapshotRef.current = nextSnapshot
        setSensorHistory((items) => [
          {
            id: `${time.getTime()}-${topic}`,
            time: formattedTime,
            topic,
            suhu: nextSnapshot.temperature,
            kelembaban: nextSnapshot.humidity,
            ldr: nextSnapshot.ldr,
            mode: nextSnapshot.mode,
            relay: Object.entries(nextSnapshot.relays)
              .map(([key, value]) => `${key.replace('relay', 'R')}: ${value}`)
              .join(' | '),
          },
          ...items.slice(0, 14),
        ])
      },
    })

    clientRef.current = mqttClient

    return () => {
      mqttClient.end(true)
      clientRef.current = null
    }
  }, [isLoading])

  function handleModeToggle() {
    const nextMode = mode === 'AUTO' ? 'MANUAL' : 'AUTO'
    snapshotRef.current = { ...snapshotRef.current, mode: nextMode }
    setMode(nextMode)
    publishMessage(clientRef.current, TOPICS.publishMode, nextMode)
  }

  function handleRelayToggle(relayKey) {
    if (mode !== 'MANUAL') return

    const nextValue = relays[relayKey] === 'ON' ? 'OFF' : 'ON'
    snapshotRef.current = {
      ...snapshotRef.current,
      relays: { ...snapshotRef.current.relays, [relayKey]: nextValue },
    }
    setRelays((current) => ({ ...current, [relayKey]: nextValue }))
    publishMessage(clientRef.current, TOPICS.publishRelays[relayKey], nextValue)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
        <div className="flex min-h-screen">
          <main className="flex min-w-0 flex-1 flex-col">
            <Navbar
              connection={connection}
              isDark={isDark}
              notifications={notifications}
              onClearNotifications={handleClearNotifications}
              onToggleDark={() => setIsDark((value) => !value)}
            />

            <section className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
              {showHeatAlert && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-200">
                  <div className="flex items-center gap-3">
                    <Flame className="h-5 w-5" />
                    <span>Suhu melewati 30 C. Periksa ruang dan perangkat pendingin.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHeatAlert(false)}
                    className="rounded-md px-2 py-1 font-semibold transition hover:bg-rose-100 dark:hover:bg-rose-500/20"
                  >
                    Tutup
                  </button>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SensorCard
                  title="Suhu"
                  value={temperature}
                  unit="C"
                  icon={ThermometerSun}
                  accent="text-rose-500"
                  footer="Indikator suhu ruang"
                  badge={temperatureStatus.label}
                  badgeClass={temperatureStatus.tone}
                  cardClass={temperatureStatus.card}
                  glowClass={temperatureStatus.glow}
                />
                <SensorCard
                  title="Kelembaban"
                  value={humidity}
                  unit="%"
                  icon={Droplets}
                  accent="text-sky-500"
                  footer="Pembacaan DHT realtime"
                  badge={humidityStatus.label}
                  badgeClass={humidityStatus.tone}
                  cardClass={humidityStatus.card}
                  glowClass={humidityStatus.glow}
                />
                <SensorCard
                  title="LDR"
                  value={ldr}
                  icon={Eye}
                  accent="text-amber-500"
                  footer="Status intensitas cahaya"
                  badge={ldrStatus.label}
                  badgeClass={ldrStatus.tone}
                  cardClass={ldrStatus.card}
                  glowClass={ldrStatus.glow}
                />
                <SensorCard
                  title="Mode"
                  value={mode}
                  icon={mode === 'AUTO' ? RefreshCw : Power}
                  accent={mode === 'AUTO' ? 'text-emerald-500' : 'text-violet-500'}
                  footer="Kontrol sistem ESP32"
                  badge={modeStatus.label}
                  badgeClass={modeStatus.tone}
                  cardClass={modeStatus.card}
                  glowClass={modeStatus.glow}
                  action={
                    <button
                      type="button"
                      onClick={handleModeToggle}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      {mode === 'AUTO' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      Ubah
                    </button>
                  }
                />
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
                <TemperatureChart
                  data={temperatureHistory}
                  status={temperatureStatus}
                  lastUpdate={lastUpdate}
                />
                <RelayControl
                  mode={mode}
                  relays={relays}
                  onToggle={handleRelayToggle}
                />
              </div>

              <HistoryTable rows={sensorHistory} />
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
