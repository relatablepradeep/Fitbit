'use client'

import { useState, useEffect } from "react";

type Tab = "home" | "activity" | "heart" | "sleep";

const WEEK      = ["S","S","M","T","W","T","F"];
const stepData  = [6800,4200,9100,7500,11200,5600,2178];
const hrData    = [68,72,75,71,69,74,76];
const sleepData = [6.5,7.2,5.8,7.8,8.1,6.3,7.0];
const calData   = [1800,1650,2200,1950,2400,1700,1315];

// ── Animated ring ──────────────────────────────────────────────────────────
function Ring({ value,max,r,color,sw=10,S=180 }:
  { value:number;max:number;r:number;color:string;sw?:number;S?:number }) {
  const circ = 2*Math.PI*r;
  const [off, setOff] = useState(circ);
  useEffect(()=>{ const t=setTimeout(()=>setOff(circ*(1-Math.min(value/max,1))),80); return ()=>clearTimeout(t); },[value,max,circ]);
  return (<>
    <circle cx={S/2} cy={S/2} r={r} fill="none" stroke="#162030" strokeWidth={sw}/>
    <circle cx={S/2} cy={S/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
      strokeDasharray={circ} strokeDashoffset={off}
      style={{transition:"stroke-dashoffset 1.3s cubic-bezier(.4,0,.2,1)"}}/>
  </>);
}

// ── Mini bar chart ─────────────────────────────────────────────────────────
function Bars({ data,color }:{ data:number[];color:string }) {
  const max = Math.max(...data);
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:60}}>
      {data.map((v,i)=>{ const h=Math.max((v/max)*100,5),last=i===data.length-1; return (
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,height:"100%"}}>
          <div style={{flex:1,display:"flex",alignItems:"flex-end",width:"100%"}}>
            <div style={{width:"100%",height:`${h}%`,background:color,opacity:last?1:0.45,borderRadius:3,transition:"height .7s ease"}}/>
          </div>
          <span style={{fontSize:9,color:last?color:"#4b5563",fontWeight:last?700:400}}>{WEEK[i]}</span>
        </div>
      );})}
    </div>
  );
}

// ── AI Insight chip ────────────────────────────────────────────────────────
function AI({ text }:{ text:string }) {
  return (
    <div style={{background:"rgba(0,229,176,.1)",border:"1px solid rgba(0,229,176,.2)",borderRadius:16,padding:"10px 14px",marginBottom:10,display:"flex",gap:10,alignItems:"flex-start"}}>
      <span style={{color:"#00e5b0",fontSize:14,flexShrink:0,marginTop:1}}>✦</span>
      <p style={{fontSize:12,color:"#d1d5db",margin:0,lineHeight:1.5}}><b style={{color:"#00e5b0",fontWeight:600}}>AI: </b>{text}</p>
    </div>
  );
}

