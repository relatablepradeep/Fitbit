"use client"

import { useEffect, useState, useRef } from "react"

/* ── tiny calendar helpers ── */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"]

function Calendar({ selected, onSelect }: { selected: Date; onSelect: (d: Date) => void }) {
  const [view, setView] = useState({ year: selected.getFullYear(), month: selected.getMonth() })

  const daysInMonth = getDaysInMonth(view.year, view.month)
  const firstDay = getFirstDayOfMonth(view.year, view.month)
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const prevMonth = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })
  const nextMonth = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })

  const isSelected = (day: number) =>
    selected.getFullYear() === view.year &&
    selected.getMonth() === view.month &&
    selected.getDate() === day

  const isToday = (day: number) => {
    const t = new Date()
    return t.getFullYear() === view.year && t.getMonth() === view.month && t.getDate() === day
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={prevMonth} style={calNavBtn}>&#8592;</button>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A" }}>{MONTHS[view.month]} {view.year}</span>
        <button onClick={nextMonth} style={calNavBtn}>&#8594;</button>
      </div>
      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#B4B2A9", fontWeight: 500, padding: "2px 0" }}>{d}</div>)}
      </div>
      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => (
          <div key={i} onClick={() => day && onSelect(new Date(view.year, view.month, day))}
            style={{
              textAlign: "center", fontSize: 12, padding: "5px 0",
              borderRadius: 6, cursor: day ? "pointer" : "default",
              background: day && isSelected(day) ? "#EF9F27" : "transparent",
              color: day && isSelected(day) ? "#412402" : day && isToday(day) ? "#BA7517" : day ? "#2C2C2A" : "transparent",
              fontWeight: day && (isSelected(day) || isToday(day)) ? 500 : 400,
              border: day && isToday(day) && !isSelected(day) ? "1px solid #FAC775" : "1px solid transparent",
              transition: "background .15s",
            }}
          >{day}</div>
        ))}
      </div>
    </div>
  )
}




