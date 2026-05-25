import { useState, useRef, useEffect } from "react";

const C = {
  bg:"#07080c", surface:"#0d0f18", card:"#111520", border:"#1c2136",
  accent:"#c9a84c", accentSoft:"#c9a84c18", accentMid:"#c9a84c33",
  blue:"#4f8ef7", blueSoft:"#4f8ef714", green:"#22c55e", greenSoft:"#22c55e14",
  purple:"#a78bfa", purpleSoft:"#a78bfa14", red:"#f87171", redSoft:"#f8717114",
  orange:"#fb923c", orangeSoft:"#fb923c14",
  text:"#eef0f8", muted:"#5b6480", subtle:"#1e2540",
};

const avatarColors=["#c9a84c","#4f8ef7","#22c55e","#f87171","#a78bfa","#fb923c"];
const CATEGORIES=["Entrepreneur","Business Owner","Startup","Freelancer","Digital Marketer","Coach & Trainer","Investor","Influencer","Agency","Student","Recruiter","Professional"];
const SOCIAL_PLATFORMS=[
  {key:"linkedin",label:"LinkedIn",icon:"in",color:"#0077b5"},
  {key:"twitter",label:"Twitter/X",icon:"𝕏",color:"#1da1f2"},
  {key:"instagram",label:"Instagram",icon:"📸",color:"#e1306c"},
  {key:"youtube",label:"YouTube",icon:"▶",color:"#ff0000"},
  {key:"facebook",label:"Facebook",icon:"f",color:"#1877f2"},
];
const navItems=[
  {id:"dashboard",icon:"⊞",label:"Dashboard"},
  {id:"network",icon:"🌐",label:"Network"},
  {id:"leads",icon:"🎯",label:"Leads"},
  {id:"events",icon:"📅",label:"Events"},
  {id:"profile",icon:"👤",label:"Profile"},
];
const DEFAULT_PROFILE={
  name:"",role:"",company:"",category:"",website:"",whatsapp:"",bio:"",location:"",
  photo:null,photoInitials:"",
  social:{linkedin:"",twitter:"",instagram:"",youtube:"",facebook:""},
  skills:[],services:[],experience:[],portfolio:[],
};

/* ── tiny helpers ── */
function ava(p){return p.photoInitials||(p.name?p.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase():"?")}

function Avatar({initials,photo,size=40,idx=0,online=false}){
  return(
    <div style={{position:"relative",display:"inline-block",flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:"50%",overflow:"hidden",
        background:photo?"none":`linear-gradient(135deg,${avatarColors[idx%6]},${avatarColors[(idx+2)%6]})`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:size*.36,fontWeight:800,color:"#fff",fontFamily:"'Syne',sans-serif",
        border:`2px solid ${C.border}`,flexShrink:0}}>
        {photo?<img src={photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:(initials||"?")}
      </div>
      {online&&<div style={{position:"absolute",bottom:1,right:1,width:10,height:10,background:C.green,borderRadius:"50%",border:"2px solid "+C.bg}}/>}
    </div>
  );
}

function Badge({children,color=C.accent,soft=false,small=false}){
  return(
    <span style={{background:soft?color+"22":color,color:soft?color:"#000",
      fontSize:small?9:10,fontWeight:700,padding:small?"1px 6px":"2px 9px",borderRadius:20,
      letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",whiteSpace:"nowrap"}}>
      {children}
    </span>
  );
}

function GlowCard({children,style={},onClick,glow=false}){
  const[h,sH]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{background:h?"#141828":C.card,border:`1px solid ${h||glow?C.accent+"44":C.border}`,
        borderRadius:18,padding:20,transition:"all .22s",cursor:onClick?"pointer":"default",
        boxShadow:glow?"0 0 28px "+C.accent+"18":"none",...style}}>
      {children}
    </div>
  );
}

function MiniStat({icon,label,value,color=C.accent,delta}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <div style={{fontSize:18}}>{icon}</div>
      <div style={{fontSize:22,fontWeight:800,color,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{value}</div>
      {delta&&<div style={{fontSize:10,color:C.green,fontWeight:700}}>↑ {delta}</div>}
      <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</div>
    </div>
  );
}

function SectionTitle({children,action,onAction}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:C.text,letterSpacing:"0.01em"}}>{children}</div>
      {action&&<span onClick={onAction} style={{fontSize:11,color:C.accent,fontWeight:700,cursor:"pointer",letterSpacing:"0.04em"}}>{action}</span>}
    </div>
  );
}