// ── Card wrapper ────────────────────────────────────────────────────────────
function Card({ children,style }:{ children:React.ReactNode;style?:React.CSSProperties }) {
  return <div style={{background:"#0f1923",borderRadius:18,padding:16,marginBottom:10,...style}}>{children}</div>;
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════════════════════════
function HomeTab() {
  const S=180;
  return (
    <div style={{padding:"0 16px",animation:"fu .32s ease-out"}}>
      {/* Greeting */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0 14px"}}>
        <div>
          <p style={{color:"#6b7280",fontSize:12,margin:0}}>Good afternoon</p>
          <h1 style={{fontSize:22,fontWeight:700,margin:0,letterSpacing:-.3}}>Arjun 👋</h1>
        </div>
        <div style={{position:"relative"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#00e5b0,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#000",fontSize:15}}>A</div>
          <span style={{position:"absolute",top:-2,right:-2,width:10,height:10,borderRadius:"50%",background:"#00e5b0",border:"2px solid #050a0e"}}/>
        </div>
      </div>

      {/* Watch banner */}
      <div style={{background:"rgba(0,229,176,.08)",border:"1px solid rgba(0,229,176,.2)",borderRadius:14,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <span style={{fontSize:18}}>⌚</span>
        <div style={{flex:1}}>
          <p style={{fontSize:12,fontWeight:600,color:"#00e5b0",margin:0}}>Watch synced</p>
          <p style={{fontSize:10,color:"#6b7280",margin:0}}>Galaxy Watch 6 · 2 min ago</p>
        </div>
        <span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:10,background:"rgba(0,229,176,.15)",color:"#00e5b0"}}>LIVE</span>
      </div>

      {/* Triple ring */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:16}}>
        <div style={{position:"relative",width:S,height:S}}>
          <svg width={S} height={S} style={{transform:"rotate(-90deg)",position:"absolute",top:0,left:0}}>
            <Ring value={2178} max={10000} r={76} color="#60a5fa" sw={10} S={S}/>
            <Ring value={27}   max={60}    r={60} color="#f472b6" sw={9}  S={S}/>
            <Ring value={1315} max={2000}  r={45} color="#fbbf24" sw={8}  S={S}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:18,animation:"pulse 1s ease-in-out infinite"}}>♥</span>
            <span style={{fontSize:22,fontWeight:700,color:"#f87171",lineHeight:1}}>76</span>
            <span style={{fontSize:10,color:"#6b7280"}}>BPM</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:24,marginTop:12,width:"100%"}}>
          {([ ["#60a5fa","2,178","Steps"], ["#f472b6","27","Move Min"], ["#fbbf24","1,315","Cal"] ] as [string,string,string][]).map(([c,v,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <p style={{color:c,fontWeight:700,fontSize:16,margin:0}}>{v}</p>
              <p style={{color:"#6b7280",fontSize:10,margin:0}}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <AI text="You're 23% less active than your weekly average. Try a brisk 10-min walk to boost Heart Points!"/>

      {/* Vitals 2×2 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {([ ["Heart Rate","76","bpm","Resting: 62 bpm","#f87171"], ["Blood Oxygen","98","%","SpO₂ · Normal","#60a5fa"],
            ["Stress Level","42","/100","Moderate — breathe in","#fbbf24"], ["Body Temp","36.8","°C","Normal range ✓","#a78bfa"] ] as [string,string,string,string,string][]).map(([l,v,u,s,c])=>(
          <Card key={l} style={{padding:14}}>
            <p style={{color:"#6b7280",fontSize:11,margin:0}}>{l}</p>
            <p style={{color:c,fontSize:26,fontWeight:700,margin:"4px 0 0",lineHeight:1}}>{v}<span style={{fontSize:12,color:"#6b7280",fontWeight:400}}> {u}</span></p>
            <p style={{color:"#6b7280",fontSize:10,margin:"4px 0 0"}}>{s}</p>
          </Card>
        ))}
      </div>

      {/* Weekly target */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontWeight:600,fontSize:14}}>Weekly target</span>
          <span style={{color:"#6b7280",fontSize:12}}>8–14 Mar</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:8}}>
          <span style={{color:"#00e5b0",fontSize:24,fontWeight:700}}>33</span>
          <span style={{color:"#6b7280"}}>of</span>
          <span style={{fontSize:24,fontWeight:700}}>150</span>
          <span style={{color:"#6b7280",fontSize:12}}>Heart Pts</span>
        </div>
        <div style={{height:5,background:"#162030",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",background:"#00e5b0",borderRadius:3,width:"22%",transition:"width 1.2s ease"}}/>
        </div>
        <p style={{color:"#6b7280",fontSize:11,margin:"8px 0 0"}}>WHO: 150 Heart Pts/week for better health</p>
      </Card>

      {/* Steps mini */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
          <span style={{fontWeight:600,fontSize:14}}>Steps</span>
          <span style={{color:"#60a5fa",fontSize:12,fontWeight:600}}>See all ›</span>
        </div>
        <p style={{color:"#6b7280",fontSize:11,margin:"2px 0 8px"}}>Last 7 days</p>
        <p style={{color:"#60a5fa",fontWeight:700,fontSize:20,margin:"0 0 10px"}}>2,178 <span style={{color:"#6b7280",fontSize:12,fontWeight:400}}>today</span></p>
        <Bars data={stepData} color="#60a5fa"/>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ACTIVITY
// ══════════════════════════════════════════════════════════════════════════════
function ActivityTab() {
  return (
    <div style={{padding:"12px 16px",animation:"fu .32s ease-out"}}>
      <h1 style={{fontSize:21,fontWeight:700,margin:"0 0 2px"}}>Activity</h1>
      <p style={{color:"#6b7280",fontSize:12,margin:"0 0 12px"}}>From your smartwatch · Today</p>
      <AI text="Your peak activity window is 7–9 AM. Schedule workouts then for best energy output."/>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <p style={{color:"#6b7280",fontSize:12,margin:0}}>Steps Today</p>
            <p style={{color:"#60a5fa",fontSize:38,fontWeight:700,margin:"4px 0 0",lineHeight:1}}>2,178</p>
            <p style={{color:"#6b7280",fontSize:11,margin:"6px 0 0"}}>Goal: 8,000 · 27% complete</p>
          </div>
          <div style={{position:"relative",width:64,height:64}}>
            <svg width={64} height={64} style={{transform:"rotate(-90deg)"}}>
              <circle cx={32} cy={32} r={26} fill="none" stroke="#162030" strokeWidth={7}/>
              <circle cx={32} cy={32} r={26} fill="none" stroke="#60a5fa" strokeWidth={7} strokeLinecap="round"
                strokeDasharray={163.4} strokeDashoffset={119.3} style={{transition:"stroke-dashoffset 1.3s ease"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#60a5fa",fontSize:12,fontWeight:700}}>27%</div>
          </div>
        </div>
        <div style={{marginTop:14}}><Bars data={stepData} color="#60a5fa"/></div>
      </Card>

      <Card>
        <p style={{color:"#6b7280",fontSize:12,margin:0}}>Calories Burned</p>
        <p style={{color:"#fbbf24",fontSize:32,fontWeight:700,margin:"6px 0 10px",lineHeight:1}}>1,315 <span style={{fontSize:14,color:"#6b7280",fontWeight:400}}>kcal</span></p>
        <Bars data={calData} color="#fbbf24"/>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {([ ["Distance","1.19","km","Goal: 5 km","#a78bfa"], ["Move Minutes","27","min","Goal: 60 min","#f472b6"] ] as [string,string,string,string,string][]).map(([l,v,u,s,c])=>(
          <Card key={l} style={{padding:14}}>
            <p style={{color:"#6b7280",fontSize:11,margin:0}}>{l}</p>
            <p style={{color:c,fontSize:24,fontWeight:700,margin:"4px 0 0",lineHeight:1}}>{v}<span style={{fontSize:11,color:"#6b7280",fontWeight:400}}> {u}</span></p>
            <p style={{color:"#6b7280",fontSize:10,margin:"4px 0 0"}}>{s}</p>
          </Card>
        ))}
      </div>

      <p style={{fontSize:10,color:"#6b7280",letterSpacing:2,textTransform:"uppercase",margin:"14px 0 8px"}}>Recent Workouts</p>
      {([ ["🚶","Morning Walk","6:45 AM · 32 min · 1.8 km","142 cal"], ["🧘","Yoga","8:30 AM · 20 min","80 cal"] ]).map(([ic,name,sub,cal])=>(
        <Card key={name} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px"}}>
          <span style={{fontSize:24}}>{ic}</span>
          <div style={{flex:1}}>
            <p style={{fontWeight:600,fontSize:13,margin:0}}>{name}</p>
            <p style={{color:"#6b7280",fontSize:11,margin:"2px 0 0"}}>{sub}</p>
          </div>
          <p style={{color:"#fbbf24",fontWeight:600,fontSize:13,margin:0}}>{cal}</p>
        </Card>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HEART
// ══════════════════════════════════════════════════════════════════════════════
function HeartTab() {
  const log=[ {t:"06:00",v:62},{t:"08:00",v:88},{t:"10:00",v:71},{t:"12:00",v:74},{t:"14:00",v:79},{t:"16:00",v:76} ];
  return (
    <div style={{padding:"12px 16px",animation:"fu .32s ease-out"}}>
      <h1 style={{fontSize:21,fontWeight:700,margin:"0 0 2px"}}>Heart</h1>
      <p style={{color:"#6b7280",fontSize:12,margin:"0 0 12px"}}>Continuous monitoring · ECG-grade sensor</p>

      <div style={{background:"linear-gradient(135deg,rgba(248,113,113,.08),rgba(239,68,68,.04))",border:"1px solid rgba(248,113,113,.12)",borderRadius:18,padding:"24px 16px",textAlign:"center",marginBottom:10}}>
        <p style={{color:"#6b7280",fontSize:12,margin:0}}>Current Heart Rate</p>
        <p style={{color:"#f87171",fontSize:52,fontWeight:700,margin:"6px 0",lineHeight:1}}>76</p>
        <p style={{color:"#6b7280",fontSize:13,margin:0}}>BPM · <span style={{color:"#34d399"}}>Normal</span></p>
      </div>

      <div style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",borderRadius:16,padding:"12px 14px",display:"flex",gap:10,marginBottom:10}}>
        <span style={{fontSize:16}}>🤖</span>
        <div>
          <p style={{color:"#34d399",fontSize:12,fontWeight:600,margin:0}}>AI Health Insight</p>
          <p style={{color:"#d1d5db",fontSize:11,margin:"4px 0 0",lineHeight:1.5}}>Your HRV is 48ms — above average! Great recovery. Keep your sleep routine consistent for optimal heart health.</p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
        {([ ["Resting","62","bpm","#f87171"], ["Max Today","118","bpm","#ef4444"], ["HRV","48","ms","#a78bfa"] ] as [string,string,string,string][]).map(([l,v,u,c])=>(
          <Card key={l} style={{padding:"12px 10px",textAlign:"center"}}>
            <p style={{color:"#6b7280",fontSize:10,margin:0}}>{l}</p>
            <p style={{color:c,fontSize:20,fontWeight:700,margin:"4px 0 0",lineHeight:1}}>{v}<span style={{fontSize:9,color:"#6b7280",fontWeight:400}}> {u}</span></p>
          </Card>
        ))}
      </div>

      <Card>
        <p style={{fontWeight:600,fontSize:14,margin:"0 0 4px"}}>7-Day Resting HR</p>
        <p style={{color:"#6b7280",fontSize:11,margin:"0 0 10px"}}>Average beats per minute</p>
        <Bars data={hrData} color="#f87171"/>
      </Card>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{color:"#6b7280",fontSize:12,margin:0}}>Blood Oxygen (SpO₂)</p>
            <p style={{color:"#60a5fa",fontSize:32,fontWeight:700,margin:"6px 0 4px",lineHeight:1}}>98<span style={{fontSize:14,color:"#6b7280",fontWeight:400}}> %</span></p>
            <p style={{color:"#34d399",fontSize:11,margin:0}}>✓ Normal (95–100%)</p>
          </div>
          <div style={{width:54,height:54,borderRadius:"50%",background:"rgba(96,165,250,.1)",border:"2px solid rgba(96,165,250,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>◎</div>
        </div>
      </Card>

      <p style={{fontSize:10,color:"#6b7280",letterSpacing:2,textTransform:"uppercase",margin:"12px 0 8px"}}>Today's Log</p>
      {log.map(({t,v})=>{
        const c=v>100?"#f87171":v>85?"#fbbf24":"#34d399";
        return (
          <div key={t} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
            <span style={{color:"#6b7280",fontSize:12,minWidth:50}}>{t}</span>
            <div style={{flex:1,height:3,background:"#162030",borderRadius:2}}>
              <div style={{height:"100%",background:c,borderRadius:2,width:`${Math.min((v/140)*100,100)}%`,transition:"width .7s ease"}}/>
            </div>
            <span style={{color:c,fontSize:12,fontWeight:600,minWidth:60,textAlign:"right"}}>{v} bpm</span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLEEP
// ══════════════════════════════════════════════════════════════════════════════
function SleepTab() {
  const stages=[ {l:"Awake",p:8,c:"#6b7280"},{l:"REM",p:20,c:"#a78bfa"},{l:"Light",p:40,c:"#60a5fa"},{l:"Deep",p:32,c:"#1d4ed8"} ];
  return (
    <div style={{padding:"12px 16px",animation:"fu .32s ease-out"}}>
      <h1 style={{fontSize:21,fontWeight:700,margin:"0 0 2px"}}>Sleep</h1>
      <p style={{color:"#6b7280",fontSize:12,margin:"0 0 12px"}}>Auto-detected by your smartwatch</p>

      <div style={{background:"linear-gradient(135deg,rgba(167,139,250,.08),rgba(30,64,175,.05))",border:"1px solid rgba(167,139,250,.15)",borderRadius:18,padding:"22px 16px",textAlign:"center",marginBottom:10}}>
        <p style={{color:"#6b7280",fontSize:12,margin:0}}>Last Night · Mar 12–13</p>
        <p style={{color:"#a78bfa",fontSize:48,fontWeight:700,margin:"8px 0",lineHeight:1}}>7h 2m</p>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(167,139,250,.15)",padding:"4px 14px",borderRadius:20,marginBottom:6}}>
          <span style={{color:"#a78bfa",fontSize:12,fontWeight:600}}>Sleep Score: 78</span>
          <span style={{color:"#fbbf24",fontSize:12}}>★ Good</span>
        </div>
        <p style={{color:"#6b7280",fontSize:11,margin:0}}>Bedtime 11:02 PM · Wake 6:04 AM</p>
      </div>

      <div style={{background:"rgba(167,139,250,.08)",border:"1px solid rgba(167,139,250,.2)",borderRadius:16,padding:"12px 14px",display:"flex",gap:10,marginBottom:10}}>
        <span style={{fontSize:16}}>🤖</span>
        <div>
          <p style={{color:"#a78bfa",fontSize:12,fontWeight:600,margin:0}}>AI Sleep Insight</p>
          <p style={{color:"#d1d5db",fontSize:11,margin:"4px 0 0",lineHeight:1.5}}>32% deep sleep — excellent! Avoid screens 1hr before bed to improve REM sleep by ~15%.</p>
        </div>
      </div>

      <Card>
        <p style={{fontWeight:600,fontSize:14,margin:"0 0 12px"}}>Sleep Stages</p>
        <div style={{display:"flex",height:16,borderRadius:8,overflow:"hidden",marginBottom:12}}>
          {stages.map(s=><div key={s.l} style={{width:`${s.p}%`,background:s.c}}/>)}
        </div>
        {stages.map(s=>(
          <div key={s.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:8,height:8,borderRadius:2,background:s.c,display:"inline-block"}}/>
              <span style={{color:"#d1d5db",fontSize:12}}>{s.l}</span>
            </div>
            <span style={{color:"#6b7280",fontSize:12}}>{s.p}%</span>
          </div>
        ))}
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {([ ["REM Sleep","1h 24m","#a78bfa"], ["Deep Sleep","2h 15m","#3b82f6"], ["Avg HR","58 bpm","#f87171"], ["Restfulness","High","#34d399"] ] as [string,string,string][]).map(([l,v,c])=>(
          <Card key={l} style={{padding:12}}>
            <p style={{color:"#6b7280",fontSize:11,margin:0}}>{l}</p>
            <p style={{color:c,fontSize:18,fontWeight:700,margin:"4px 0 0"}}>{v}</p>
          </Card>
        ))}
      </div>

      <Card>
        <p style={{fontWeight:600,fontSize:14,margin:"0 0 4px"}}>7-Day Sleep Trend</p>
        <p style={{color:"#6b7280",fontSize:11,margin:"0 0 10px"}}>Hours per night</p>
        <Bars data={sleepData} color="#a78bfa"/>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function SmartHealthDashboard() {
  const [tab, setTab] = useState<Tab>("home");
  const nav: {id:Tab;icon:string;label:string}[] = [
    {id:"home",    icon:"◎",label:"Home"},
    {id:"activity",icon:"⟳",label:"Activity"},
    {id:"heart",   icon:"♥",label:"Heart"},
    {id:"sleep",   icon:"☾",label:"Sleep"},
  ];
  const pages = {
    home:     <HomeTab     key="home"/>,
    activity: <ActivityTab key="activity"/>,
    heart:    <HeartTab    key="heart"/>,
    sleep:    <SleepTab    key="sleep"/>,
  };
  return (
    <div style={{background:"#050a0e",minHeight:"100vh",color:"#fff",fontFamily:"'Google Sans',Roboto,sans-serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        @keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
        ::-webkit-scrollbar{width:0}
      `}</style>
      {/* Status */}
      <div style={{display:"flex",justifyContent:"space-between",padding:"12px 18px 4px",fontSize:12,color:"#9ca3af"}}>
        <span style={{color:"#fff",fontWeight:600,fontSize:13}}>9:41</span>
        <span style={{color:"#fff"}}>84%</span>
      </div>
      {/* Content */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:88}}>
        {pages[tab]}
      </div>
      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#0f1923",borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-around",padding:"8px 0 12px",zIndex:50}}>
        {nav.map(({id,icon,label})=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{background:"none",border:"none",cursor:"pointer",color:tab===id?"#00e5b0":"#6b7280",padding:"6px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontFamily:"'Google Sans',sans-serif",transition:"color .2s"}}>
            <span style={{fontSize:20,lineHeight:1}}>{icon}</span>
            <span style={{fontSize:10,fontWeight:500}}>{label}</span>
            {tab===id && <span style={{width:4,height:4,borderRadius:"50%",background:"#00e5b0",display:"block"}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
