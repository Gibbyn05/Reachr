"use client";
import Link from "next/link";
import { ArrowRight, Play, TrendingUp, Users, Bell } from "lucide-react";

export function Hero() {
  return (
    <section style={{ paddingTop: 128, paddingBottom: 96, background: "linear-gradient(180deg,#ffffff 0%,#F8F9FC 100%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* Centered headline block */}
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 72px" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0",
            color: "#15803D", fontSize: 13, fontWeight: 600,
            padding: "6px 16px", borderRadius: 999, marginBottom: 32,
          }}>
            <span style={{ width: 8, height: 8, backgroundColor: "#22C55E", borderRadius: "50%", display: "inline-block" }} />
            3 dagers gratis prøveperiode – ingen kredittkort
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(42px, 5.5vw, 64px)", fontWeight: 800,
            color: "#0F1729", lineHeight: 1.08, letterSpacing: "-2px",
            marginBottom: 24,
          }}>
            Finn leads.{" "}
            <span style={{ color: "#22C55E" }}>Ta kontakt.</span>
            <br />Lukk avtaler.
          </h1>

          {/* Subtext */}
          <p style={{ fontSize: 19, color: "#6B7280", lineHeight: 1.65, maxWidth: 560, margin: "0 auto 40px" }}>
            Reachr er det norske B2B-verktøyet som hjelper deg finne nye kunder,
            følge opp leads og lukke avtaler – alt på ett sted.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/register" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              backgroundColor: "#22C55E", color: "white",
              fontWeight: 700, fontSize: 15, textDecoration: "none",
              padding: "14px 28px", borderRadius: 12,
              boxShadow: "0 4px 16px rgba(34,197,94,0.35)",
            }}>
              Start gratis i dag <ArrowRight size={18} />
            </Link>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", color: "#374151", fontWeight: 600, fontSize: 15 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%", backgroundColor: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Play size={14} color="#22C55E" fill="#22C55E" style={{ marginLeft: 2 }} />
              </div>
              Se demo
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 28 }}>
            Brukt av <strong style={{ color: "#6B7280" }}>500+ norske bedrifter</strong>
          </p>
        </div>

        {/* App mockup */}
        <div style={{ position: "relative", maxWidth: 960, margin: "0 auto", paddingLeft: 40, paddingRight: 40 }}>

          {/* Glow behind */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: 800, height: 400,
            background: "radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Browser window */}
          <div className="animate-float" style={{
            position: "relative", backgroundColor: "#0F1729", borderRadius: 16,
            boxShadow: "0 40px 100px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden",
          }}>
            {/* Title bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 18px", backgroundColor: "#1A2540",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#EF4444","#F59E0B","#22C55E"].map(c => (
                  <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: c, opacity: 0.7 }} />
                ))}
              </div>
              <div style={{
                flex: 1, margin: "0 14px", backgroundColor: "rgba(255,255,255,0.07)",
                borderRadius: 6, padding: "4px 14px",
                fontSize: 11, color: "rgba(255,255,255,0.35)",
              }}>app.reachr.no/leadsok</div>
            </div>

            {/* Body */}
            <div style={{ display: "flex", height: 340 }}>
              {/* Sidebar */}
              <div style={{
                width: 172, backgroundColor: "#0F1729",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                padding: 16, flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 24, height: 24, backgroundColor: "#22C55E", borderRadius: 6 }} />
                  <span style={{ color: "white", fontWeight: 800, fontSize: 13 }}>Reachr</span>
                </div>
                {[["Dashboard",false],["Leadsøk",true],["Mine Leads",false],["Varsler",false],["Innstillinger",false]].map(([l,a]) => (
                  <div key={String(l)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px", borderRadius: 8, marginBottom: 3,
                    backgroundColor: a ? "rgba(255,255,255,0.11)" : "transparent",
                    color: a ? "white" : "rgba(255,255,255,0.42)",
                    fontSize: 12, fontWeight: a ? 600 : 400,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: a ? "#4ADE80" : "rgba(255,255,255,0.18)", flexShrink: 0 }} />
                    {l}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div style={{ flex: 1, backgroundColor: "#F8F9FC", padding: 18, overflow: "hidden" }}>
                {/* Search row */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  {[0,1].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 36, backgroundColor: "white",
                      border: "1px solid #E5E7EB", borderRadius: 8,
                      display: "flex", alignItems: "center", padding: "0 10px", gap: 7,
                    }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#D1D5DB", flexShrink: 0 }} />
                      <div style={{ height: 6, width: "55%", backgroundColor: "#E9ECF0", borderRadius: 3 }} />
                    </div>
                  ))}
                  <div style={{ height: 36, padding: "0 16px", backgroundColor: "#22C55E", borderRadius: 8, display: "flex", alignItems: "center" }}>
                    <div style={{ height: 6, width: 34, backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 3 }} />
                  </div>
                </div>

                {/* Table */}
                <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden" }}>
                  <div style={{ display: "flex", gap: 10, padding: "8px 14px", backgroundColor: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
                    {[100,80,70,60,64].map((w,i) => (
                      <div key={i} style={{ flex: i===4 ? "0 0 64px" : 1, height: 6, backgroundColor: "#E5E7EB", borderRadius: 3 }} />
                    ))}
                  </div>
                  {[85,72,90,78].map((w,i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 14px", borderBottom: i<3 ? "1px solid #F9FAFB" : "none",
                    }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: "#F1F5F9", flexShrink: 0 }} />
                        <div style={{ height: 6, width: w, backgroundColor: "#1A2540", borderRadius: 3, opacity: 0.6 }} />
                      </div>
                      <div style={{ flex: 1 }}><div style={{ height: 6, width: 58, backgroundColor: "#D1D5DB", borderRadius: 3 }} /></div>
                      <div style={{ flex: 1 }}><div style={{ height: 16, width: 56, backgroundColor: "#F1F5F9", borderRadius: 5 }} /></div>
                      <div style={{ flex: 1 }}><div style={{ height: 6, width: 48, backgroundColor: "#BBF7D0", borderRadius: 3 }} /></div>
                      <div style={{ flexBasis: 64, flexShrink: 0 }}>
                        <div style={{ height: 26, backgroundColor: "#22C55E", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ height: 5, width: 36, backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 3 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating card left */}
          <div style={{
            position: "absolute", left: -16, top: 56,
            backgroundColor: "white", borderRadius: 14,
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #F3F4F6",
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 38, height: 38, backgroundColor: "#EFF6FF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={18} color="#3B82F6" />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Nye leads i dag</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: "#0F1729", margin: 0 }}>+24</p>
            </div>
          </div>

          {/* Floating card right top */}
          <div style={{
            position: "absolute", right: -16, top: 80,
            backgroundColor: "white", borderRadius: 14,
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #F3F4F6",
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 38, height: 38, backgroundColor: "#F0FDF4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={18} color="#22C55E" />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Bookede møter</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#0F1729", margin: 0 }}>7 denne uka</p>
            </div>
          </div>

          {/* Floating card right bottom */}
          <div style={{
            position: "absolute", right: -8, bottom: 48,
            backgroundColor: "white", borderRadius: 14,
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #F3F4F6",
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 38, height: 38, backgroundColor: "#FFFBEB", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={18} color="#F59E0B" />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Varsler venter</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#0F1729", margin: 0 }}>3 oppfølginger</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