/* ── sample data ── */
const sampleUsers=[
  {id:1,name:"Priya Sharma",role:"Digital Marketing Head",company:"BrandBoost",avatar:"PS",category:"Digital Marketer",location:"Delhi",followers:3280,connections:891,verified:true,online:true},
  {id:2,name:"Rahul Gupta",role:"Angel Investor",company:"GV Capital",avatar:"RG",category:"Investor",location:"Bangalore",followers:5600,connections:1204,verified:true,online:false},
  {id:3,name:"Sneha Patil",role:"Business Coach",company:"GrowthMind",avatar:"SP",category:"Coach",location:"Pune",followers:2100,connections:543,verified:false,online:true},
  {id:4,name:"Dev Krishnan",role:"Full-Stack Dev",company:"Self-Employed",avatar:"DK",category:"Freelancer",location:"Chennai",followers:780,connections:215,verified:true,online:true},
  {id:5,name:"Meera Joshi",role:"HR & Recruiter",company:"TalentBridge",avatar:"MJ",category:"Recruiter",location:"Hyderabad",followers:1560,connections:672,verified:true,online:false},
  {id:6,name:"Vikram Nair",role:"Agency Owner",company:"CreativeStack",avatar:"VN",category:"Agency",location:"Kochi",followers:920,connections:340,verified:false,online:true},
];
const visitors=[
  {name:"Arjun Mehta",role:"Startup Founder",avatar:"AM",time:"2m ago",idx:0},
  {name:"Kavya Reddy",role:"VC Analyst",avatar:"KR",time:"15m ago",idx:1},
  {name:"Suresh Pillai",role:"CMO",avatar:"SP",time:"1h ago",idx:2},
  {name:"Neha Singh",role:"Brand Strategist",avatar:"NS",time:"3h ago",idx:3},
];
const leadsData=[
  {name:"TechNova Pvt Ltd",need:"Marketing Agency",budget:"₹80K/mo",hot:true,avatar:"TN",idx:0},
  {name:"GreenBuild Co.",need:"B2B Sales Partner",budget:"₹1.2L/mo",hot:true,avatar:"GB",idx:1},
  {name:"FinEdge Solutions",need:"CTO Co-Founder",budget:"Equity 15%",hot:false,avatar:"FE",idx:2},
  {name:"AgroSmart India",need:"Investor – ₹50L",budget:"Seed Round",hot:false,avatar:"AG",idx:3},
];
const eventsData=[
  {title:"B2B Growth Summit 2026",date:"Jun 15",location:"Mumbai",type:"Conference",price:"₹2,999",seats:23},
  {title:"Startup Investor Meet",date:"Jun 22",location:"Bangalore",type:"Meetup",price:"Free",seats:8},
  {title:"Digital Mktg Masterclass",date:"Jul 3",location:"Online",type:"Workshop",price:"₹999",seats:112},
];
const messages=[
  {from:"Rahul Gupta",avatar:"RG",idx:1,text:"Interested in investing in your startup. Can we connect?",time:"Just now",unread:true},
  {from:"Priya Sharma",avatar:"PS",idx:0,text:"Loved your post on B2B lead gen! Would love to collab.",time:"12m",unread:true},
  {from:"Dev Krishnan",avatar:"DK",idx:3,text:"Hey! Can you review my portfolio?",time:"1h",unread:false},
];
const savedPosts=[
  {title:"10 WhatsApp strategies for B2B leads",by:"Priya Sharma",tag:"Marketing"},
  {title:"How I raised ₹2Cr in 60 days",by:"Rahul Gupta",tag:"Funding"},
  {title:"Building a 1000-client network from scratch",by:"Sneha Patil",tag:"Networking"},
];
const primaryGoals=[
  {icon:"🌐",title:"Business Networking Ecosystem",desc:"Connect entrepreneurs, investors & professionals nationwide",color:C.blue},
  {icon:"🤝",title:"B2B Collaborations",desc:"Increase high-value business partnerships & deals",color:C.green},
  {icon:"⚡",title:"Simplify Networking",desc:"One platform for all your professional connections",color:C.accent},
  {icon:"🎯",title:"Lead Generation",desc:"Generate qualified business leads every day",color:C.orange},
  {icon:"🏙️",title:"Local & Global Communities",desc:"Build your network from your city to the world",color:C.purple},
  {icon:"🚀",title:"Support Startups",desc:"Empower entrepreneurs and startups to scale faster",color:C.red},
];
const bizGoals=[
  {icon:"💎",label:"Premium Plans",value:"₹499–₹2,999/mo",color:C.accent},
  {icon:"📢",label:"Sponsored Promos",value:"₹5K–₹50K/post",color:C.blue},
  {icon:"🎟️",label:"Event Monetization",value:"₹999–₹2,999",color:C.green},
  {icon:"📣",label:"Business Ads",value:"CPM & CPC based",color:C.purple},
];

