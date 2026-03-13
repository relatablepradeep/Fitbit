"use client"

import { useEffect, useState } from "react"

interface HealthData {
  steps: { "activities-steps": { value: string }[] }
  calories: { "activities-calories": { value: string }[] }
  distance: { "activities-distance": { value: string }[] }
  sleep?: { summary?: { totalMinutesAsleep?: number } }
  heart: { "activities-heart": { value?: { restingHeartRate?: number } }[] }
}

interface Metrics {
  steps: number
  calories: number
  distance: number
  sleepMinutes: number | null
  heartRate: number | null
}

function parseMetrics(raw: HealthData): Metrics {
  return {
    steps: parseInt(raw.steps?.["activities-steps"]?.[0]?.value ?? "0"),
    calories: parseInt(raw.calories?.["activities-calories"]?.[0]?.value ?? "0"),
    distance: parseFloat(raw.distance?.["activities-distance"]?.[0]?.value ?? "0"),
    sleepMinutes: raw.sleep?.summary?.totalMinutesAsleep ?? null,
    heartRate: raw.heart?.["activities-heart"]?.[0]?.value?.restingHeartRate ?? null,
  }
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0]
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{
        height: 4, background: "#F1EFE8", borderRadius: 99, overflow: "hidden"
      }}>
        <div style={{
          height: "100%", width: `${Math.min(100, pct)}%`,
          background: color, borderRadius: 99,
          transition: "width 0.6s ease"
        }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [date, setDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  const token =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("token")
      : null

  const loadData = (d: Date) => {
    setLoading(true)
    fetch(`/api/fitbit/health?token=${token}&date=${formatDate(d)}`)
      .then(res => res.json())
      .then((raw: HealthData) => {
        setMetrics(parseMetrics(raw))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadData(date) }, [])

  const prevDay = () => {
    const d = new Date(date)
    d.setDate(d.getDate() - 1)
    setDate(d)
    loadData(d)
  }

  const nextDay = () => {
    const d = new Date(date)
    d.setDate(d.getDate() + 1)
    setDate(d)
    loadData(d)
  }

  const sleepH = metrics?.sleepMinutes != null ? Math.floor(metrics.sleepMinutes / 60) : null
  const sleepM = metrics?.sleepMinutes != null ? metrics.sleepMinutes % 60 : null

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      padding: "2rem",
      maxWidth: 680,
      margin: "0 auto",
    }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, letterSpacing: "-0.3px", color: "#2C2C2A" }}>
          health<span style={{ color: "#BA7517" }}>.</span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "#F1EFE8", border: "0.5px solid #D3D1C7",
          borderRadius: 12, padding: "6px 14px"
        }}>
          <button onClick={prevDay} style={navBtnStyle}>&#8592;</button>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#5F5E5A", minWidth: 90, textAlign: "center" }}>
            {formatDate(date)}
          </span>
          <button onClick={nextDay} style={navBtnStyle}>&#8594;</button>
        </div>
      </div>

      {loading || !metrics ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#888780", fontSize: 14 }}>
          Loading...
        </div>
      ) : (
        <>
          {/* Top row: Sleep + Heart Rate */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: 14, marginBottom: 14 }}>

            {/* Sleep */}
            <div style={{ ...cardBase, background: "#FAEEDA", border: "0.5px solid #FAC775" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#854F0B", marginBottom: 8 }}>
                Sleep
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: "#412402", lineHeight: 1 }}>
                  {sleepH ?? "—"}
                </div>
                {sleepH != null && (
                  <div style={{ paddingBottom: 6 }}>
                    <div style={{ fontSize: 13, color: "#633806" }}>h {sleepM} min</div>
                    <div style={{ fontSize: 11, color: "#854F0B", marginTop: 2 }}>goal: 8 h</div>
                  </div>
                )}
                {sleepH == null && (
                  <div style={{ paddingBottom: 6, fontSize: 13, color: "#854F0B" }}>no data</div>
                )}
              </div>
              <ProgressBar
                pct={metrics.sleepMinutes ? Math.round(metrics.sleepMinutes / 480 * 100) : 0}
                color="#EF9F27"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#854F0B", marginTop: 5 }}>
                <span>0h</span><span>8h</span>
              </div>
            </div>

            {/* Heart Rate */}
            <div style={{ ...cardBase, borderTop: "3px solid #D85A30", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ ...iconBox, background: "#FAECE7", marginBottom: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D85A30" strokeWidth="2">
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                  </svg>
                </div>
                <div style={labelStyle}>Heart Rate</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#2C2C2A", lineHeight: 1 }}>
                  {metrics.heartRate ?? "—"}
                </div>
                <div style={unitStyle}>bpm resting</div>
              </div>
              <ProgressBar
                pct={metrics.heartRate ? Math.round((metrics.heartRate - 40) / 60 * 100) : 0}
                color="#D85A30"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888780", marginTop: 5 }}>
                <span>40</span><span>100</span>
              </div>
            </div>
          </div>

          {/* Bottom row: Steps, Calories, Distance */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 14 }}>

            {/* Steps */}
            <div style={{ ...cardBase, borderTop: "3px solid #EF9F27" }}>
              <div style={{ ...iconBox, background: "#FAEEDA", marginBottom: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div style={labelStyle}>Steps</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#2C2C2A", lineHeight: 1 }}>
                {metrics.steps.toLocaleString()}
              </div>
              <div style={unitStyle}>today</div>
              <ProgressBar pct={Math.round(metrics.steps / 10000 * 100)} color="#EF9F27" />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888780", marginTop: 5 }}>
                <span>0</span><span>10k</span>
              </div>
            </div>

            {/* Calories */}
            <div style={{ ...cardBase, borderTop: "3px solid #1D9E75" }}>
              <div style={{ ...iconBox, background: "#E1F5EE", marginBottom: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
                </svg>
              </div>
              <div style={labelStyle}>Calories</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#2C2C2A", lineHeight: 1 }}>
                {metrics.calories.toLocaleString()}
              </div>
              <div style={unitStyle}>kcal</div>
              <ProgressBar pct={Math.round(metrics.calories / 2500 * 100)} color="#1D9E75" />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888780", marginTop: 5 }}>
                <span>0</span><span>2.5k</span>
              </div>
            </div>

            {/* Distance */}
            <div style={{ ...cardBase, borderTop: "3px solid #378ADD" }}>
              <div style={{ ...iconBox, background: "#E6F1FB", marginBottom: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="2">
                  <path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3" />
                </svg>
              </div>
              <div style={labelStyle}>Distance</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#2C2C2A", lineHeight: 1 }}>
                {metrics.distance.toFixed(1)}
              </div>
              <div style={unitStyle}>miles</div>
              <ProgressBar pct={Math.round(metrics.distance / 6 * 100)} color="#378ADD" />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888780", marginTop: 5 }}>
                <span>0</span><span>6 mi</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const cardBase: React.CSSProperties = {
  background: "#ffffff",
  border: "0.5px solid #D3D1C7",
  borderRadius: 12,
  padding: "1.25rem",
}

const iconBox: React.CSSProperties = {
  width: 32, height: 32,
  borderRadius: 8,
  display: "flex", alignItems: "center", justifyContent: "center",
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#888780",
  marginBottom: 6,
}

const unitStyle: React.CSSProperties = {
  fontSize: 13, color: "#888780", marginTop: 4,
}

const navBtnStyle: React.CSSProperties = {
  background: "none", border: "none",
  cursor: "pointer", fontSize: 16,
  color: "#BA7517", padding: "0 2px", lineHeight: 1,
}