export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [metric, setMetric] = useState("")
  const [metricData, setMetricData] = useState<any>(null)
  const [goal, setGoal] = useState("")
  const [dietType, setDietType] = useState("veg")
  const [suggestion, setSuggestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  const [showCal, setShowCal] = useState(false)
  const calRef = useRef<HTMLDivElement>(null)








 

























  const token =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("token")
      : null

  const formatDate = (d: Date) => d.toISOString().split("T")[0]
  const displayDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })

  const calculateAverage = (arr: any[]) => {
    if (!arr || arr.length === 0) return 0
    const total = arr.reduce((sum: any, item: any) => sum + Number(item.value), 0)
    return Math.round(total / arr.length)
  }

  useEffect(() => {
    if (!token) return
    fetch(`/api/fitbit/health?token=${token}&date=${formatDate(date)}`)
      .then(res => res.json())
      .then(setData)
  }, [date])

  useEffect(() => {
    if (!metric || !token) return
    const load = async () => {
      const [day, week, month] = await Promise.all([
        fetch(`/api/fitbit/health?token=${token}&metric=${metric}&date=${formatDate(date)}&period=1d`).then(r => r.json()),
        fetch(`/api/fitbit/health?token=${token}&metric=${metric}&date=${formatDate(date)}&period=7d`).then(r => r.json()),
        fetch(`/api/fitbit/health?token=${token}&metric=${metric}&date=${formatDate(date)}&period=30d`).then(r => r.json()),
      ])
      setMetricData({ day, week, month })
    }
    load()
  }, [metric])

  /* close calendar on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setShowCal(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const getSuggestion = async () => {
    if (!data) return
    setLoading(true)
    setSuggestion("")
    const weekSteps = metricData?.week?.["activities-steps"]?.reduce((s: any, d: any) => s + Number(d.value), 0) || 0
    const monthSteps = metricData?.month?.["activities-steps"]?.reduce((s: any, d: any) => s + Number(d.value), 0) || 0
    const res = await fetch("/api/ai/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal, dietType,
        todaySteps: data.steps["activities-steps"][0].value,
        todayCalories: data.calories["activities-calories"][0].value,
        todayDistance: data.distance["activities-distance"][0].value,
        todaySleep: data.sleep?.summary?.totalMinutesAsleep ?? 0,
        heartRate: data.heart["activities-heart"][0].value.restingHeartRate,
        weekSteps, monthSteps,
      }),
    })
    const result = await res.json()
    setSuggestion(result.suggestion)
    setLoading(false)
  }

  const handleDateSelect = (d: Date) => {
    setDate(d)
    setShowCal(false)
  }

  const shiftDate = (delta: number) => {
    const d = new Date(date)
    d.setDate(d.getDate() + delta)
    setDate(d)
  }

  if (!data) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#888780" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      Loading health data...
    </div>
  )

  const steps = Number(data.steps["activities-steps"][0].value)
  const calories = Number(data.calories["activities-calories"][0].value)
  const distance = parseFloat(data.distance["activities-distance"][0].value)
  const heartRate = data.heart["activities-heart"][0]?.value?.restingHeartRate
  const sleepMins = data.sleep?.summary?.totalMinutesAsleep ?? null
  const sleepH = sleepMins != null ? Math.floor(sleepMins / 60) : null
  const sleepM = sleepMins != null ? sleepMins % 60 : null
  const metricKey = metric === "heartrate" ? "activities-heart" : `activities-${metric}`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        input:focus, select:focus { outline: none; border-color: #EF9F27 !important; }
        ::placeholder { color: #B4B2A9; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:none } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes calDrop { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:none } }

        .dash-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #FAF9F6;
          padding: 24px;
        }

        .dash-inner {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── main two-col split ── */
        .dash-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 20px;
          align-items: start;
        }

        /* left: metrics stacked */
        .metrics-col { display: flex; flex-direction: column; gap: 14px; min-width: 0; }

        /* Sleep + HR */
        .row-top {
          display: grid;
          grid-template-columns: 1.55fr 1fr;
          gap: 14px;
        }

        /* Steps / Cal / Dist */
        .row-bottom {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        /* right: AI col */
        .ai-col {
          background: #fff;
          border: 0.5px solid #D3D1C7;
          border-top: 3px solid #BA7517;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 24px;
          max-height: calc(100vh - 48px);
          overflow: hidden;
        }

        .ai-col-inner {
          display: flex;
          flex-direction: column;
          gap: 0;
          height: 100%;
          overflow: hidden;
        }

        .ai-top-section {
          padding: 20px 20px 16px;
          flex-shrink: 0;
        }

        .ai-plan-section {
          flex: 1;
          overflow-y: auto;
          padding: 0 20px 20px;
          min-height: 0;
        }

        /* card base */
        .card {
          background: #fff;
          border: 0.5px solid #D3D1C7;
          border-radius: 14px;
          padding: 20px;
          height: 100%;
        }

        .metric-card {
          background: #fff;
          border: 0.5px solid #D3D1C7;
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          transition: opacity .15s, box-shadow .15s;
          height: 100%;
        }
        .metric-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .metric-card.active { opacity: .82; }

        .icon-box {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
          flex-shrink: 0;
        }

        .micro-label {
          font-size: 10px; font-weight: 500;
          letter-spacing: .08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .bar-track {
          margin-top: 16px;
          height: 4px;
          background: #F1EFE8;
          border-radius: 99px;
          overflow: hidden;
        }
        .bar-fill { height: 100%; border-radius: 99px; transition: width .6s ease; }

        .bar-labels {
          display: flex; justify-content: space-between;
          font-size: 10px; color: #888780; margin-top: 5px;
        }

        .analytics-box {
          background: #fff;
          border: 0.5px solid #D3D1C7;
          border-top: 3px solid #BA7517;
          border-radius: 14px;
          padding: 18px;
          animation: fadeIn .2s ease;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 14px;
        }

        .stat-chip {
          background: #FAEEDA;
          border-radius: 10px;
          padding: 14px;
        }

        .ai-plan-box {
          background: #FAEEDA;
          border: 0.5px solid #FAC775;
          border-radius: 10px;
          padding: 14px;
          animation: fadeIn .3s ease;
        }

        .gen-btn {
          border: none; border-radius: 10px;
          padding: 11px 16px;
          font-size: 13px; font-weight: 500;
          width: 100%;
          cursor: pointer;
          transition: background .2s, color .2s;
          font-family: 'DM Sans', sans-serif;
        }
        .gen-btn:disabled { cursor: not-allowed; }

        .ai-input {
          width: 100%;
          background: #F1EFE8;
          border: 0.5px solid #D3D1C7;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 12px;
          color: #2C2C2A;
          font-family: 'DM Sans', sans-serif;
          margin-top: 5px;
          transition: border-color .15s;
        }

        /* calendar dropdown */
        .cal-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border: 0.5px solid #D3D1C7;
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,.10);
          z-index: 100;
          width: 260px;
          animation: calDrop .18s ease;
        }

        /* ── Responsive ── */
        @media (max-width: 1000px) {
          .dash-layout { grid-template-columns: 1fr; }
          .ai-col { position: static; max-height: none; }
        }

        @media (max-width: 640px) {
          .dash-root { padding: 12px; }
          .row-top { grid-template-columns: 1fr; }
          .row-bottom { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .card, .metric-card { padding: 14px; }
          .analytics-grid { gap: 8px; }
        }

        @media (max-width: 400px) {
          .row-bottom { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="dash-root">
        <div className="dash-inner">

          {/* ── Page header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#2C2C2A", letterSpacing: "-0.4px" }}>
              health<span style={{ color: "#BA7517" }}>.</span>
            </div>
            <div style={{ fontSize: 12, color: "#888780" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>

          <div className="dash-layout">

            {/* ══ LEFT: metrics ══ */}
            <div className="metrics-col">

              {/* Sleep + Heart Rate */}
              <div className="row-top">

                {/* Sleep */}
                <div className="card" style={{ background: "#FAEEDA", border: "0.5px solid #FAC775" }}>
                  <div className="micro-label" style={{ color: "#854F0B" }}>Sleep</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 4 }}>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, color: "#412402", lineHeight: 1 }}>
                      {sleepH ?? "—"}
                    </div>
                    <div style={{ paddingBottom: 6 }}>
                      {sleepH != null ? (
                        <>
                          <div style={{ fontSize: 14, color: "#633806" }}>h {sleepM} min</div>
                          <div style={{ fontSize: 11, color: "#854F0B", marginTop: 3 }}>goal: 8 h</div>
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: "#854F0B" }}>no data</div>
                      )}
                    </div>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Math.min(100, sleepMins ? Math.round(sleepMins / 480 * 100) : 0)}%`, background: "#EF9F27" }} />
                  </div>
                  <div className="bar-labels"><span>0h</span><span>8h</span></div>
                </div>

                {/* Heart Rate */}
                <div
                  className={`metric-card${metric === "heartrate" ? " active" : ""}`}
                  style={{ borderTop: "3px solid #D85A30", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                  onClick={() => setMetric(metric === "heartrate" ? "" : "heartrate")}
                >
                  <div>
                    <div className="icon-box" style={{ background: "#FAECE7" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D85A30" strokeWidth="2">
                        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                      </svg>
                    </div>
                    <div className="micro-label" style={{ color: "#888780" }}>Heart Rate</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#2C2C2A", lineHeight: 1 }}>{heartRate ?? "—"}</div>
                    <div style={{ fontSize: 13, color: "#888780", marginTop: 4 }}>bpm resting</div>
                  </div>
                  <div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${heartRate ? Math.min(100, Math.round((heartRate - 40) / 60 * 100)) : 0}%`, background: "#D85A30" }} />
                    </div>
                    <div className="bar-labels"><span>40</span><span>100</span></div>
                  </div>
                </div>
              </div>

              {/* Steps / Calories / Distance */}
              <div className="row-bottom">
                {[
                  { key: "steps", label: "Steps", value: steps.toLocaleString(), unitTxt: "today", pct: steps / 10000 * 100, maxLbl: "10k", color: "#EF9F27", iconBg: "#FAEEDA", stroke: "#BA7517", icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /> },
                  { key: "calories", label: "Calories", value: calories.toLocaleString(), unitTxt: "kcal", pct: calories / 2500 * 100, maxLbl: "2.5k", color: "#1D9E75", iconBg: "#E1F5EE", stroke: "#1D9E75", icon: <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" /> },
                  { key: "distance", label: "Distance", value: distance.toFixed(1), unitTxt: "km", pct: distance / 10 * 100, maxLbl: "10", color: "#378ADD", iconBg: "#E6F1FB", stroke: "#378ADD", icon: <path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3" /> },
                ].map(({ key, label, value, unitTxt, pct, maxLbl, color, iconBg, stroke, icon }) => (
                  <div key={key}
                    className={`metric-card${metric === key ? " active" : ""}`}
                    style={{ borderTop: `3px solid ${color}` }}
                    onClick={() => setMetric(metric === key ? "" : key)}
                  >
                    <div className="icon-box" style={{ background: iconBg }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">{icon}</svg>
                    </div>
                    <div className="micro-label" style={{ color: "#888780" }}>{label}</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: "#2C2C2A", lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 13, color: "#888780", marginTop: 4 }}>{unitTxt}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.min(100, Math.round(pct))}%`, background: color }} />
                    </div>
                    <div className="bar-labels"><span>0</span><span>{maxLbl}</span></div>
                  </div>
                ))}
              </div>

              {/* Analytics Panel */}
              {metric && metricData && (
                <div className="analytics-box">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "#2C2C2A" }}>
                      {metric.charAt(0).toUpperCase() + metric.slice(1)} analytics
                    </div>
                    <button onClick={() => { setMetric(""); setMetricData(null) }}
                      style={{ background: "#F1EFE8", border: "0.5px solid #D3D1C7", borderRadius: 7, padding: "4px 12px", fontSize: 11, color: "#5F5E5A", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Close
                    </button>
                  </div>
                  <div className="analytics-grid">
                    {[
                      { label: "Today", val: metricData.day[metricKey]?.[0]?.value ?? "—" },
                      { label: "7-day avg", val: calculateAverage(metricData.week[metricKey]) },
                      { label: "30-day avg", val: calculateAverage(metricData.month[metricKey]) },
                    ].map(({ label, val }) => (
                      <div key={label} className="stat-chip">
                        <div className="micro-label" style={{ color: "#854F0B" }}>{label}</div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "#412402", marginTop: 4 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ══ RIGHT: AI Health Coach ══ */}
            <div className="ai-col">
              <div className="ai-col-inner">

                {/* Top section: date + form */}
                <div className="ai-top-section">

                  {/* Title */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#2C2C2A" }}>AI Health Coach</div>
                    <div style={{ fontSize: 11, color: "#888780", marginTop: 2 }}>Personalized recommendations based on your data</div>
                  </div>

                  <div style={{ borderTop: "0.5px solid #F1EFE8", marginBottom: 16 }} />

                  {/* Date slider + calendar */}
                  <div style={{ marginBottom: 16 }}>
                    <div className="micro-label" style={{ color: "#888780" }}>Date</div>
                    <div ref={calRef} style={{ position: "relative", marginTop: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F1EFE8", border: "0.5px solid #D3D1C7", borderRadius: 10, padding: "7px 10px" }}>
                        <button onClick={() => shiftDate(-1)} style={arrowBtn}>&#8592;</button>
                        <button
                          onClick={() => setShowCal(s => !s)}
                          style={{ flex: 1, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "#2C2C2A", textAlign: "center", padding: 0 }}
                        >
                          {displayDate(date)}
                        </button>
                        <button onClick={() => shiftDate(1)} style={arrowBtn}>&#8594;</button>
                      </div>

                      {showCal && (
                        <div className="cal-dropdown">
                          <Calendar selected={date} onSelect={handleDateSelect} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ borderTop: "0.5px solid #F1EFE8", marginBottom: 16 }} />

                  {/* Goal input */}
                  <div style={{ marginBottom: 12 }}>
                    <div className="micro-label" style={{ color: "#888780" }}>Your goal</div>
                    <input className="ai-input" type="text" placeholder="e.g. lose weight, build stamina" value={goal} onChange={e => setGoal(e.target.value)} />
                  </div>

                  {/* Diet */}
                  <div style={{ marginBottom: 16 }}>
                    <div className="micro-label" style={{ color: "#888780" }}>Diet preference</div>
                    <select className="ai-input" value={dietType} onChange={e => setDietType(e.target.value)}>
                      <option value="veg">Vegetarian</option>
                      <option value="nonveg">Non-Vegetarian</option>
                    </select>
                  </div>

                  {/* Generate button */}
                  <button className="gen-btn" onClick={getSuggestion} disabled={loading || !goal}
                    style={{ background: loading || !goal ? "#F1EFE8" : "#EF9F27", color: loading || !goal ? "#B4B2A9" : "#412402" }}>
                    {loading ? "Generating..." : "Generate Health Plan"}
                  </button>

                  {loading && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF9F27", animation: "pulse 1s infinite", flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#888780" }}>Analyzing your data...</span>
                    </div>
                  )}
                </div>

                {/* Scrollable plan section */}
                <div className="ai-plan-section">
                  {suggestion && !loading ? (
                    <div className="ai-plan-box">
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: "#412402", marginBottom: 10 }}>Your plan</div>
                      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#633806", lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }}>
                        {suggestion}
                      </pre>
                    </div>
                  ) : !loading && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 0", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="1.5">
                          <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
                        </svg>
                      </div>
                      <div style={{ fontSize: 11, color: "#B4B2A9", textAlign: "center", lineHeight: 1.5 }}>
                        Enter a goal above to receive<br />your personalized health plan
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

/* ── button styles ── */
const arrowBtn: React.CSSProperties = {
  background: "none", border: "none",
  cursor: "pointer", fontSize: 14,
  color: "#BA7517", padding: "0 2px",
  lineHeight: 1, flexShrink: 0,
}

const calNavBtn: React.CSSProperties = {
  background: "none", border: "none",
  cursor: "pointer", fontSize: 14,
  color: "#BA7517", padding: "2px 6px",
  lineHeight: 1,
}