/* ══════════════════════════════════════════
   DASHBOARD SCREEN
══════════════════════════════════════════ */
function DashboardScreen({profile,onGoToProfile,onGoToLeads,onGoToEvents,onGoToNetwork}){
  const[msgOpen,setMsgOpen]=useState(false);
  const[savedOpen,setSavedOpen]=useState(false);
  const[notifsOpen,setNotifsOpen]=useState(false);
  const unreadMsgs=messages.filter(m=>m.unread).length;
  const myInitials=ava(profile);
  const hasProfile=!!profile.name;

  return(
    <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:18,paddingBottom:96}}>

      {/* ── Welcome Banner ── */}
      <div style={{background:"linear-gradient(135deg,#101628 0%,#0d1420 50%,#141020 100%)",border:"1px solid "+C.accent+"33",borderRadius:20,padding:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:C.accent+"0d",borderRadius:"50%"}}/>
        <div style={{position:"absolute",bottom:-20,left:40,width:80,height:80,background:C.blue+"0a",borderRadius:"50%"}}/>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,position:"relative"}}>
          <Avatar photo={profile.photo} initials={myInitials} size={52} idx={0} online/>
          <div>
            <div style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>Good morning 👋</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.text,fontSize:20,lineHeight:1.1}}>
              {hasProfile?profile.name:"Welcome to TezConnect"}
            </div>
            {hasProfile&&<div style={{fontSize:11,color:C.accent,fontWeight:600,marginTop:2}}>{profile.role}{profile.company?" · "+profile.company:""}</div>}
          </div>
        </div>
        {!hasProfile&&(
          <button onClick={onGoToProfile} style={{background:C.accent,color:"#000",border:"none",borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:800,cursor:"pointer",width:"100%",fontFamily:"'Syne',sans-serif"}}>🚀 Complete Your Profile</button>
        )}
        {hasProfile&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,position:"relative"}}>
            {[
              {icon:"🔗",label:"Connections",value:"382",color:C.blue},
              {icon:"👁️",label:"Profile Views",value:"4.2K",color:C.accent},
              {icon:"🎯",label:"Leads",value:"38",color:C.green},
              {icon:"⭐",label:"Saves",value:"127",color:C.purple},
            ].map(s=>(
              <div key={s.label} style={{background:"#ffffff07",borderRadius:12,padding:"10px 6px",textAlign:"center",border:"1px solid "+C.border}}>
                <div style={{fontSize:16}}>{s.icon}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:s.color}}>{s.value}</div>
                <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",lineHeight:1.2,marginTop:2}}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <SectionTitle>Quick Actions</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {icon:"💬",label:"Messages",badge:unreadMsgs,action:()=>setMsgOpen(true),color:C.blue},
            {icon:"🔔",label:"Alerts",badge:5,action:()=>setNotifsOpen(true),color:C.accent},
            {icon:"🎯",label:"My Leads",badge:null,action:onGoToLeads,color:C.green},
            {icon:"🔖",label:"Saved",badge:savedPosts.length,action:()=>setSavedOpen(true),color:C.purple},
          ].map(q=>(
            <button key={q.label} onClick={q.action} style={{background:C.card,border:"1px solid "+C.border,borderRadius:14,padding:"14px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .18s",position:"relative"}}>
              <div style={{fontSize:22}}>{q.icon}</div>
              {q.badge>0&&<div style={{position:"absolute",top:8,right:8,background:C.red,color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{q.badge}</div>}
              <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{q.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Primary Goals ── */}
      <div>
        <SectionTitle>Platform Goals</SectionTitle>
        <div style={{background:"linear-gradient(135deg,#0d1020,#101828)",border:"1px solid "+C.blue+"33",borderRadius:18,padding:16,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:36,height:36,background:C.blueSoft,border:"1px solid "+C.blue+"44",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎯</div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.text,fontSize:14}}>Primary Goals</div>
              <div style={{fontSize:11,color:C.muted}}>What TezConnect is built to achieve</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {primaryGoals.map((g,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 12px",background:"#ffffff05",borderRadius:12,border:"1px solid "+g.color+"22"}}>
                <div style={{width:34,height:34,borderRadius:10,background:g.color+"18",border:"1px solid "+g.color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{g.icon}</div>
                <div>
                  <div style={{fontWeight:700,color:C.text,fontSize:12,marginBottom:2}}>{g.title}</div>
                  <div style={{fontSize:11,color:C.muted,lineHeight:1.4}}>{g.desc}</div>
                </div>
                <div style={{marginLeft:"auto",color:g.color,fontSize:14,flexShrink:0}}>→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Goals */}
        <div style={{background:"linear-gradient(135deg,#0f1018,#140f20)",border:"1px solid "+C.accent+"33",borderRadius:18,padding:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:36,height:36,background:C.accentSoft,border:"1px solid "+C.accent+"44",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💰</div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.text,fontSize:14}}>Business Goals</div>
              <div style={{fontSize:11,color:C.muted}}>Revenue & monetization model</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {bizGoals.map((g,i)=>(
              <div key={i} style={{background:g.color+"0f",border:"1px solid "+g.color+"2a",borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:20,marginBottom:6}}>{g.icon}</div>
                <div style={{fontWeight:700,color:C.text,fontSize:12,marginBottom:3}}>{g.label}</div>
                <div style={{fontSize:11,color:g.color,fontWeight:700}}>{g.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Personalized Feed Snippet ── */}
      <div>
        <SectionTitle action="See All Feed →">Personalized Feed</SectionTitle>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {user:sampleUsers[1],content:"Portfolio company just hit ₹10Cr ARR in 18 months. Actively deploying capital in HealthTech this Q3.",tag:"Investing",likes:381,time:"2h"},
            {user:sampleUsers[0],content:"Generated 1,400 qualified B2B leads in 30 days using our WhatsApp + LinkedIn combo strategy. 🔥",tag:"Marketing",likes:267,time:"5h"},
          ].map((p,i)=>(
            <GlowCard key={i} style={{padding:14}}>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <Avatar initials={p.user.avatar} size={38} idx={i+1} online={p.user.online}/>
                <div>
                  <div style={{fontWeight:700,color:C.text,fontSize:13,display:"flex",gap:6,alignItems:"center"}}>
                    {p.user.name} {p.user.verified&&<span style={{color:C.blue,fontSize:10}}>✓</span>}
                  </div>
                  <div style={{fontSize:10,color:C.muted}}>{p.user.role} · {p.time} ago</div>
                </div>
                <div style={{marginLeft:"auto"}}><Badge soft small>{p.tag}</Badge></div>
              </div>
              <p style={{color:"#c5c9db",fontSize:12,lineHeight:1.6,margin:"0 0 10px"}}>{p.content}</p>
              <div style={{display:"flex",gap:16,borderTop:"1px solid "+C.border,paddingTop:8}}>
                {[["👍",p.likes],["💬","14"],["↗","Share"]].map(([ic,v])=>(
                  <button key={ic} style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer"}}>{ic} {v}</button>
                ))}
              </div>
            </GlowCard>
          ))}
        </div>
      </div>

      {/* ── Suggested Connections ── */}
      <div>
        <SectionTitle action="View All →" onAction={onGoToNetwork}>Suggested Connections</SectionTitle>
        <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:4}}>
          {sampleUsers.slice(0,5).map((u,i)=>(
            <div key={u.id} style={{background:C.card,border:"1px solid "+C.border,borderRadius:16,padding:"14px 12px",minWidth:130,display:"flex",flexDirection:"column",alignItems:"center",gap:8,flexShrink:0}}>
              <Avatar initials={u.avatar} size={46} idx={i} online={u.online}/>
              <div style={{textAlign:"center"}}>
                <div style={{fontWeight:700,color:C.text,fontSize:12,lineHeight:1.2}}>{u.name.split(" ")[0]}<br/><span style={{fontSize:10}}>{u.name.split(" ")[1]||""}</span></div>
                <div style={{fontSize:9,color:C.muted,marginTop:2}}>{u.role}</div>
              </div>
              <ConnBtn/>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Visitors ── */}
      <div>
        <SectionTitle>Recent Visitors <span style={{fontSize:11,color:C.muted,fontWeight:500}}>({visitors.length} today)</span></SectionTitle>
        <GlowCard style={{padding:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {visitors.map((v,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                <Avatar initials={v.avatar} size={38} idx={v.idx}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:13}}>{v.name}</div>
                  <div style={{fontSize:10,color:C.muted}}>{v.role}</div>
                </div>
                <div style={{fontSize:10,color:C.muted}}>{v.time}</div>
                <ConnBtn small/>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* ── Business Leads ── */}
      <div>
        <SectionTitle action="All Leads →" onAction={onGoToLeads}>Business Leads</SectionTitle>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {leadsData.slice(0,3).map((l,i)=>(
            <GlowCard key={i} style={{padding:14}} glow={l.hot}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${avatarColors[l.idx%6]},${avatarColors[(l.idx+2)%6]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",fontFamily:"'Syne',sans-serif",flexShrink:0}}>{l.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <span style={{fontWeight:700,color:C.text,fontSize:13}}>{l.name}</span>
                    {l.hot&&<Badge color={C.red} small>🔥 Hot</Badge>}
                  </div>
                  <div style={{fontSize:11,color:C.muted}}>{l.need}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:C.accent,fontWeight:800,fontSize:12}}>{l.budget}</div>
                  <button style={{background:C.accent,color:"#000",border:"none",borderRadius:7,padding:"5px 12px",fontSize:10,fontWeight:700,cursor:"pointer",marginTop:4}}>Respond</button>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>

      {/* ── Upcoming Events ── */}
      <div>
        <SectionTitle action="All Events →" onAction={onGoToEvents}>Upcoming Events</SectionTitle>
        <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:4}}>
          {eventsData.map((ev,i)=>(
            <div key={i} style={{background:C.card,border:"1px solid "+C.border,borderRadius:16,padding:14,minWidth:180,flexShrink:0}}>
              <div style={{background:C.accentSoft,border:"1px solid "+C.accent+"33",borderRadius:8,padding:"4px 10px",display:"inline-block",marginBottom:10}}>
                <span style={{color:C.accent,fontSize:11,fontWeight:800}}>{ev.date}</span>
              </div>
              <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:4,lineHeight:1.3}}>{ev.title}</div>
              <div style={{fontSize:10,color:C.muted,marginBottom:8}}>📍 {ev.location}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{color:C.green,fontWeight:800,fontSize:12}}>{ev.price}</span>
                <button style={{background:C.accent,color:"#000",border:"none",borderRadius:7,padding:"5px 12px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Join</button>
              </div>
              {ev.seats<30&&<div style={{fontSize:9,color:C.red,fontWeight:700,marginTop:6}}>⚠ Only {ev.seats} seats left</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Modals ── */}
      {msgOpen&&(
        <Modal title="Messages" onClose={()=>setMsgOpen(false)}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"12px 0",borderBottom:"1px solid "+C.border}}>
              <div style={{position:"relative"}}>
                <Avatar initials={m.avatar} size={40} idx={m.idx}/>
                {m.unread&&<div style={{position:"absolute",top:0,right:0,width:10,height:10,background:C.blue,borderRadius:"50%",border:"2px solid "+C.card}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:C.text,fontSize:13}}>{m.from}</div>
                <div style={{fontSize:11,color:m.unread?C.text:C.muted,lineHeight:1.4,marginTop:2}}>{m.text}</div>
              </div>
              <div style={{fontSize:10,color:C.muted,flexShrink:0}}>{m.time}</div>
            </div>
          ))}
          <button style={{width:"100%",background:C.accent,color:"#000",border:"none",borderRadius:10,padding:"12px 0",fontSize:13,fontWeight:800,cursor:"pointer",marginTop:12}}>Open Full Inbox</button>
        </Modal>
      )}
      {notifsOpen&&(
        <Modal title="Notifications" onClose={()=>setNotifsOpen(false)}>
          {[
            {icon:"🔗",text:"Rahul Gupta sent you a connection request",time:"2m",color:C.blue},
            {icon:"👁️",text:"Your profile was viewed 14 times today",time:"1h",color:C.accent},
            {icon:"🎯",text:"New lead matched your business profile",time:"3h",color:C.green},
            {icon:"📅",text:"B2B Growth Summit starts in 3 days",time:"1d",color:C.purple},
            {icon:"💬",text:"Priya Sharma replied to your message",time:"2d",color:C.orange},
          ].map((n,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderBottom:"1px solid "+C.border}}>
              <div style={{width:36,height:36,borderRadius:10,background:n.color+"18",border:"1px solid "+n.color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{n.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:C.text,lineHeight:1.4}}>{n.text}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>{n.time} ago</div>
              </div>
            </div>
          ))}
        </Modal>
      )}
      {savedOpen&&(
        <Modal title="Saved Posts" onClose={()=>setSavedOpen(false)}>
          {savedPosts.map((s,i)=>(
            <div key={i} style={{padding:"12px 0",borderBottom:"1px solid "+C.border}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                <Badge soft small>{s.tag}</Badge>
              </div>
              <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:3}}>{s.title}</div>
              <div style={{fontSize:11,color:C.muted}}>by {s.by}</div>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

function Modal({title,children,onClose}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"#000c",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.surface,border:"1px solid "+C.border,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:430,maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:C.text}}>{title}</div>
          <button onClick={onClose} style={{background:C.border,border:"none",borderRadius:"50%",width:28,height:28,color:C.muted,cursor:"pointer",fontSize:16}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConnBtn({small=false}){
  const[s,sS]=useState(false);
  return(
    <button onClick={()=>sS(!s)} style={{background:s?C.accentSoft:C.accent,color:s?C.accent:"#000",border:"1px solid "+C.accent,borderRadius:8,padding:small?"5px 10px":"7px 14px",fontSize:small?10:11,fontWeight:700,cursor:"pointer",transition:"all .18s",whiteSpace:"nowrap"}}>
      {s?"✓":"+ Connect"}
    </button>
  );
}

/* ── Network Screen ── */
const catFilter=["All","Entrepreneur","Investor","Digital Marketer","Freelancer","Coach","Recruiter","Agency"];
function NetworkScreen(){
  const[filter,sF]=useState("All");
  const[search,sS]=useState("");
  const filtered=sampleUsers.filter(u=>(filter==="All"||u.category===filter)&&(u.name.toLowerCase().includes(search.toLowerCase())||u.role.toLowerCase().includes(search.toLowerCase())));
  return(
    <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:14,paddingBottom:96}}>
      <input placeholder="🔍  Search professionals, roles..." value={search} onChange={e=>sS(e.target.value)}
        style={{background:C.surface,border:"1px solid "+C.border,borderRadius:12,padding:"12px 16px",color:C.text,fontSize:13,outline:"none",fontFamily:"'Syne',sans-serif"}}/>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:2}}>
        {catFilter.map(c=>(
          <button key={c} onClick={()=>sF(c)} style={{background:filter===c?C.accent:C.surface,color:filter===c?"#000":C.muted,border:`1px solid ${filter===c?C.accent:C.border}`,borderRadius:20,padding:"6px 14px",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>{c}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {filtered.map((u,i)=>(
          <GlowCard key={u.id} style={{padding:14}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:9}}>
              <Avatar initials={u.avatar} size={50} idx={i} online={u.online}/>
              <div>
                <div style={{fontWeight:700,color:C.text,fontSize:13,display:"flex",justifyContent:"center",gap:4,alignItems:"center"}}>
                  {u.name.split(" ")[0]} {u.verified&&<span style={{color:C.blue,fontSize:10}}>✓</span>}
                </div>
                <div style={{fontSize:10,color:C.muted,marginBottom:5,lineHeight:1.3}}>{u.role}</div>
                <Badge soft color={C.blue} small>{u.category}</Badge>
              </div>
              <div style={{display:"flex",gap:10,borderTop:"1px solid "+C.border,paddingTop:8,width:"100%",justifyContent:"center"}}>
                <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:C.text}}>{u.connections}</div><div style={{fontSize:9,color:C.muted,textTransform:"uppercase"}}>Conn.</div></div>
                <div style={{width:1,background:C.border}}/>
                <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:C.text}}>{u.followers}</div><div style={{fontSize:9,color:C.muted,textTransform:"uppercase"}}>Follows</div></div>
              </div>
              <ConnBtn/>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

/* ── Leads Screen ── */
function LeadsScreen(){
  const[tab,sT]=useState("opps");
  const opps=[
    {title:"Co-Founder (Tech) Needed",company:"HealthAI Startup",budget:"Equity",type:"Partnership",urgent:true,tags:["AI","HealthTech"]},
    {title:"B2B SaaS Sales Partner",company:"CloudFlow Inc.",budget:"₹50K/mo",type:"Lead Gen",urgent:false,tags:["SaaS","Sales"]},
    {title:"Content Agency for FinTech",company:"PaySecure",budget:"₹1.2L/mo",type:"Agency",urgent:true,tags:["Content","FinTech"]},
    {title:"Angel Investment – ₹50L",company:"AgroTech India",budget:"₹50L",type:"Funding",urgent:false,tags:["Startup","Seed"]},
  ];
  return(
    <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:14,paddingBottom:96}}>
      <div style={{display:"flex",background:C.surface,borderRadius:12,padding:4}}>
        {[["opps","🎯 Opportunities"],["match","🤖 AI Match"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>sT(id)} style={{flex:1,background:tab===id?C.accent:"none",color:tab===id?"#000":C.muted,border:"none",borderRadius:8,padding:"10px 0",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .15s"}}>{lbl}</button>
        ))}
      </div>
      {tab==="opps"?opps.map((o,i)=>(
        <GlowCard key={i} glow={o.urgent}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
            <div><div style={{display:"flex",gap:6,marginBottom:5}}>{o.urgent&&<Badge color={C.red} small>Urgent</Badge>}<Badge soft color={C.blue} small>{o.type}</Badge></div>
              <div style={{fontWeight:700,color:C.text,fontSize:14}}>{o.title}</div>
              <div style={{fontSize:11,color:C.muted}}>{o.company}</div>
            </div>
            <div style={{color:C.accent,fontWeight:800,fontSize:13,textAlign:"right"}}>{o.budget}</div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>{o.tags.map(t=><Badge key={t} soft color={C.accent} small>{t}</Badge>)}</div>
          <button style={{width:"100%",background:C.accent,color:"#000",border:"none",borderRadius:9,padding:"10px 0",fontSize:12,fontWeight:700,cursor:"pointer"}}>Respond Now</button>
        </GlowCard>
      )):sampleUsers.slice(0,4).map((u,i)=>(
        <GlowCard key={u.id}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <Avatar initials={u.avatar} size={46} idx={i} online={u.online}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:C.text,fontSize:13}}>{u.name}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{u.role}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{height:4,flex:1,background:C.border,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:[94,89,82,78][i]+"%",background:`linear-gradient(90deg,${C.accent},${C.green})`,borderRadius:4}}/>
                </div>
                <span style={{fontSize:11,fontWeight:800,color:C.accent}}>{[94,89,82,78][i]}%</span>
              </div>
            </div>
            <ConnBtn/>
          </div>
        </GlowCard>
      ))}
    </div>
  );
}

/* ── Events Screen ── */
function EventsScreen(){
  const evts=[
    {title:"B2B Growth Summit 2026",date:"Jun 15, 2026",location:"Mumbai",attendees:340,type:"Conference",price:"₹2,999",seats:23},
    {title:"Startup Investor Meet",date:"Jun 22, 2026",location:"Bangalore",attendees:180,type:"Meetup",price:"Free",seats:8},
    {title:"Digital Marketing Masterclass",date:"Jul 3, 2026",location:"Online",attendees:520,type:"Workshop",price:"₹999",seats:112},
    {title:"Entrepreneurs Roundtable",date:"Jul 10, 2026",location:"Delhi",attendees:90,type:"Roundtable",price:"₹1,499",seats:14},
  ];
  const tc={Conference:C.blue,Meetup:C.green,Workshop:C.accent,Roundtable:C.purple};
  return(
    <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:14,paddingBottom:96}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.text,fontSize:20}}>Upcoming Events</div>
        <button style={{background:C.accent,color:"#000",border:"none",borderRadius:9,padding:"8px 16px",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Host Event</button>
      </div>
      {evts.map((ev,i)=>(
        <GlowCard key={i}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{background:C.accentSoft,border:"1px solid "+C.accent+"44",borderRadius:12,padding:"10px 12px",textAlign:"center",flexShrink:0,minWidth:50}}>
              <div style={{color:C.accent,fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{ev.date.split(" ")[0]}</div>
              <div style={{color:C.text,fontWeight:900,fontSize:22,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{ev.date.split(" ")[1].replace(",","")}</div>
              <div style={{color:C.muted,fontSize:9}}>{ev.date.split(" ")[2]}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{marginBottom:6}}><Badge color={tc[ev.type]||C.accent}>{ev.type}</Badge></div>
              <div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:3,lineHeight:1.3}}>{ev.title}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:10}}>📍 {ev.location} · 👥 {ev.attendees} attending</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{color:C.accent,fontWeight:800,fontSize:14}}>{ev.price}</div>
                <button style={{background:C.accent,color:"#000",border:"none",borderRadius:8,padding:"8px 18px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Register</button>
              </div>
              {ev.seats<30&&<div style={{fontSize:10,color:C.red,fontWeight:700,marginTop:6}}>⚠ Only {ev.seats} seats left!</div>}
            </div>
          </div>
        </GlowCard>
      ))}
    </div>
  );
}

/* ── Profile Edit ── */
function Input({label,value,onChange,placeholder,type="text",multiline=false}){
  const base={background:"#0a0b12",border:"1px solid "+C.border,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:13,outline:"none",width:"100%",fontFamily:"'Syne',sans-serif",boxSizing:"border-box",transition:"border .2s"};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase"}}>{label}</label>}
      {multiline
        ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={4} style={{...base,resize:"vertical"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
      }
    </div>
  );
}
function TagInput({label,tags,onAdd,onRemove,placeholder}){
  const[v,sV]=useState("");
  const add=()=>{if(v.trim()&&!tags.includes(v.trim())){onAdd(v.trim());sV("");}};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {label&&<label style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase"}}>{label}</label>}
      <div style={{display:"flex",gap:8}}>
        <input value={v} onChange={e=>sV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder={placeholder}
          style={{flex:1,background:"#0a0b12",border:"1px solid "+C.border,borderRadius:10,padding:"10px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"'Syne',sans-serif"}}/>
        <button onClick={add} style={{background:C.accent,color:"#000",border:"none",borderRadius:10,padding:"0 16px",fontWeight:700,cursor:"pointer",fontSize:18}}>+</button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {tags.map(t=>(
          <div key={t} style={{background:C.accentSoft,border:"1px solid "+C.accent+"44",color:C.accent,borderRadius:8,padding:"5px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6}}>
            {t}<span onClick={()=>onRemove(t)} style={{cursor:"pointer",opacity:.6,fontSize:14}}>×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditProfileScreen({profile,onSave,onCancel}){
  const[p,sP]=useState({...profile,social:{...profile.social},skills:[...profile.skills],services:[...profile.services],experience:[...profile.experience],portfolio:[...profile.portfolio]});
  const[step,sStep]=useState(0);
  const[saved,sSaved]=useState(false);
  const fileRef=useRef();
  const set=(k,v)=>sP(prev=>({...prev,[k]:v}));
  const setSoc=(k,v)=>sP(prev=>({...prev,social:{...prev.social,[k]:v}}));
  const handlePhoto=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>set("photo",ev.target.result);r.readAsDataURL(f);};
  const addExp=()=>sP(prev=>({...prev,experience:[...prev.experience,{company:"",role:"",duration:"",desc:""}]}));
  const setExp=(i,k,v)=>sP(prev=>{const exp=[...prev.experience];exp[i]={...exp[i],[k]:v};return{...prev,experience:exp};});
  const remExp=i=>sP(prev=>({...prev,experience:prev.experience.filter((_,idx)=>idx!==i)}));
  const addPort=()=>sP(prev=>({...prev,portfolio:[...prev.portfolio,{title:"",link:"",desc:""}]}));
  const setPort=(i,k,v)=>sP(prev=>{const pt=[...prev.portfolio];pt[i]={...pt[i],[k]:v};return{...prev,portfolio:pt};});
  const remPort=i=>sP(prev=>({...prev,portfolio:prev.portfolio.filter((_,idx)=>idx!==i)}));
  const handleSave=()=>{const ini=p.name?p.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase():"?";onSave({...p,photoInitials:ini});sSaved(true);setTimeout(()=>{sSaved(false);onCancel();},900);};
  const steps=["Basic Info","Social Links","Skills & Services","Experience","Portfolio"];
  const myInitials=p.photoInitials||(p.name?p.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase():"?");
  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{background:C.surface,borderBottom:"1px solid "+C.border,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <button onClick={onCancel} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:22}}>←</button>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.text,fontSize:16}}>Edit Profile</div>
        <button onClick={handleSave} style={{background:saved?C.green:C.accent,color:"#000",border:"none",borderRadius:8,padding:"8px 20px",fontSize:12,fontWeight:800,cursor:"pointer",transition:"all .3s"}}>{saved?"✓ Saved!":"Save"}</button>
      </div>
      <div style={{display:"flex",overflowX:"auto",background:C.surface,borderBottom:"1px solid "+C.border}}>
        {steps.map((s,i)=>(
          <button key={i} onClick={()=>sStep(i)} style={{background:"none",border:"none",borderBottom:`2px solid ${step===i?C.accent:"transparent"}`,color:step===i?C.accent:C.muted,padding:"12px 16px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>{i+1}. {s}</button>
        ))}
      </div>
      <div style={{padding:"20px 18px",display:"flex",flexDirection:"column",gap:18,paddingBottom:96}}>
        {step===0&&<>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.accent,fontSize:16,marginBottom:-6}}>Basic Information</div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div onClick={()=>fileRef.current.click()} style={{cursor:"pointer",position:"relative"}}>
              <Avatar photo={p.photo} initials={myInitials} size={80} idx={0}/>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,opacity:.85}}>📷</div>
            </div>
            <div>
              <button onClick={()=>fileRef.current.click()} style={{background:C.accentSoft,color:C.accent,border:"1px solid "+C.accent+"44",borderRadius:9,padding:"9px 18px",fontSize:12,fontWeight:700,cursor:"pointer",display:"block",marginBottom:6}}>Upload Photo</button>
              <div style={{fontSize:10,color:C.muted}}>JPG, PNG · Max 5MB</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
          </div>
          <Input label="Full Name *" value={p.name} onChange={v=>set("name",v)} placeholder="e.g. Arjun Mehta"/>
          <Input label="Job Title / Role *" value={p.role} onChange={v=>set("role",v)} placeholder="e.g. Startup Founder"/>
          <Input label="Company / Business Name" value={p.company} onChange={v=>set("company",v)} placeholder="e.g. TechVentures IN"/>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase"}}>Business Category *</label>
            <select value={p.category} onChange={e=>set("category",e.target.value)} style={{background:"#0a0b12",border:"1px solid "+C.border,borderRadius:10,padding:"11px 14px",color:p.category?C.text:C.muted,fontSize:13,outline:"none",fontFamily:"'Syne',sans-serif",appearance:"none"}}>
              <option value="">Select category...</option>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Location" value={p.location} onChange={v=>set("location",v)} placeholder="e.g. Mumbai, Maharashtra"/>
          <Input label="WhatsApp Number" value={p.whatsapp} onChange={v=>set("whatsapp",v)} placeholder="+91 98765 43210" type="tel"/>
          <Input label="Website URL" value={p.website} onChange={v=>set("website",v)} placeholder="https://yourwebsite.com"/>
          <Input label="Bio / About You *" value={p.bio} onChange={v=>set("bio",v)} placeholder="Tell your professional story..." multiline/>
        </>}
        {step===1&&<>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.accent,fontSize:16,marginBottom:-6}}>Social Media Links</div>
          {SOCIAL_PLATFORMS.map(sp=>(
            <div key={sp.key} style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:38,height:38,borderRadius:10,background:sp.color+"22",border:"1px solid "+sp.color+"44",display:"flex",alignItems:"center",justifyContent:"center",color:sp.color,fontSize:14,fontWeight:900,flexShrink:0}}>{sp.icon}</div>
              <input value={p.social[sp.key]} onChange={e=>setSoc(sp.key,e.target.value)} placeholder={sp.label+" profile URL"}
                style={{flex:1,background:"#0a0b12",border:"1px solid "+C.border,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:12,outline:"none",fontFamily:"'Syne',sans-serif"}}/>
            </div>
          ))}
        </>}
        {step===2&&<>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.accent,fontSize:16,marginBottom:-6}}>Skills & Services</div>
          <TagInput label="Your Skills" tags={p.skills} onAdd={v=>set("skills",[...p.skills,v])} onRemove={v=>set("skills",p.skills.filter(s=>s!==v))} placeholder="e.g. SEO, Fundraising, React... (Enter)"/>
          <div style={{height:1,background:C.border}}/>
          <TagInput label="Services You Offer" tags={p.services} onAdd={v=>set("services",[...p.services,v])} onRemove={v=>set("services",p.services.filter(s=>s!==v))} placeholder="e.g. B2B Lead Gen, Coaching..."/>
        </>}
        {step===3&&<>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.accent,fontSize:16,marginBottom:-6}}>Work Experience</div>
          {p.experience.map((exp,i)=>(
            <GlowCard key={i} style={{position:"relative",padding:16}}>
              <button onClick={()=>remExp(i)} style={{position:"absolute",top:12,right:12,background:C.redSoft,color:C.red,border:"none",borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:15}}>×</button>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Input label="Company" value={exp.company} onChange={v=>setExp(i,"company",v)} placeholder="Company name"/>
                <Input label="Role / Title" value={exp.role} onChange={v=>setExp(i,"role",v)} placeholder="e.g. Marketing Manager"/>
                <Input label="Duration" value={exp.duration} onChange={v=>setExp(i,"duration",v)} placeholder="e.g. Jan 2022 – Dec 2024"/>
                <Input label="Description" value={exp.desc} onChange={v=>setExp(i,"desc",v)} placeholder="Key achievements..." multiline/>
              </div>
            </GlowCard>
          ))}
          <button onClick={addExp} style={{background:C.accentSoft,color:C.accent,border:"1px dashed "+C.accent+"55",borderRadius:12,padding:"14px 0",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>+ Add Experience</button>
        </>}
        {step===4&&<>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.accent,fontSize:16,marginBottom:-6}}>Portfolio</div>
          {p.portfolio.map((item,i)=>(
            <GlowCard key={i} style={{position:"relative",padding:16}}>
              <button onClick={()=>remPort(i)} style={{position:"absolute",top:12,right:12,background:C.redSoft,color:C.red,border:"none",borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:15}}>×</button>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Input label="Project Title" value={item.title} onChange={v=>setPort(i,"title",v)} placeholder="e.g. E-commerce SEO Campaign"/>
                <Input label="Link (optional)" value={item.link} onChange={v=>setPort(i,"link",v)} placeholder="https://..."/>
                <Input label="Description" value={item.desc} onChange={v=>setPort(i,"desc",v)} placeholder="What did you do? Results?" multiline/>
              </div>
            </GlowCard>
          ))}
          <button onClick={addPort} style={{background:C.accentSoft,color:C.accent,border:"1px dashed "+C.accent+"55",borderRadius:12,padding:"14px 0",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>+ Add Portfolio Item</button>
        </>}
        <div style={{display:"flex",gap:10,marginTop:4}}>
          {step>0&&<button onClick={()=>sStep(step-1)} style={{flex:1,background:C.surface,color:C.text,border:"1px solid "+C.border,borderRadius:10,padding:"13px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>← Back</button>}
          {step<steps.length-1
            ?<button onClick={()=>sStep(step+1)} style={{flex:1,background:C.accent,color:"#000",border:"none",borderRadius:10,padding:"13px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>Next →</button>
            :<button onClick={handleSave} style={{flex:1,background:saved?C.green:C.accent,color:"#000",border:"none",borderRadius:10,padding:"13px 0",fontSize:13,fontWeight:800,cursor:"pointer",transition:"all .3s"}}>{saved?"✓ Profile Saved!":"💾 Save Profile"}</button>
          }
        </div>
      </div>
    </div>
  );
}

/* ── Profile View ── */
function ProfileScreen({profile,onEdit}){
  const[tab,sT]=useState("about");
  const[qr,sQ]=useState(false);
  const isEmpty=!profile.name;
  const myInitials=ava(profile);
  const QRP=()=>{const cells=[];const sz=15;for(let r=0;r<sz;r++)for(let c=0;c<sz;c++){const isC=(r<3&&c<3)||(r<3&&c>11)||(r>11&&c<3);const iB=isC&&(r===0||r===2||c===0||c===2||(r===1&&c===1));const f=isC?iB:((r*13+c*7+42)%3===0);cells.push(<rect key={r+"-"+c} x={c*10} y={r*10} width={9} height={9} fill={f?"#c9a84c":"none"} rx={1}/>);}return<svg width={150} height={150} viewBox="0 0 150 150">{cells}</svg>;};
  if(isEmpty)return(
    <div style={{padding:40,display:"flex",flexDirection:"column",alignItems:"center",gap:20,textAlign:"center"}}>
      <div style={{fontSize:64}}>👤</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.text,fontSize:22}}>Build Your Profile</div>
      <div style={{color:C.muted,fontSize:14,lineHeight:1.6,maxWidth:280}}>Create your professional B2B profile to start networking, generate leads, and grow your business.</div>
      <button onClick={onEdit} style={{background:C.accent,color:"#000",border:"none",borderRadius:12,padding:"14px 40px",fontSize:15,fontWeight:800,cursor:"pointer"}}>🚀 Create My Profile</button>
    </div>
  );
  return(
    <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:16,paddingBottom:96}}>
      {qr&&(
        <div onClick={()=>sQ(false)} style={{position:"fixed",inset:0,background:"#000c",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:"1px solid "+C.accent,borderRadius:20,padding:32,textAlign:"center",maxWidth:260}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.accent,fontSize:18,marginBottom:16}}>Digital Business Card</div>
            <div style={{background:"#fff",borderRadius:12,padding:12,display:"inline-block",marginBottom:16}}><QRP/></div>
            <div style={{color:C.text,fontWeight:700}}>{profile.name}</div>
            <div style={{color:C.muted,fontSize:12}}>{[profile.role,profile.company].filter(Boolean).join(" · ")}</div>
            {profile.whatsapp&&<div style={{color:C.muted,fontSize:11,marginTop:4}}>💬 {profile.whatsapp}</div>}
            <div style={{marginTop:16,display:"flex",gap:10}}>
              <button style={{flex:1,background:C.accent,color:"#000",border:"none",borderRadius:8,padding:"9px 0",fontSize:12,fontWeight:700,cursor:"pointer"}}>Share</button>
              <button onClick={()=>sQ(false)} style={{flex:1,background:C.surface,color:C.muted,border:"1px solid "+C.border,borderRadius:8,padding:"9px 0",fontSize:12,cursor:"pointer"}}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div style={{position:"relative",borderRadius:18,overflow:"hidden",marginBottom:30}}>
        <div style={{height:110,background:"linear-gradient(135deg,#1a2040,#0f1822,#1a1510)"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,"+C.accent+"22,transparent 60%)"}}/>
        </div>
        <div style={{position:"absolute",bottom:-32,left:18}}><Avatar photo={profile.photo} initials={myInitials} size={68} idx={0}/></div>
        <div style={{position:"absolute",top:12,right:12,display:"flex",gap:8}}>
          <button onClick={()=>sQ(true)} style={{background:C.accentSoft,color:C.accent,border:"1px solid "+C.accent+"44",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>📱 QR</button>
          <button onClick={onEdit} style={{background:C.surface,color:C.text,border:"1px solid "+C.border,borderRadius:8,padding:"6px 12px",fontSize:11,cursor:"pointer"}}>✏️ Edit</button>
        </div>
      </div>
      <div style={{paddingTop:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:C.text,fontSize:20}}>{profile.name}</span>
          {profile.category&&<Badge soft color={C.blue}>{profile.category}</Badge>}
        </div>
        {(profile.role||profile.company)&&<div style={{color:C.muted,fontSize:13,marginBottom:4}}>{[profile.role,profile.company].filter(Boolean).join(" · ")}</div>}
        <div style={{display:"flex",flexWrap:"wrap",gap:12,fontSize:12,color:C.muted}}>
          {profile.location&&<span>📍 {profile.location}</span>}
          {profile.whatsapp&&<span>💬 {profile.whatsapp}</span>}
          {profile.website&&<a href={profile.website} target="_blank" rel="noreferrer" style={{color:C.blue,textDecoration:"none"}}>🌐 Website</a>}
        </div>
      </div>
      {Object.values(profile.social||{}).some(Boolean)&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {SOCIAL_PLATFORMS.filter(sp=>profile.social[sp.key]).map(sp=>(
            <a key={sp.key} href={profile.social[sp.key]} target="_blank" rel="noreferrer" style={{background:sp.color+"22",color:sp.color,border:"1px solid "+sp.color+"44",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,textDecoration:"none"}}>{sp.icon} {sp.label}</a>
          ))}
        </div>
      )}
      <GlowCard>
        <div style={{display:"flex",justifyContent:"space-around"}}>
          {[["Connections","382",C.blue],["Followers","1.2K",C.accent],["Views","4.2K",C.green],["Leads","38",C.purple]].map(([l,v,col])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:800,color:col,fontFamily:"'Syne',sans-serif"}}>{v}</div>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</div>
            </div>
          ))}
        </div>
      </GlowCard>
      <div style={{display:"flex",background:C.surface,borderRadius:12,padding:4,gap:2,overflowX:"auto"}}>
        {[["about","About"],["skills","Skills"],["services","Services"],["experience","Exp."],["portfolio","Portfolio"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>sT(id)} style={{flex:1,background:tab===id?C.accent:"none",color:tab===id?"#000":C.muted,border:"none",borderRadius:8,padding:"9px 0",fontSize:10,fontWeight:700,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>{lbl}</button>
        ))}
      </div>
      {tab==="about"&&<GlowCard>{profile.bio?<p style={{color:"#c5c9db",fontSize:13,lineHeight:1.7,margin:0}}>{profile.bio}</p>:<p style={{color:C.muted,fontSize:13,fontStyle:"italic"}}>No bio yet. <span onClick={onEdit} style={{color:C.accent,cursor:"pointer"}}>Add one →</span></p>}
        {profile.whatsapp&&<a href={`https://wa.me/${profile.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{display:"block",marginTop:14,textAlign:"center",background:"#25d36622",color:"#25d366",border:"1px solid #25d36644",borderRadius:8,padding:"10px 0",fontSize:12,fontWeight:700,textDecoration:"none"}}>💬 Chat on WhatsApp</a>}
      </GlowCard>}
      {tab==="skills"&&<GlowCard>{profile.skills.length>0?<div style={{display:"flex",flexWrap:"wrap",gap:8}}>{profile.skills.map(s=><div key={s} style={{background:C.accentSoft,border:"1px solid "+C.accent+"33",color:C.accent,borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600}}>{s}</div>)}</div>:<div style={{color:C.muted,fontSize:13,textAlign:"center"}}>No skills added. <span onClick={onEdit} style={{color:C.accent,cursor:"pointer"}}>Add →</span></div>}</GlowCard>}
      {tab==="services"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>{profile.services.length>0?profile.services.map(s=><GlowCard key={s} style={{padding:14}}><div style={{fontWeight:600,color:C.text,fontSize:13}}>{s}</div><div style={{color:C.muted,fontSize:11,marginTop:4}}>Available · Remote & On-site</div></GlowCard>):<GlowCard><div style={{color:C.muted,fontSize:13,textAlign:"center"}}>No services yet. <span onClick={onEdit} style={{color:C.accent,cursor:"pointer"}}>Add →</span></div></GlowCard>}</div>}
      {tab==="experience"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>{profile.experience.length>0?profile.experience.map((exp,i)=><GlowCard key={i} style={{padding:14}}><div style={{display:"flex",gap:12}}><div style={{width:40,height:40,borderRadius:10,background:C.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏢</div><div><div style={{fontWeight:700,color:C.text,fontSize:14}}>{exp.role||"Role"}</div><div style={{color:C.accent,fontSize:12,fontWeight:600}}>{exp.company}</div>{exp.duration&&<div style={{color:C.muted,fontSize:11,marginTop:2}}>🗓 {exp.duration}</div>}{exp.desc&&<p style={{color:"#c5c9db",fontSize:12,marginTop:8,lineHeight:1.6}}>{exp.desc}</p>}</div></div></GlowCard>):<GlowCard><div style={{color:C.muted,fontSize:13,textAlign:"center"}}>No experience yet. <span onClick={onEdit} style={{color:C.accent,cursor:"pointer"}}>Add →</span></div></GlowCard>}</div>}
      {tab==="portfolio"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>{profile.portfolio.length>0?profile.portfolio.map((item,i)=><GlowCard key={i} style={{padding:14}}><div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:4}}>{item.title||"Project"}</div>{item.desc&&<p style={{color:"#c5c9db",fontSize:12,lineHeight:1.6,marginBottom:8}}>{item.desc}</p>}{item.link&&<a href={item.link} target="_blank" rel="noreferrer" style={{color:C.blue,fontSize:11,textDecoration:"none"}}>🔗 View Project →</a>}</GlowCard>):<GlowCard><div style={{color:C.muted,fontSize:13,textAlign:"center"}}>No portfolio yet. <span onClick={onEdit} style={{color:C.accent,cursor:"pointer"}}>Add →</span></div></GlowCard>}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════ */
export default function App(){
  const[nav,sNav]=useState("dashboard");
  const[profile,sProfile]=useState(DEFAULT_PROFILE);
  const[editing,sEditing]=useState(false);
  const myInitials=ava(profile);

  if(editing)return(
    <div style={{fontFamily:"'Syne',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <EditProfileScreen profile={profile} onSave={p=>sProfile(p)} onCancel={()=>sEditing(false)}/>
    </div>
  );

  const screens={
    dashboard:<DashboardScreen profile={profile} onGoToProfile={()=>{sNav("profile");sEditing(true);}} onGoToLeads={()=>sNav("leads")} onGoToEvents={()=>sNav("events")} onGoToNetwork={()=>sNav("network")}/>,
    network:<NetworkScreen/>,
    leads:<LeadsScreen/>,
    events:<EventsScreen/>,
    profile:<ProfileScreen profile={profile} onEdit={()=>sEditing(true)}/>,
  };

  return(
    <div style={{fontFamily:"'Syne',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column"}}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{background:C.surface,borderBottom:"1px solid "+C.border,padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,backdropFilter:"blur(10px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,"+C.accent+",#a07830)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:C.accent,letterSpacing:"-0.02em",lineHeight:1}}>TezConnect</div>
            <div style={{fontSize:8,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase"}}>B2B Network</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button style={{background:C.surface,border:"1px solid "+C.border,borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",fontSize:16}}>
            🔔<span style={{position:"absolute",top:4,right:4,background:C.red,borderRadius:"50%",width:8,height:8,border:"1px solid "+C.bg}}/>
          </button>
          <button style={{background:C.surface,border:"1px solid "+C.border,borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16}}>💬</button>
          <div onClick={()=>sNav("profile")} style={{cursor:"pointer"}}>
            <Avatar photo={profile.photo} initials={myInitials} size={34} idx={0}/>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",paddingBottom:70}}>{screens[nav]}</div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.surface,borderTop:"1px solid "+C.border,display:"flex",zIndex:20,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>sNav(item.id)} style={{flex:1,background:"none",border:"none",padding:"11px 0 9px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,borderTop:nav===item.id?"2px solid "+C.accent:"2px solid transparent",transition:"all .15s"}}>
            <span style={{fontSize:18,opacity:nav===item.id?1:.45}}>{item.icon}</span>
            <span style={{fontSize:9,color:nav===item.id?C.accent:C.muted,fontWeight:nav===item.id?700:500,letterSpacing:"0.06em",textTransform:"uppercase"}}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
