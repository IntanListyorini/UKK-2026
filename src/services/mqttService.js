import mqtt from 'mqtt'

export const TOPICS = {
  suhu: 'smk/iot/suhu',
  kelembaban: 'smk/iot/kelembaban',
  ldr: 'smk/iot/ldr',
  mode: 'smk/iot/mode',
  relays: {
    relay1: 'smk/iot/relay1',
    relay2: 'smk/iot/relay2',
    relay3: 'smk/iot/relay3',
    relay4: 'smk/iot/relay4',
  },
  publishMode: 'smk/iot/mode/set',
  publishRelays: {
    relay1: 'smk/iot/relay1/set',
    relay2: 'smk/iot/relay2/set',
    relay3: 'smk/iot/relay3/set',
    relay4: 'smk/iot/relay4/set',
  },
}

const MQTT_URL = 'wss://broker.hivemq.com:8884/mqtt'

const SUBSCRIBE_TOPICS = [
  TOPICS.suhu,
  TOPICS.kelembaban,
  TOPICS.ldr,
  TOPICS.mode,
  TOPICS.relays.relay1,
  TOPICS.relays.relay2,
  TOPICS.relays.relay3,
  TOPICS.relays.relay4,
]

export function connectMqtt({ onConnect, onDisconnect, onMessage, onError }) {
  const client = mqtt.connect(MQTT_URL, {
    clientId: `web-ukk-2026-${Math.random().toString(16).slice(2)}`,
    clean: true,
    connectTimeout: 5000,
    reconnectPeriod: 2500,
  })

  client.on('connect', () => {
    onConnect?.()
    client.subscribe(SUBSCRIBE_TOPICS, { qos: 0 })
  })

  client.on('message', (topic, message) => {
    onMessage?.(topic, message.toString())
  })

  client.on('reconnect', () => {
    onDisconnect?.()
  })

  client.on('close', () => {
    onDisconnect?.()
  })

  client.on('offline', () => {
    onDisconnect?.()
  })

  client.on('error', (error) => {
    onError?.(error)
  })

  return client
}

export function publishMessage(client, topic, payload) {
  if (!client || !client.connected) return false

  client.publish(topic, payload, { qos: 0, retain: false })
  return true
}
