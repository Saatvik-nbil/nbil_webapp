"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ─── FADE-IN (local copy, same behaviour as App) ────── */
function Fade({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
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

/* ─── MEDIA FRAME ────────────────────────────────────────
   Drop a file into /public and set `src` below.
   type: "image" (png/jpg/gif) | "video" (mp4/webm)
   Leave src as null to keep the placeholder.
   ────────────────────────────────────────────────────── */
function MediaFrame({ src, type = "image", label, hint, height = 340 }) {
  return (
    <div className="guide-media" style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: -1, background: "linear-gradient(135deg,rgba(109,40,217,0.16),rgba(139,92,246,0.09))", borderRadius: 15, filter: "blur(14px)", opacity: 0.5 }} />
      <div style={{
        position: "relative", height, borderRadius: 14, overflow: "hidden",
        border: src ? "1px solid #D8D0F5" : "1px dashed #C4B8E8",
        background: src ? "#0A041A" : "linear-gradient(135deg,#F8F7FF 0%,#F0ECFF 100%)",
        boxShadow: "0 16px 48px rgba(109,40,217,0.10)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {src && type === "video" ? (
          <video autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
            <source src={src} type="video/mp4" />
          </video>
        ) : src ? (
          <Image src={src} alt={label} fill sizes="(min-width: 1024px) 50vw, 100vw" style={{ objectFit: "cover" }} />
        ) : (
          <div style={{ textAlign: "center", padding: 24 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(109,40,217,0.09)", border: "1px dashed rgba(109,40,217,0.32)", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 16 16" width="22" height="22" fill="none">
                <rect x="1" y="1" width="14" height="14" rx="2" stroke="rgba(109,40,217,0.45)" strokeWidth="1.2" strokeDasharray="2 2" />
                <circle cx="5.5" cy="5.5" r="1.5" fill="rgba(109,40,217,0.3)" />
                <path d="M1 11l4-3 3 2.5 3-4 4 4.5" stroke="rgba(109,40,217,0.45)" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <div style={{ fontSize: 9.5, color: "#9B8DC4", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", marginBottom: 8 }}>MEDIA PLACEHOLDER</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#110820", letterSpacing: "-0.01em", maxWidth: 280, margin: "0 auto", lineHeight: 1.45 }}>{label}</div>
            {hint && <div style={{ fontSize: 11.5, color: "#9B8DC4", lineHeight: 1.55, maxWidth: 280, margin: "8px auto 0" }}>{hint}</div>}
            <div style={{ display: "inline-flex", gap: 6, marginTop: 14 }}>
              {["IMAGE", "GIF", "VIDEO"].map(t => (
                <span key={t} style={{ fontSize: 8.5, fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em", color: "#B8ACD8", border: "1px solid #E4DDF8", borderRadius: 3, padding: "2px 6px" }}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CALLOUTS ───────────────────────────────────────── */
function Callout({ kind = "check", children }) {
  const map = {
    check: { bg: "rgba(109,40,217,0.05)", line: "#6D28D9", text: "#3B1F6A", title: "Check" },
    tip: { bg: "rgba(16,185,129,0.06)", line: "#10B981", text: "#0B5E45", title: "Tip" },
    warn: { bg: "rgba(245,158,11,0.08)", line: "#F59E0B", text: "#6B4A08", title: "Important" },
  };
  const c = map[kind];
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 16, padding: "11px 14px", borderRadius: 8, background: c.bg, borderLeft: `3px solid ${c.line}` }}>
      <span style={{ fontSize: 9.5, fontFamily: "'DM Mono',monospace", letterSpacing: "0.09em", textTransform: "uppercase", color: c.line, fontWeight: 500, flexShrink: 0, paddingTop: 2 }}>{c.title}</span>
      <span style={{ fontSize: 13.5, color: c.text, lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}

/* ─── STEP DATA ──────────────────────────────────────────
   To add a screenshot/GIF/video: put the file in /public
   and set media.src (e.g. "/dhee/guide/step-01.png") plus
   media.type ("image" or "video").
   ────────────────────────────────────────────────────── */
const GUIDE_STEPS = [
  {
    n: "01", label: "Import",
    title: "Import your model",
    body: "Open DHEE Slicer and click Import Model, then select the file you want to print. Meshes load directly onto the build platform.",
    points: ["Supported formats: STL, OBJ and 3MF", "Import several meshes into a single scene for multi-part builds"],
    check: "The model appears on the build platform.",
    media: { src: null, type: "image", label: "Import Model button and the loaded mesh", hint: "Capture the toolbar and the model on the platform." },
  },
  {
    n: "02", label: "Position",
    title: "Position the model",
    body: "Select the model, then use Place on Platform to drop it flat and Center Model to move it to the middle of the build area.",
    points: ["Drag to reposition, or type exact X/Y coordinates", "For plate work, load a 12-, 24- or 96-well preset and let coordinate mapping place each well"],
    check: "The entire model sits inside the platform boundary.",
    media: { src: null, type: "video", label: "Positioning controls in use", hint: "A short GIF of drag-and-centre reads better than a still." },
  },
  {
    n: "03", label: "Orientation",
    title: "Check the orientation",
    body: "Rotate the model so it rests on a stable base. For simple geometry, put the largest flat surface against the platform.",
    points: ["Rotate on X, Y or Z in fixed increments or free angles", "Overhangs beyond roughly 45° will need support material"],
    check: "The model neither floats above nor sinks below the platform.",
    media: { src: null, type: "image", label: "Before and after orientation", hint: "Use a side-by-side view if the change is subtle." },
  },
  {
    n: "04", label: "Profile",
    title: "Select a print profile",
    body: "Open the Profile menu and choose the validated configuration for your material and printer. The profile drives layer height, nozzle settings, wall thickness, infill and motion.",
    points: ["Validated NBIL profiles ship with the application", "Save your own profile once a configuration is proven"],
    warn: "Do not alter a validated profile unless your protocol calls for it. Duplicate it first and edit the copy.",
    media: { src: null, type: "image", label: "Profile menu with the recommended configuration", hint: "Highlight the profile that should be selected." },
  },
  {
    n: "05", label: "Settings",
    title: "Review the basic settings",
    body: "Before slicing, confirm the handful of parameters that most affect the result.",
    points: ["Layer height and model scale", "Infill density and pattern — seven strategies including grid, honeycomb and concentric", "Wall thickness and perimeter count", "Nozzle and extruder assignment across channels E0 to E5"],
    check: "Every required field holds a valid value for your material.",
    media: { src: null, type: "image", label: "Basic settings panel", hint: "Number or outline the fields a user should verify." },
  },
  {
    n: "06", label: "Slice",
    title: "Slice the model",
    body: "Click Slice to generate the toolpath. Wait for the application to confirm that slicing has finished before moving on.",
    points: ["Slicing time scales with model size and infill density", "Variable layer heights can be set per Z-range without splitting the file"],
    check: "Slicing completes and the layer preview becomes available.",
    media: { src: null, type: "video", label: "Slice button and completion state", hint: "Capture the finished state rather than the progress bar." },
  },
  {
    n: "07", label: "Validate",
    title: "Review the layer preview",
    body: "Step through the generated toolpath before it reaches hardware. Four playback modes are available: line-by-line, layer range, single layer and full view.",
    points: ["Drag the playhead forward or backward to any point", "Perimeters, infill, supports and travel moves each render in their own colour", "Export the review as a PDF for your lab records"],
    warn: "Always inspect the first layer. Most failed prints are visible there before anything is extruded.",
    media: { src: null, type: "video", label: "Layer preview with the playback slider", hint: "A short clip scrubbing through layers works well here." },
  },
  {
    n: "08", label: "Warnings",
    title: "Clear any warnings",
    body: "Check the status panel and resolve anything flagged as critical before you export.",
    points: ["Model outside the build area", "Unsupported or non-manifold geometry", "No profile selected", "No layers generated"],
    check: "No unresolved critical warning remains.",
    media: { src: null, type: "image", label: "Warning and status panel", hint: "Use an example free of confidential project data." },
  },
  {
    n: "09", label: "Export",
    title: "Export the print file",
    body: "Click Export, choose the required format and save the file. Use a name that identifies the model, profile and revision.",
    points: ["Suggested naming: model-name_profile_version", "Send the file to the printer over USB-to-serial, or transfer it on media"],
    check: "The exported file exists and is not empty.",
    media: { src: null, type: "image", label: "Export dialog", hint: "Blur any confidential file paths before publishing." },
  },
];

const REQUIREMENTS = [
  { k: "01", t: "A supported 3D model", d: "STL, OBJ or 3MF, watertight and correctly scaled." },
  { k: "02", t: "The correct print profile", d: "A validated NBIL configuration for your material." },
  { k: "03", t: "A folder for the output", d: "Somewhere to save the exported print file." },
];

const CHECKLIST = [
  "Correct model imported",
  "Model positioned inside the build area",
  "Orientation gives a stable base",
  "Correct profile selected",
  "Basic settings reviewed",
  "Slicing completed",
  "Layer preview inspected",
  "No critical warnings",
  "File exported and verified",
];

/* Splash / showcase clip shown in the guide hero. Muted + looping.
   Swap this path for a dedicated splash file when you have one. */
const SPLASH_VIDEO = "/dhee/dhee-splash.mp4";

const TROUBLESHOOTING = [
  { q: "The model will not import", a: "Check the file format and confirm the mesh is watertight. Repair non-manifold geometry in your CAD tool, then import again." },
  { q: "No layers are generated", a: "Usually the model sits outside the build area or no profile is selected. Re-centre the model and confirm the profile before re-slicing." },
  { q: "The toolpath has missing sections", a: "Thin walls below the nozzle diameter are skipped. Increase wall thickness or select a smaller nozzle in the profile." },
  { q: "A critical error will not clear", a: "Note the exact message and the step it appeared on, then contact your NBIL support representative." },
];

/* ─── STEP BLOCK ─────────────────────────────────────── */
function GuideStep({ step, index, registerRef }) {
  const reversed = index % 2 === 1;
  return (
    <article
      ref={(el) => registerRef(index, el)}
      data-step={index}
      id={`step-${step.n}`}
      className="guide-step"
      style={{
        display: "grid",
        gridTemplateColumns: reversed ? "1fr 0.92fr" : "0.92fr 1fr",
        gap: "clamp(28px,5vw,72px)",
        alignItems: "center",
        padding: "56px 5vw",
        borderTop: "1px solid #EEE9FF",
        scrollMarginTop: 110,
      }}
    >
      <div className="guide-step-text" style={{ order: reversed ? 2 : 1 }}>
        <Fade>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{
              width: 38, height: 38, borderRadius: 9, flexShrink: 0,
              background: "#6D28D9", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, lineHeight: 1, letterSpacing: 0, fontVariantNumeric: "tabular-nums",
              boxShadow: "0 4px 14px rgba(109,40,217,0.28)",
            }}>{step.n}</span>
            <div style={{ height: 1, width: 24, background: "#D8D0F5" }} />
            <span style={{ fontSize: 10.5, color: "#6D5A8E", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{step.label}</span>
          </div>

          <h3 style={{ fontSize: "clamp(22px,2.5vw,34px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#110820", marginBottom: 14 }}>
            {step.title}
          </h3>

          <p style={{ fontSize: 15, color: "#6D5A8E", lineHeight: 1.85, maxWidth: 470 }}>{step.body}</p>

          {step.points && (
            <ul style={{ listStyle: "none", margin: "18px 0 0", padding: 0, maxWidth: 470 }}>
              {step.points.map((p) => (
                <li key={p} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#A78BFA", flexShrink: 0, marginTop: 9 }} />
                  <span style={{ fontSize: 14, color: "#6D5A8E", lineHeight: 1.7 }}>{p}</span>
                </li>
              ))}
            </ul>
          )}

          <div style={{ maxWidth: 470 }}>
            {step.check && <Callout kind="check">{step.check}</Callout>}
            {step.tip && <Callout kind="tip">{step.tip}</Callout>}
            {step.warn && <Callout kind="warn">{step.warn}</Callout>}
          </div>
        </Fade>
      </div>

      <div style={{ order: reversed ? 1 : 2 }}>
        <Fade delay={0.08}>
          <MediaFrame {...step.media} />
        </Fade>
      </div>
    </article>
  );
}

/* ─── PAGE ───────────────────────────────────────────── */
export default function DheeGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState(() => CHECKLIST.map(() => false));
  const stepRefs = useRef([]);

  const registerRef = (i, el) => { stepRefs.current[i] = el; };

  /* Scrollspy: whichever step crosses the middle of the viewport wins.
     threshold 0 + a narrow centre band keeps this reliable for steps
     taller than the band and on short viewports. */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveStep(parseInt(e.target.dataset.step, 10)); });
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const jumpTo = (i) => {
    stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const completed = done.filter(Boolean).length;

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
      {/* ══ HERO ══ */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(150deg,#0A041A 0%,#2A1259 48%,#160A32 100%)", padding: "140px 5vw 80px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03)1px,transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-20%", right: "-8%", width: 640, height: 640, background: "radial-gradient(circle,rgba(139,92,246,0.22)0%,transparent 62%)", pointerEvents: "none" }} />

        <div className="guide-hero-grid" style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,0.86fr)", gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
          <div className="guide-hero-copy">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 999, marginBottom: 26, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(196,184,255,0.24)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#C4B8FF", textTransform: "uppercase" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#A78BFA", display: "inline-block" }} />
              Quick-Start Guide
            </div>

            <h1 style={{ fontSize: "clamp(38px,4.6vw,64px)", fontWeight: 700, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#FFFFFF", marginBottom: 20, maxWidth: 620 }}>
              From import to<br />
              <span style={{ color: "#C4B8FF" }}>exported print file.</span>
            </h1>

            <p style={{ fontSize: "clamp(15px,1.4vw,17px)", color: "rgba(220,210,255,0.8)", lineHeight: 1.7, maxWidth: 520, marginBottom: 34 }}>
              Nine steps through a first slice in DHEE Slicer. Each step has one action, one visual, and one thing to verify before moving on.
            </p>

            <div className="guide-hero-meta" style={{ display: "flex", flexWrap: "wrap", gap: 0, border: "1px solid rgba(196,184,255,0.18)", borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.04)", maxWidth: 560 }}>
              {[
                ["Steps", "9"],
                ["Time", "~15 min"],
                ["Level", "Beginner"],
                ["Version", "v1.0"],
              ].map(([k, v], i) => (
                <div key={k} style={{ flex: "1 1 120px", padding: "16px 20px", borderRight: i < 3 ? "1px solid rgba(196,184,255,0.14)" : "none" }}>
                  <div style={{ fontSize: 9.5, color: "rgba(196,184,255,0.6)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{k}</div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Splash video — muted, looping, rounded corners */}
          <div className="guide-hero-video" style={{ position: "relative", justifySelf: "end", width: "100%" }}>
            <div style={{ position: "absolute", inset: -2, background: "linear-gradient(135deg,rgba(139,92,246,0.4),rgba(109,40,217,0.12))", borderRadius: 22, filter: "blur(26px)", opacity: 0.6, pointerEvents: "none" }} />
            <video
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              style={{ position: "relative", width: "100%", display: "block", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 18, border: "1px solid rgba(196,184,255,0.22)", boxShadow: "0 30px 80px rgba(10,4,26,0.55)", background: "#0A041A" }}
            >
              <source src={SPLASH_VIDEO} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ══ STICKY STEP RAIL ══ */}
      <div className="guide-rail" style={{
        position: "sticky", top: 56, zIndex: 150,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid #EEE9FF",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 5vw", height: 52, overflowX: "auto" }}>
          <span className="guide-rail-label" style={{ fontSize: 9.5, color: "#B8ACD8", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>Steps</span>
          <div style={{ display: "flex", gap: 6 }}>
            {GUIDE_STEPS.map((s, i) => {
              const active = activeStep === i;
              return (
                <button
                  key={s.n}
                  onClick={() => jumpTo(i)}
                  title={s.title}
                  style={{
                    flexShrink: 0, height: 28, minWidth: 28, padding: active ? "0 12px" : 0,
                    borderRadius: 7, border: `1px solid ${active ? "#6D28D9" : "#EEE9FF"}`,
                    background: active ? "#6D28D9" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#9B8DC4",
                    fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono',monospace",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7, whiteSpace: "nowrap",
                    transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
                  }}
                >
                  <span style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" }}>{s.n}</span>
                  {active && <span style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11.5, letterSpacing: "-0.01em" }}>{s.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ BEFORE YOU START ══ */}
      <section style={{ padding: "64px 5vw 8px", background: "#FFFFFF" }}>
        <Fade>
          <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#110820", marginBottom: 10 }}>Before you start.</h2>
          <p style={{ fontSize: 15, color: "#6D5A8E", lineHeight: 1.8, maxWidth: 520, marginBottom: 32 }}>
            Three things to have ready. Use the default NBIL profile for your first slice — it removes most of the variables.
          </p>
        </Fade>
        <div className="guide-req" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {REQUIREMENTS.map((r, i) => (
            <Fade key={r.k} delay={i * 0.07}>
              <div className="mock-item" style={{ padding: "22px 24px", border: "1px solid #EEE9FF", borderRadius: 12, background: "#F8F7FF", height: "100%", transition: "all 0.25s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#D8D0F5"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(109,40,217,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#F8F7FF"; e.currentTarget.style.borderColor = "#EEE9FF"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 10.5, color: "#B8ACD8", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", marginBottom: 12 }}>{r.k}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#110820", letterSpacing: "-0.015em", marginBottom: 7 }}>{r.t}</div>
                <div style={{ fontSize: 13, color: "#6D5A8E", lineHeight: 1.65 }}>{r.d}</div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ══ STEPS ══ */}
      <section style={{ marginTop: 56, background: "#FFFFFF" }}>
        {GUIDE_STEPS.map((s, i) => (
          <GuideStep key={s.n} step={s} index={i} registerRef={registerRef} />
        ))}
      </section>

      {/* ══ FINAL CHECKLIST ══ */}
      <section style={{ padding: "72px 5vw", borderTop: "1px solid #EEE9FF", background: "linear-gradient(160deg,#F8F7FF 0%,#FFFFFF 55%,#F0ECFF 100%)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Fade>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#110820", marginBottom: 10 }}>Final check.</h2>
                <p style={{ fontSize: 15, color: "#6D5A8E", lineHeight: 1.8, maxWidth: 460 }}>
                  Run through this before sending the file to a printer.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 130, height: 5, borderRadius: 999, background: "#EEE9FF", overflow: "hidden" }}>
                  <div style={{ width: `${(completed / CHECKLIST.length) * 100}%`, height: "100%", background: "#6D28D9", borderRadius: 999, transition: "width 0.35s cubic-bezier(0.23,1,0.32,1)" }} />
                </div>
                <span style={{ fontSize: 11, color: "#6D5A8E", fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em", flexShrink: 0 }}>{completed}/{CHECKLIST.length}</span>
              </div>
            </div>
          </Fade>

          <div className="guide-checklist" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {CHECKLIST.map((item, i) => (
              <button
                key={item}
                onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                style={{
                  display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                  padding: "15px 17px", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${done[i] ? "#D8D0F5" : "#EEE9FF"}`,
                  background: done[i] ? "rgba(109,40,217,0.05)" : "#FFFFFF",
                  transition: "all 0.2s", width: "100%", fontFamily: "inherit",
                }}
              >
                <span style={{
                  width: 19, height: 19, borderRadius: 5, flexShrink: 0,
                  border: `1.5px solid ${done[i] ? "#6D28D9" : "#D8D0F5"}`,
                  background: done[i] ? "#6D28D9" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  {done[i] && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.2l2.4 2.4L9.5 4" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.5, color: done[i] ? "#9B8DC4" : "#110820", textDecoration: done[i] ? "line-through" : "none", transition: "all 0.2s" }}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TROUBLESHOOTING ══ */}
      <section style={{ padding: "72px 5vw", borderTop: "1px solid #EEE9FF", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Fade>
            <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#110820", marginBottom: 10 }}>If something goes wrong.</h2>
            <p style={{ fontSize: 15, color: "#6D5A8E", lineHeight: 1.8, maxWidth: 520, marginBottom: 32 }}>
              The four issues we see most often, and what usually fixes them.
            </p>
          </Fade>
          <div className="guide-trouble" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {TROUBLESHOOTING.map((t, i) => (
              <Fade key={t.q} delay={i * 0.06}>
                <div className="mock-item" style={{ padding: "24px 26px", border: "1px solid #EEE9FF", borderRadius: 12, background: "#F8F7FF", height: "100%", transition: "all 0.25s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#D8D0F5"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(109,40,217,0.09)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#F8F7FF"; e.currentTarget.style.borderColor = "#EEE9FF"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#110820", letterSpacing: "-0.015em", marginBottom: 9 }}>{t.q}</div>
                  <div style={{ fontSize: 13.5, color: "#6D5A8E", lineHeight: 1.75 }}>{t.a}</div>
                </div>
              </Fade>
            ))}
          </div>

          <Fade delay={0.1}>
            <div style={{ marginTop: 36, padding: "26px 30px", borderRadius: 14, border: "1px solid #EEE9FF", background: "linear-gradient(135deg,#F0ECFF 0%,#F8F7FF 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#110820", letterSpacing: "-0.02em", marginBottom: 6 }}>Still stuck?</div>
                <div style={{ fontSize: 13.5, color: "#6D5A8E", lineHeight: 1.7, maxWidth: 460 }}>
                  Contact your NBIL support representative with the exact error message and the step it appeared on.
                </div>
              </div>
              <button
                onClick={() => window.open("https://dhee-slicer-daca07d87663.herokuapp.com", "_blank")}
                style={{ display: "inline-flex", alignItems: "center", padding: "13px 28px", fontSize: 14, fontWeight: 600, borderRadius: 7, cursor: "pointer", background: "#6D28D9", color: "#fff", border: "none", boxShadow: "0 2px 12px rgba(109,40,217,0.28)", transition: "all 0.15s", fontFamily: "'Libre Franklin',sans-serif", flexShrink: 0 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#5B21B6"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#6D28D9"; e.currentTarget.style.transform = "none"; }}
              >
                Open DHEE Slicer →
              </button>
            </div>
          </Fade>
        </div>
      </section>

      {/* ══ RESPONSIVE ══ */}
      <style>{`
        @media (max-width: 960px) {
[data-dhee] .guide-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
[data-dhee] .guide-hero-video {
            order: -1;
            justify-self: stretch !important;
            max-width: 560px;
          }
        }
        @media (max-width: 1024px) {
[data-dhee] .guide-checklist { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 768px) {
[data-dhee] .guide-step {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
            padding: 40px 5vw !important;
          }
[data-dhee] .guide-step-text { order: 1 !important; }
[data-dhee] .guide-step > div:last-child { order: 2 !important; }
[data-dhee] .guide-media > div:last-child { height: 220px !important; }
          .guide-req,
          .guide-trouble,
[data-dhee] .guide-checklist { grid-template-columns: 1fr !important; }
[data-dhee] .guide-rail-label { display: none !important; }
[data-dhee] .guide-hero-meta > div { border-right: none !important; }
        }
      `}</style>
    </div>
  );
}
