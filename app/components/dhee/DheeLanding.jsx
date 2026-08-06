"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* Adapted from the standalone Vite build of the Dhee Slicer site.
   Removed on integration:
     - the hash router (read `window` during render -> broke SSR); the two
       hashes are now real routes, /dhee-slicer and /dhee-slicer/guide
     - CustomCursor and its global `cursor: none` rules; the host already
       mounts CoordinateCursor in app/layout.tsx
     - the app's own <Nav> and <Footer>; the host chrome wraps the page
     - the global CSS reset, html/body/scrollbar rules and the Google Fonts
       @import; Libre Franklin already loads via next/font
   Everything that remains is scoped under [data-dhee]. */

/* ─── FADE-IN HOOK ───────────────────────────────────── */
function useFadeIn(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Fade({ children, delay = 0, style = {} }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(22px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── HERO ───────────────────────────────────────────── */
function Hero() {
  return (
    <section id="platform" style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    }}>
      <video autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}>
        <source src="/dhee/dheeapp.mp4" type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(10,4,26,0.72) 0%, rgba(60,20,120,0.45) 50%, rgba(10,4,26,0.30) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03)1px,transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, padding: "120px 5vw 80px", width: "100%" }}>
        <Fade delay={0}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderRadius: 20, padding: "44px 52px 48px", maxWidth: 560, boxShadow: "0 8px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,180,255,0.85)", fontWeight: 500, marginBottom: 24 }}>
              Designed for precision bioprinting
            </div>
            <h1 style={{ fontSize: "clamp(52px,6vw,84px)", fontWeight: 700, lineHeight: 0.93, letterSpacing: "-0.04em", color: "#FFFFFF", marginBottom: 16 }}>
              DHEE<br />
              <span style={{ color: "#C4B8FF" }}>Slicer</span>
            </h1>
            <p style={{ fontSize: "clamp(15px,1.4vw,18px)", color: "rgba(220,210,255,0.82)", lineHeight: 1.55, maxWidth: 400, marginBottom: 20, fontWeight: 400, letterSpacing: "-0.01em" }}>
              Your bioprinting companion re-imagined<br />by Next Big Innovation Labs
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 32, padding: "7px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(196,184,255,0.22)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="10" cy="10" r="8.25" stroke="rgba(196,184,255,0.55)" strokeWidth="1.3" />
                <path d="M6.4 10.3l2.4 2.4 4.8-5.1" stroke="#C4B8FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: "0.02em", color: "rgba(220,210,255,0.9)" }}>Built in-house, from scratch</span>
            </div>
            {/* The standalone build carried "Request Demo" and "Guide" in its
                own fixed nav. That nav is gone (the site's NavBar wraps this
                page now), so both live here instead. */}
            <div style={{ marginBottom: 36, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => window.open("https://dhee-slicer-daca07d87663.herokuapp.com", "_blank", "noopener,noreferrer")}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: "pointer", letterSpacing: "-0.01em", background: "#6D28D9", color: "#fff", border: "1.5px solid #6D28D9", boxShadow: "0 2px 12px rgba(109,40,217,0.28)", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#5B21B6"; e.currentTarget.style.borderColor = "#5B21B6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#6D28D9"; e.currentTarget.style.borderColor = "#6D28D9"; }}
              >
                Request Demo →
              </button>
              <button
                onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: "pointer", letterSpacing: "-0.01em", background: "rgba(255,255,255,0.12)", color: "#FFFFFF", border: "1.5px solid rgba(255,255,255,0.28)", backdropFilter: "blur(8px)", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
              >
                Explore Features ↓
              </button>
              <Link
                href="/dhee-slicer/guide"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 4px", fontSize: 13, fontWeight: 500, color: "rgba(220,210,255,0.85)", textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(220,210,255,0.85)"; }}
              >
                Quick-Start Guide →
              </Link>
            </div>
            <div style={{ display: "flex", gap: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              {[["Windows 10+", "OS Support"], ["6 Extruders", "Max Channels"], ["96-Well", "Plate Support"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em" }}>{v}</div>
                  <div style={{ fontSize: 10, color: "rgba(200,185,255,0.7)", marginTop: 3, letterSpacing: "0.03em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ─── THE PROBLEM ────────────────────────────────────── */
function Problem() {
  return (
    <section style={{ background: "#FFFFFF", borderTop: "1px solid #EEE9FF" }}>
      <div style={{ padding: "72px 5vw", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10vw", alignItems: "center" }}>
        <Fade>
          <div>
            <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6D5A8E", fontWeight: 500, marginBottom: 16 }}>The Problem</div>
            <h2 style={{ fontSize: "clamp(26px,2.8vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#110820", marginBottom: 16 }}>
              A single print can require three separate applications.
            </h2>
            <p style={{ fontSize: 15, color: "#6D5A8E", lineHeight: 1.85, marginBottom: 12 }}>
              Model preparation. Slicing. Machine control. Every handoff between tools introduces friction, inconsistency, and lost time.
            </p>
            <p style={{ fontSize: 15, color: "#6D28D9", fontWeight: 600, lineHeight: 1.75 }}>
              DHEE Slicer replaces all three.
            </p>
          </div>
        </Fade>
        <Fade delay={0.08}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {["Import", "Prepare", "Slice", "Visualize", "Print"].map((step, i, arr) => (
              <div key={step}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(109,40,217,0.07)", border: "1px solid rgba(109,40,217,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#6D28D9", fontFamily: "'DM Mono',monospace" }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "#110820", letterSpacing: "-0.01em", padding: "10px 0" }}>{step}</span>
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, height: 20, background: "linear-gradient(#D8D0F5,transparent)", marginLeft: 17 }} />}
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ─── WORKFLOW MOCKS ─────────────────────────────────── */
function MockModelPrepHTML() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#F8F7FF" }}>
      <video autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "110%", height: "100%", objectFit: "cover", objectPosition: "center" }}>
        <source src="/dhee/clip-plane.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function MockSlicingHTML() {
  const [prog, setProg] = useState(63);
  useEffect(() => {
    const t = setInterval(() => setProg(p => p >= 100 ? 18 : p + 0.8), 80);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ width: "100%", height: "100%", background: "#F8F7FF", fontFamily: "'DM Mono',monospace", overflow: "hidden" }}>
      <div style={{ height: 34, background: "#EEE9FF", borderBottom: "1px solid #D8D0F5", display: "flex", alignItems: "center", gap: 6, padding: "0 14px" }}>
        {["#FF5F57", "#FFBD2E", "#28CA41"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
        <span style={{ fontSize: 9, color: "#9B8DC4", marginLeft: 10 }}>Slice Configuration</span>
      </div>
      <div style={{ display: "flex", height: "calc(100% - 34px)" }}>
        <div style={{ width: 160, background: "#F0ECFF", borderRight: "1px solid #D8D0F5", padding: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.08em", color: "#B8ACD8", marginBottom: 7, marginTop: 10 }}>Parameters</div>
          {[["Layer Height", "0.15 mm", true], ["Infill", "Honeycomb", false], ["Extruder 0", "180°C", true], ["Support", "Tree", false]].map(([l, v, hi]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 8.5, color: "#9B8DC4" }}>{l}</span>
              <span style={{ fontSize: 9, color: hi ? "#6D28D9" : "#A89CC8" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 12, overflow: "hidden" }}>
          <div style={{ fontSize: 8.5, color: "#9B8DC4", marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
            <span>Progress</span><span style={{ color: "#6D28D9" }}>{Math.round(prog)}%</span>
          </div>
          <div style={{ height: 3, background: "#DDD5F5", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
            <div style={{ width: `${prog}%`, height: "100%", background: "linear-gradient(90deg,#6D28D9,#8B5CF6)", borderRadius: 2, transition: "width 0.08s linear" }} />
          </div>
          <div style={{ background: "#F0ECFF", border: "1px solid #D8D0F5", borderRadius: 6, padding: 8, marginBottom: 10 }}>
            <div style={{ fontSize: 8, color: "#9B8DC4", marginBottom: 5 }}>Console</div>
            <div style={{ fontSize: 8.5, color: "#A89CC8", marginBottom: 2.5 }}>; Layer 47 / 120</div>
            <div style={{ fontSize: 8.5, color: "#A89CC8", marginBottom: 2.5 }}>G0 X23.4 Y18.2 Z7.05</div>
            <div style={{ fontSize: 8.5, color: "#6D28D9", marginBottom: 2.5 }}>; Slicing {Math.round(prog)}% complete</div>
            <div style={{ fontSize: 8.5, color: "#A89CC8" }}>T0 ; extruder 0 active</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[["120", "Layers"], ["2h 14m", "Est."], ["4.2 m", "Filament"]].map(([v, l]) => (
              <div key={l} style={{ background: "#F0ECFF", border: "1px solid #D8D0F5", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 14, color: "#3B0764", fontWeight: 600 }}>{v}</div>
                <div style={{ fontSize: 8, color: "#9B8DC4", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockGCodeHTML() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#F8F7FF" }}>
      <video autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "110%", height: "100%", objectFit: "cover", objectPosition: "center" }}>
        <source src="/dhee/gcode-vis.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function MockMachineHTML() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#F8F7FF" }}>
      <img src="/dhee/machine.png" alt="G-Code Visualization" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
    </div>
  );
}

const WORKFLOW_STEPS = [
  { id: "01", title: "Model Preparation", body: "Import multiple STL files via drag-and-drop and place them on any substrate: petri dish, well plate, glass slide, or flat bed. Rotate freely across all three axes, cut STLs at any desired plane to split models into multiple parts, and auto-center individual models or all objects at once. Paint directly onto the STL surface to define custom support regions with per-voxel control. Every action is fully reversible with a complete undo stack.", tags: ["3-Axis Rotation","Planar Cut","Multi-Part Split","Auto-Center All","Surface Paint for Custom Supports","96-Well / Petri / Slide"], Mock: MockModelPrepHTML },
  { id: "02", title: "Intelligent Slicing", body: "Configure variable layer heights per Z-range: each zone can run a different extruder, nozzle temperature, and infill pattern independently. Map up to six extruder channels with per-channel temperature profiles, so a single print can transition from a dense hydrogel shell to a porous scaffold core without manual intervention. Seven infill strategies including grid, honeycomb, concentric, gyroid, and triangular — mix and match across Z-zones in one file. Parallel slicing via Mandoline keeps processing fast even on complex multi-body geometries, with full support generation and adhesion control baked in.", tags: ["7 Infill Patterns","Variable Heights","Per-Zone Extruder Control","Per-Zone Temperature","Per-Zone Infill Control"], Mock: MockSlicingHTML },
  { id: "03", title: "G-Code Visualization", body: "Inspect every layer in complete detail before a single drop of material is extruded. Full view for a complete top-down overview of the entire print. Scrub forward and backward through extrusion moves, travel moves, and retractions independently, with variable speed playback so fast sections can be slowed down for scrutiny. Color-coded move types distinguish perimeters, infill, supports, and travel in a single glance. Export any layer or the full visualization as a PDF for lab records, peer review, or regulatory documentation.", tags: ["Single Layer View","Full Print View","Scrub Forward & Back","Color-Coded Moves"], Mock: MockGCodeHTML },
  { id: "04", title: "Machine Control", body: "Take direct command of your bioprinter over a USB-to-serial connection. Monitor all six extruder channels and the heated bed in real time, with live temperature graphs. Auxiliary output switching lets toggle UV sources, and cooling fans directly from the interface. Servo management handles any attached rotary or linear actuators without leaving the application. Start, pause, resume, and abort print jobs with full G-code streaming.", tags: ["Serial Control","Aux Output Toggle","Servo Control","Temp Monitor","Pause & Resume"], Mock: MockMachineHTML },
];

/* ─── TAG CHIP WITH HOVER POPUP ─────────────────────── */
const TAG_META = {
  "3-Axis Rotation": { info: "Rotate models freely around X, Y, and Z axes with precision input or interactive handles.", media: "/dhee/3axis.png", mediaType: "image" },
  "Planar Cut": { info: "Slice any STL at an arbitrary plane angle to split it into multiple printable parts.", media: "/dhee/planar.png", mediaType: "image" },
  "Multi-Part Split": { info: "A single cut operation produces two independent mesh objects, each separately positionable.", media: "/dhee/multi.png", mediaType: "image" },
  "Auto-Center All": { info: "Instantly center every loaded model on the substrate with one click.", media: "/dhee/auto.png", mediaType: "image" },
  "Surface Paint for Custom Supports": { info: "Paint directly onto the STL surface to mark regions where custom supports should generate.", media: "/dhee/paint.png", mediaType: "image" },
  "96-Well / Petri / Slide": { info: "Choose from built-in substrate presets — 96-well plate, petri dish, glass slide, or flat bed.", media: "/dhee/plat96.png", mediaType: "image" },
  "7 Infill Patterns": { info: "Grid, honeycomb, concentric, gyroid, triangular, line, and rectilinear — per zone.", media: "/dhee/pattern.png", mediaType: "image" },
  "Variable Heights": { info: "Define different layer heights for different Z-ranges within a single print job.", media: "/dhee/variable-layer.png", mediaType: "image" },
  "Per-Zone Extruder Control": { info: "Assign a specific extruder channel to each Z-range — mix materials in one continuous print.", media: "/dhee/tempzone.png", mediaType: "image" },
  "Per-Zone Temperature": { info: "Each Z-zone can run at a different nozzle temperature to match the material being extruded.", media: "/dhee/tempzonecontrol.png", mediaType: "image" },
  "Per-Zone Infill Control": { info: "Apply a different infill pattern and density to each Z-range without splitting the file.", media: "/dhee/perzoneinfill.png", mediaType: "image" },
  "Single Layer View": { info: "Isolate any single cross-section to verify infill, perimeters and supports.", media: "/dhee/singlelayer.png", mediaType: "image" },
  "Full Print View": { info: "Complete top-down overview of all paths across the entire print.", media: "/dhee/fullprint.png", mediaType: "image" },
  "Scrub Forward & Back": { info: "Drag the playhead to any point in the toolpath — forward or backward.", media: "/dhee/scrub.png", mediaType: "image" },
  "Color-Coded Moves": { info: "Perimeters, infill, supports, and travel moves each render in a distinct color.", media: "/dhee/colorcoded.png", mediaType: "image" },
  "Serial Control": { info: "Direct USB-to-serial connection to your bioprinter and option for manual control of the printer via serial commands", media: "/dhee/serialcon.png", mediaType: "image" },
  "Aux Output Toggle": { info: "Toggle HEPA, UV light sources, cooling fans, and other auxiliary outputs directly from the control panel.", media: "/dhee/auxil.png", mediaType: "image" },
  "Servo Control": { info: "Control attached rotary and linear servo actuators without leaving the application.", media: "/dhee/servo.png", mediaType: "image" },
  "Temp Monitor": { info: "Real-time per-extruder and bed temperature monitoring with live progress bars.", media: "/dhee/tempo.png", mediaType: "image" },
  "Pause & Resume": { info: "Pause mid-print for material swaps or inspection, then resume from exactly the same position.", media: "/dhee/startplay.png", mediaType: "image" },
};

function TagChip({ label }) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ top: true, left: true });
  const ref = useRef(null);
  const meta = TAG_META[label] || { info: label, media: null, mediaType: null };

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.top > 220, left: rect.left < window.innerWidth / 2 });
    }
    setHovered(true);
  };

  return (
    <span ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={() => setHovered(false)} style={{ position: "relative", display: "inline-block" }}>
      <span style={{ display: "inline-block", fontSize: 11, fontFamily: "'DM Mono', monospace", color: hovered ? "#5B21B6" : "#6D28D9", background: hovered ? "rgba(109,40,217,0.13)" : "rgba(109,40,217,0.07)", border: `1px solid ${hovered ? "rgba(109,40,217,0.4)" : "rgba(109,40,217,0.18)"}`, borderRadius: 4, padding: "2px 8px", letterSpacing: "0.02em", whiteSpace: "nowrap", cursor: "default", transition: "all 0.15s", transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? "0 4px 12px rgba(109,40,217,0.15)" : "none" }}>
        {label}
      </span>
      {hovered && (
        <div style={{ position: "absolute", zIndex: 999, ...(pos.top ? { bottom: "calc(100% + 10px)" } : { top: "calc(100% + 10px)" }), ...(pos.left ? { left: 0 } : { right: 0 }), width: 600, background: "#FFFFFF", border: "1px solid #EEE9FF", borderRadius: 14, boxShadow: "0 16px 48px rgba(109,40,217,0.16), 0 4px 12px rgba(0,0,0,0.08)", overflow: "hidden", pointerEvents: "none", animation: "tagPopIn 0.18s cubic-bezier(0.23,1,0.32,1)" }}>
          <div style={{ width: "100%", height: 338, background: "linear-gradient(135deg, #EEE9FF 0%, #F0ECFF 100%)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #EEE9FF", overflow: "hidden" }}>
            {meta.mediaType === "video" && meta.media ? (
              <video autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}><source src={meta.media} type="video/mp4" /></video>
            ) : meta.mediaType === "image" && meta.media ? (
              <img src={meta.media} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(109,40,217,0.1)", border: "1px dashed rgba(109,40,217,0.3)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 16 16" width="18" height="18" fill="none"><rect x="1" y="1" width="14" height="14" rx="2" stroke="rgba(109,40,217,0.4)" strokeWidth="1.2" strokeDasharray="2 2" /><circle cx="5.5" cy="5.5" r="1.5" fill="rgba(109,40,217,0.3)" /><path d="M1 11l4-3 3 2.5 3-4 4 4.5" stroke="rgba(109,40,217,0.4)" strokeWidth="1" fill="none" /></svg>
                </div>
                <span style={{ fontSize: 9, color: "#B8ACD8", fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em" }}>MEDIA PLACEHOLDER</span>
              </div>
            )}
          </div>
          <div style={{ padding: "14px 16px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#110820", marginBottom: 6, letterSpacing: "-0.01em" }}>{label}</div>
            <div style={{ fontSize: 12.5, color: "#6D5A8E", lineHeight: 1.65 }}>{meta.info}</div>
          </div>
        </div>
      )}
      <style>{`@keyframes tagPopIn { from { opacity: 0; transform: translateY(6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </span>
  );
}

/* ─── WORKFLOW ───────────────────────────────────────── */
function Workflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const stepRefs = useRef([]);

  /* Detect mobile */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Desktop: scroll-driven active step */
  useEffect(() => {
    if (isMobile) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveStep(parseInt(e.target.dataset.step)); });
    }, { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" });
    stepRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [isMobile]);

  const goTo = (i) => setActiveStep(Math.max(0, Math.min(WORKFLOW_STEPS.length - 1, i)));

  /* Shared preview panel markup */
  const PreviewPanel = ({ height = 420 }) => (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: -1, background: "linear-gradient(135deg,rgba(109,40,217,0.16),rgba(139,92,246,0.09))", borderRadius: 13, filter: "blur(14px)", opacity: 0.5 }} />
      <div style={{ position: "relative", border: "1px solid #D8D0F5", borderRadius: 12, overflow: "hidden", height, boxShadow: "0 16px 48px rgba(109,40,217,0.1)" }}>
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={step.id} style={{ position: i === 0 ? "relative" : "absolute", inset: 0, width: "100%", height: "100%", opacity: activeStep === i ? 1 : 0, transform: activeStep === i ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.35s, transform 0.35s", pointerEvents: activeStep === i ? "auto" : "none", zIndex: activeStep === i ? 1 : 0 }}>
            <step.Mock />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="workflow" style={{ borderTop: "1px solid #EEE9FF", background: "#F8F7FF" }}>
      <div style={{ padding: "60px 5vw 36px" }}>
        <Fade>
          <h2 style={{ fontSize: "clamp(26px,3.2vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#110820" }}>From mesh to material.</h2>
        </Fade>
      </div>

      {/* ══ MOBILE LAYOUT: carousel on top, steps listed below ══ */}
      {isMobile && (
        <div style={{ padding: "0 5vw 56px" }}>
          {/* Preview carousel */}
          <div style={{ marginBottom: 20 }}>
            <PreviewPanel height={240} />

            {/* Prev / Next arrows + dots */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, gap: 12 }}>
              <button
                onClick={() => goTo(activeStep - 1)}
                disabled={activeStep === 0}
                style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #D8D0F5", background: activeStep === 0 ? "#F0ECFF" : "#FFFFFF", color: activeStep === 0 ? "#C4B8E8" : "#6D28D9", display: "flex", alignItems: "center", justifyContent: "center", cursor: activeStep === 0 ? "default" : "pointer", transition: "all 0.15s", flexShrink: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              {/* Dots */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "center" }}>
                {WORKFLOW_STEPS.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{ border: "none", padding: 0, cursor: "pointer", background: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
                  >
                    <div style={{ width: activeStep === i ? 28 : 8, height: 8, borderRadius: 999, background: activeStep === i ? "#6D28D9" : "#DDD5F5", transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)" }} />
                    {activeStep === i && (
                      <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", color: "#6D28D9", letterSpacing: "0.06em", lineHeight: 1 }}>
                        {step.id}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goTo(activeStep + 1)}
                disabled={activeStep === WORKFLOW_STEPS.length - 1}
                style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #D8D0F5", background: activeStep === WORKFLOW_STEPS.length - 1 ? "#F0ECFF" : "#FFFFFF", color: activeStep === WORKFLOW_STEPS.length - 1 ? "#C4B8E8" : "#6D28D9", display: "flex", alignItems: "center", justifyContent: "center", cursor: activeStep === WORKFLOW_STEPS.length - 1 ? "default" : "pointer", transition: "all 0.15s", flexShrink: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {/* Active step text */}
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={step.id} style={{ display: activeStep === i ? "block" : "none", paddingTop: 24, borderTop: "1px solid #EEE9FF" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: "#6D5A8E", fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em", paddingTop: 3, flexShrink: 0 }}>{step.id}</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "#110820" }}>{step.title}</h3>
              </div>
              <p style={{ fontSize: 14.5, color: "#6D5A8E", lineHeight: 1.85, marginBottom: 18 }}>{step.body}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {step.tags.map(t => <TagChip key={t} label={t} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ DESKTOP LAYOUT: scroll-driven sticky panel ══ */}
      {!isMobile && (
        <div className="workflow-outer" style={{ display: "flex", padding: "0 5vw", gap: "6vw", alignItems: "stretch", paddingBottom: 80 }}>
          {/* Text column */}
          <div className="workflow-text-col" style={{ flex: "1 1 0", minWidth: 0 }}>
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step.id} ref={el => stepRefs.current[i] = el} data-step={i}
                style={{ minHeight: "58vh", padding: "48px 0", borderBottom: i < WORKFLOW_STEPS.length - 1 ? "1px solid #EEE9FF" : "none" }}>
                <Fade delay={0.05}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 11, color: "#6D5A8E", fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em", paddingTop: 4, flexShrink: 0 }}>{step.id}</span>
                    <div>
                      <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "#110820", marginBottom: 14 }}>{step.title}</h3>
                      <p style={{ fontSize: 15, color: "#6D5A8E", lineHeight: 1.85, marginBottom: 20 }}>{step.body}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {step.tags.map(t => <TagChip key={t} label={t} />)}
                      </div>
                    </div>
                  </div>
                </Fade>
              </div>
            ))}
          </div>
          {/* Sticky preview column */}
          <div className="workflow-sticky-col" style={{ flex: "1 1 0", minWidth: 0, position: "relative" }}>
            <div className="workflow-sticky-inner" style={{ position: "sticky", top: "calc(50vh - 230px)", paddingBottom: 60 }}>
              <PreviewPanel height={420} />
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
                {WORKFLOW_STEPS.map((_, i) => (
                  <div key={i} className="s-dot" onClick={() => stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: activeStep === i ? "#6D28D9" : "#DDD5F5", transform: activeStep === i ? "scale(1.5)" : "none", cursor: "pointer", transition: "background 0.2s, transform 0.2s" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── CAPABILITIES MOCKS ─────────────────────────────── */
function CapMock96Well() {
  return <img src="/dhee/wellear.png" alt="96-Well Plate" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
}

function CapMockVarLayers() {
  return <img src="/dhee/variable-layers.png" alt="Variable Layers" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
}

function CapMockGCode() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <video autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}>
        <source src="/dhee/gcode.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function CapRow({ number, label, headline, body, reversed, MockComponent }) {
  const [ref, visible] = useFadeIn(0.08);
  const [cardHovered, setCardHovered] = useState(false);

  /* On mobile we always show: text first, then image below.
     On desktop: reversed prop controls left/right order as before. */
  return (
    <div
      ref={ref}
      className="cap-row-grid"
      style={{
        display: "grid",
        gridTemplateColumns: reversed ? "1fr 1.05fr" : "1.05fr 1fr",
        gap: "6vw",
        alignItems: "center",
        padding: "68px 5vw",
        borderBottom: "1px solid #EEE9FF",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(28px)",
        transition: "opacity 0.7s, transform 0.7s",
      }}
    >
      {/* On desktop-reversed: image comes first (left). On mobile: CSS forces text first via order */}
      {reversed && (
        <div
          className="cap-card"
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          style={{ border: "1px solid #D8D0F5", borderRadius: 12, overflow: "hidden", height: 380, transform: cardHovered ? "scale(1.03) translateY(-6px)" : "scale(1) translateY(0)", boxShadow: cardHovered ? "0 32px 72px rgba(109,40,217,0.22), 0 8px 24px rgba(0,0,0,0.1)" : "0 12px 40px rgba(109,40,217,0.08)", transition: "transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.55s cubic-bezier(0.23,1,0.32,1)" }}
        >
          <MockComponent />
        </div>
      )}

      <div className="cap-text">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: "#6D5A8E", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em" }}>{number}</span>
          <div style={{ height: 1, width: 28, background: "#D8D0F5" }} />
          <span style={{ fontSize: 11, color: "#6D5A8E", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
        </div>
        <h3 style={{ fontSize: "clamp(22px,2.5vw,36px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#110820", marginBottom: 16 }}>{headline}</h3>
        <p style={{ fontSize: 15, color: "#6D5A8E", lineHeight: 1.85, maxWidth: 440 }}>{body}</p>
      </div>

      {!reversed && (
        <div
          className="cap-card"
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          style={{ border: "1px solid #D8D0F5", borderRadius: 12, overflow: "hidden", height: 380, transform: cardHovered ? "scale(1.03) translateY(-6px)" : "scale(1) translateY(0)", boxShadow: cardHovered ? "0 32px 72px rgba(109,40,217,0.22), 0 8px 24px rgba(0,0,0,0.1)" : "0 12px 40px rgba(109,40,217,0.08)", transition: "transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.55s cubic-bezier(0.23,1,0.32,1)" }}
        >
          <MockComponent />
        </div>
      )}
    </div>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" style={{ borderTop: "1px solid #EEE9FF", background: "#FFFFFF" }}>
      <div style={{ padding: "60px 5vw 32px" }}>
        <Fade><h2 style={{ fontSize: "clamp(26px,3.2vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#110820" }}>Why labs choose DHEE.</h2></Fade>
      </div>
      <CapRow number="01" label="96-Well Plate Support" headline="High-throughput placement, precisely mapped." body="12-, 24-, and 96-well presets with coordinate-mapped placement and per-well auto-scaling. Run multiple scaffold geometries across a single plate without repositioning by hand." reversed={false} MockComponent={CapMock96Well} />
      <CapRow number="02" label="Variable Layer Heights" headline="Different geometry, different parameters — same print." body="Define multiple parameter zones within a single print. Dense outer shells, lighter infill cores, gradated support structures — all controlled per Z-range without splitting the file." reversed={true} MockComponent={CapMockVarLayers} />
      <CapRow number="03" label="Layer Validation" headline="Verify every path before it touches material." body="Inspect every layer in four playback modes before committing to hardware. Line-by-line, layer range, single layer, or full view — with speed control and PDF export for lab records." reversed={false} MockComponent={CapMockGCode} />

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid #EEE9FF" }}>
        {[
          { n: "6", label: "Extruder Channels", sub: "E0–E5 independent control" },
          { n: "96", label: "Well Plate Support", sub: "12 / 24 / 96-well presets" },
          { n: "7", label: "Infill Strategies", sub: "Grid, honeycomb, concentric & more" },
          { n: "10d", label: "Offline Cache", sub: "PBKDF2-encrypted local auth" },
        ].map((item, i) => (
          <Fade key={item.label} delay={i * 0.07}>
            <div className="number-cell" style={{ padding: "44px 5vw", borderRight: i < 3 ? "1px solid #EEE9FF" : "none", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#F8F7FF"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ fontSize: "clamp(48px,5vw,66px)", fontWeight: 700, letterSpacing: "-0.04em", color: "#6D28D9", lineHeight: 1, marginBottom: 8 }}>{item.n}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#110820", letterSpacing: "-0.01em", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 11.5, color: "#6D5A8E", lineHeight: 1.5 }}>{item.sub}</div>
            </div>
          </Fade>
        ))}
      </div>
    </section>
  );
}

/* ─── SPECS ──────────────────────────────────────────── */
const SPECS = [
  ["Operating System", "Windows 10 or later (64-bit)"],
  ["Processor", "Intel Core i5 or higher"],
  ["Memory", "16 GB RAM minimum"],
  ["Display", "1920 × 1080 recommended"],
  ["Internet", "Required for initial login only"],
  ["Serial Port", "USB-to-Serial adapter supported"],
];

function Specs() {
  return (
    <section id="specs" style={{ padding: "72px 5vw", borderTop: "1px solid #EEE9FF", background: "#FFFFFF" }}>
      <div className="specs-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "10vw" }}>
        <Fade>
          <div>
            <h2 style={{ fontSize: "clamp(22px,2.2vw,34px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#110820", marginBottom: 14 }}>Engineered for performance.</h2>
            <p style={{ fontSize: 15, color: "#6D5A8E", lineHeight: 1.85, marginTop: 12 }}>Built for serious research hardware. Ensure your workstation meets these specifications before requesting access.</p>
          </div>
        </Fade>
        <Fade delay={0.08}>
          <div style={{ border: "1px solid #EEE9FF", borderRadius: 10, overflow: "hidden", padding: "4px 28px" }}>
            {SPECS.map(([label, value], i) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: i < SPECS.length - 1 ? "1px solid #EEE9FF" : "none" }}>
                <span style={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "#6D5A8E", fontFamily: "'DM Mono',monospace" }}>{label}</span>
                <span style={{ fontSize: 14, color: "#110820" }}>{value}</span>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────── */
function CTA() {
  return (
    <section style={{ padding: "90px 5vw", borderTop: "1px solid #EEE9FF", position: "relative", overflow: "hidden", background: "linear-gradient(158deg,#F0ECFF 0%,#E8E3F8 100%)" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse,rgba(109,40,217,0.09)0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <Fade delay={0.05}>
          <h2 style={{ fontSize: "clamp(34px,5vw,68px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.98, color: "#110820", marginBottom: 20 }}>
            The operating system for advanced bioprinting.
          </h2>
        </Fade>
        <Fade delay={0.08}>
          <p style={{ fontSize: 16, color: "#6D5A8E", lineHeight: 1.75, maxWidth: 460, margin: "0 auto 36px" }}>
            DHEE Slicer v1.0 is available now. Contact our team to schedule a demonstration or request access for your research facility.
          </p>
        </Fade>
        <Fade delay={0.16}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => window.open("https://dhee-slicer-daca07d87663.herokuapp.com/register", "_blank")}
              style={{ display: "inline-flex", alignItems: "center", padding: "8px 18px", fontSize: 12.5, fontWeight: 600, borderRadius: 7, cursor: "pointer", letterSpacing: "-0.01em", background: "#6D28D9", color: "#fff", border: "none", boxShadow: "0 2px 12px rgba(109,40,217,0.28)", transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#5B21B6"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#6D28D9"; e.currentTarget.style.transform = "none"; }}
            >
              Request Demo
            </button>
            <button style={{ display: "inline-flex", alignItems: "center", padding: "13px 28px", fontSize: 14, fontWeight: 600, borderRadius: 7, cursor: "pointer", background: "transparent", color: "#6D28D9", border: "1.5px solid #D8D0F5", transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F8F7FF"; e.currentTarget.style.borderColor = "#6D28D9"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#D8D0F5"; }}>
              Contact Research Team
            </button>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────── */
const TESTIMONIALS_DATA = [
  { id: 1, name: "Angel G C", role: "PhD Scholar", company: "MSLS", content: "Earlier, I had to juggle multiple applications for slicing, printer control, and printing, but now everything is available in one place. What I like most about the Trivima Advanced is the three-extruder setup and independent temperature control at both the print head and bed, which makes it really easy to work with a wide variety of biomaterials and polymers.", rating: 5, avatar: "/dhee/angel.jpg" },
  { id: 2, name: "Prof. Marcus Bell", role: "Biomaterials Research Lead", company: "KJ Somaiya College of Engineering", content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Multi-extruder support and the G-code viewer meant zero surprises at the printer — exactly what a research environment demands.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 3, name: "Dr. Priya Kapoor", role: "Research Fellow", company: "IIT Hyderabad", content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Variable layer heights per Z-range is a game-changer for gradient scaffolds. Slicing a 96-well plate used to take an afternoon.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
  { id: 4, name: "Rafael Domínguez", role: "Senior R&D", company: "CLRI", content: "At vero eos et accusamus et iusto odio dignissimos. The offline licensing model means our air-gapped lab machines stay productive, and the serial control panel replaced our secondary interface entirely.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/78.jpg" },
  { id: 5, name: "Dr. Mei-Ling Zhou", role: "Advanced Manufacturing Researcher", company: "IISc Banglore", content: "Temporibus autem quibusdam et aut officiis debitis rerum necessitatibus. Real-time per-extruder temperature monitoring finally gives us the precision we need without a secondary dashboard.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/57.jpg" },
];

const TRUSTED_LABS = [
  { name: "IIT Hyderabad", logo: "/dhee/college/iithyd.png" },
  { name: "KJ Somaiya College of Engineering", logo: "/dhee/college/kjs.png" },
  { name: "ARI Pune", logo: "/dhee/college/ari.png" },
  { name: "IISc Bangalore", logo: "/dhee/college/iisc.png" },
  { name: "MIT", logo: "/dhee/college/mit.png" },
  { name: "CLRI", logo: "/dhee/college/clri.png" },
];

function StarIcon({ filled = true, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="1.5">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="rgba(109,40,217,0.18)" strokeWidth="1.5" style={{ position: "absolute", top: -4, left: -4, transform: "rotate(180deg)" }}>
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveIndex(i => (i + 1) % TESTIMONIALS_DATA.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" style={{ padding: "96px 5vw", borderTop: "1px solid #EEE9FF", background: "linear-gradient(160deg, #F8F7FF 0%, #FFFFFF 50%, #F0ECFF 100%)", overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8vw", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, marginBottom: 24, background: "rgba(109,40,217,0.08)", border: "1px solid rgba(109,40,217,0.18)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "#6D28D9", alignSelf: "flex-start" }}>
            <StarIcon size={12} />
            Trusted by researchers
          </div>
          <h2 style={{ fontSize: "clamp(28px,3.2vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#110820", marginBottom: 18 }}>
            What researchers<br />say about DHEE.
          </h2>
          <p style={{ fontSize: 15, color: "#6D5A8E", lineHeight: 1.85, marginBottom: 36, maxWidth: 400 }}>
            From tissue engineering labs to clinical research facilities — teams worldwide trust DHEE Slicer for precision bioprinting.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {TESTIMONIALS_DATA.map((_, i) => (
              <button key={i} onClick={() => setActiveIndex(i)} style={{ height: 10, borderRadius: 999, border: "none", cursor: "pointer", padding: 0, width: activeIndex === i ? 36 : 10, background: activeIndex === i ? "#6D28D9" : "rgba(109,40,217,0.2)", transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)" }} />
            ))}
          </div>
          <div style={{ marginTop: 56 }}>
            <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B8ACD8", marginBottom: 20 }}>Trusted by teams from</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 20px", alignItems: "center" }}>
              {TRUSTED_LABS.map(lab => (
                <div key={lab.name} style={{ display: "flex", alignItems: "center" }}>
                  <img src={lab.logo} alt={lab.name} title={lab.name} style={{ height: 40, width: "auto", maxWidth: 120, objectFit: "contain", mixBlendMode: "multiply", opacity: 0.5, filter: "grayscale(100%)", transition: "opacity 0.3s ease, filter 0.3s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.filter = "grayscale(0%)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.filter = "grayscale(100%)"; }}
                    onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "block"; }}
                  />
                  <span style={{ display: "none", fontSize: 13, fontWeight: 600, color: "rgba(109,40,217,0.35)", letterSpacing: "-0.01em" }}>{lab.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: "relative", minHeight: 380 }}>
          <div style={{ position: "absolute", bottom: -24, left: -24, width: 96, height: 96, borderRadius: 16, background: "rgba(109,40,217,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: -24, right: -24, width: 96, height: 96, borderRadius: 16, background: "rgba(109,40,217,0.05)", pointerEvents: "none" }} />
          {TESTIMONIALS_DATA.map((t, i) => (
            <div key={t.id} style={{ position: i === 0 ? "relative" : "absolute", inset: 0, opacity: activeIndex === i ? 1 : 0, transform: activeIndex === i ? "translateX(0) scale(1)" : "translateX(60px) scale(0.97)", transition: "opacity 0.5s ease, transform 0.5s ease", pointerEvents: activeIndex === i ? "auto" : "none", zIndex: activeIndex === i ? 2 : 0 }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #EEE9FF", borderRadius: 20, padding: "36px 36px 28px", boxShadow: "0 8px 40px rgba(109,40,217,0.10), 0 1px 4px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {Array(t.rating).fill(0).map((_, si) => <StarIcon key={si} />)}
                </div>
                <div style={{ position: "relative", marginBottom: 28, flex: 1 }}>
                  <QuoteIcon />
                  <p style={{ position: "relative", zIndex: 1, fontSize: 16, fontWeight: 500, color: "#110820", lineHeight: 1.7, letterSpacing: "-0.01em" }}>"{t.content}"</p>
                </div>
                <div style={{ height: 1, background: "#EEE9FF", marginBottom: 20 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src={t.avatar} alt={t.name} width={48} height={48} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #EEE9FF", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#110820", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#9B8DC4", marginTop: 3, letterSpacing: "0.01em" }}>{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 760px) { #testimonials > div { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

/* ─── ROOT ─────────────────────────────────── */
export default function DheeLanding() {
  return (
    <div
      data-dhee
      style={{
        fontFamily: "var(--font-libre-franklin), 'Libre Franklin', sans-serif",
        background: "#FFFFFF",
        color: "#110820",
        overflowX: "clip",
      }}
    >
      <style>{`
        /* Every rule below is scoped to [data-dhee]. The original build shipped
           a global reset plus html/body/scrollbar/cursor rules here; those are
           deliberately gone — they broke Lenis and CoordinateCursor. */
        [data-dhee] .tag-chip-pop { animation: dheeTagPopIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes dheeTagPopIn {
          0%   { opacity: 0; transform: scale(0.7) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ══════════════════════════════════════════
           MOBILE RESPONSIVE — 768px and below
           ══════════════════════════════════════════ */
        @media (max-width: 768px) {

          /* ── Nav: hide links, shrink button ── */
[data-dhee] .nav-links { display: none !important; }

          /* ── Workflow: stack columns vertically ── */
[data-dhee] .workflow-outer {
            flex-direction: column !important;
            padding: 0 5vw 48px !important;
            gap: 0 !important;
          }
[data-dhee] .workflow-text-col {
            flex: unset !important;
            width: 100% !important;
          }
[data-dhee] .workflow-text-col > div {
            min-height: unset !important;
            padding: 32px 0 !important;
          }
[data-dhee] .workflow-sticky-col {
            flex: unset !important;
            width: 100% !important;
            position: static !important;
          }
[data-dhee] .workflow-sticky-inner {
            position: static !important;
            padding-bottom: 0 !important;
            top: unset !important;
          }

          /* ── CapRow: single column, image always below text ── */
[data-dhee] .cap-row-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 40px 5vw !important;
          }
[data-dhee] .cap-text { order: 1 !important; }
[data-dhee] .cap-card {
            order: 2 !important;
            height: 240px !important;
          }

          /* ── Stats: 2×2 grid instead of 4-wide ── */
[data-dhee] .stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
[data-dhee] .stats-grid > div {
            border-right: none !important;
            border-bottom: 1px solid #EEE9FF !important;
            padding: 28px 6vw !important;
          }

          /* ── Specs: stack label block above table ── */
[data-dhee] .specs-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          /* Make specs table row values wrap nicely */
[data-dhee] .specs-grid > div:last-child > div > div {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px !important;
          }
        }
      `}</style>
      <Hero />
      <Problem />
      <Workflow />
      <Capabilities />
      <Specs />
      <CTA />
      <Testimonials />
    </div>
  );
}