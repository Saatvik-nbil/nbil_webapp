"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChatCircleDots, X, PaperPlaneTilt, ArrowClockwise, Robot } from "@phosphor-icons/react";
import { validateEmail } from "@/lib/validation";
import { useFormSubmit } from "@/app/components/forms/useFormSubmit";
import { machines } from "@/lib/machines";

/**
 * NBIL Assistant: a small, always-there chat widget (bottom-right, every
 * page). Two jobs, chosen up front like a HubSpot-style bot:
 *
 * 1. Point visitors at the right page (bioprinters, software, consultancy,
 *    careers, etc.) without them hunting through the nav.
 * 2. Collect a lead conversationally (name, email, phone, what they want),
 *    one question at a time, then post it to `/api/forms` (formId
 *    "chatbot") exactly like every other form on the site: same pipeline,
 *    same Google Sheet, own tab ("Chatbot Leads").
 *
 * Mounted once in the root layout, so the transcript survives client-side
 * navigation between pages (the layout never remounts) and resets only on a
 * full page reload or an explicit "start over".
 */

/* ---- Conversation types ---- */

type QuickReply = { id: string; label: string };
type ChatMessage = { id: string; from: "bot" | "user"; text: string; options?: QuickReply[] };
type Step =
  | "idle"
  | "menu"
  | "nav"
  | "lead_name"
  | "lead_email"
  | "lead_phone"
  | "lead_intent"
  | "lead_message"
  | "lead_submitting"
  | "lead_retry";

type LeadDraft = { name: string; email: string; phone: string; intent: string; message: string };

const EMPTY_DRAFT: LeadDraft = { name: "", email: "", phone: "", intent: "", message: "" };

/** Steps that show the free-text input bar rather than only quick replies. */
const INPUT_STEPS: Step[] = ["lead_name", "lead_email", "lead_phone", "lead_message"];

const MAIN_MENU_OPTIONS: QuickReply[] = [
  { id: "nav", label: "Explore the site" },
  { id: "lead", label: "Talk to our team" },
];

/** Pulled from the same catalog every other page uses, so a new model shows
 *  up here automatically, nothing to keep in sync by hand. */
const DESTINATIONS: QuickReply[] = [
  { id: "/trivima", label: "Bioprinter range" },
  ...machines.map((m) => ({ id: `/machines/${m.slug}`, label: m.name })),
  { id: "/dhee-slicer", label: "Dhee slicer software" },
  { id: "/consultancy", label: "Consultancy services" },
  { id: "/our-story", label: "Our story" },
  { id: "/team", label: "Team" },
  { id: "/team#careers", label: "Careers" },
  { id: "/news", label: "News" },
  { id: "/blogs", label: "Blogs" },
  { id: "/publications", label: "Publications" },
  { id: "/newsletter", label: "Newsletter" },
  { id: "/#connect", label: "Contact us" },
];

const INTENT_LABELS: Record<string, string> = {
  quote: "Request a quote",
  consultation: "Book a consultation",
  question: "Ask a question",
  other: "Something else",
};

const PLACEHOLDERS: Partial<Record<Step, string>> = {
  lead_name: "Your full name",
  lead_email: "you@organization.com",
  lead_phone: "+91 98765 43210",
  lead_message: "Tell us more (optional), or press Enter to skip",
};

const INPUT_TYPE: Partial<Record<Step, string>> = {
  lead_email: "email",
  lead_phone: "tel",
};

const AUTOCOMPLETE: Partial<Record<Step, string>> = {
  lead_name: "name",
  lead_email: "email",
  lead_phone: "tel",
};

// Legal pages get a chat prompt that's just noise, not conversions. Same
// call MobileStickyCTA.tsx makes.
const HIDDEN_ON = ["/privacy-policy", "/terms"];

const firstName = (full: string) => full.trim().split(/\s+/)[0] ?? full;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Loose, worldwide phone check. The bot doesn't ask for a country, so it
 *  only rules out obvious typos rather than enforcing a per-country rule. */
function validatePhoneLoose(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "A phone number would help. Mind adding one?";
  if (/[A-Za-z]/.test(value)) return "That doesn't look like a phone number. No letters, please.";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    return "That doesn't look like a complete phone number. Could you double-check it?";
  }
  return null;
}

let msgSeq = 0;
const nextId = () => `m${(msgSeq += 1)}`;

export default function NBILBot() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const { status, submit, reset: resetSubmit } = useFormSubmit("chatbot");

  const [panelOpen, setPanelOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<Step>("idle");
  const [botTyping, setBotTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const draftRef = useRef<LeadDraft>({ ...EMPTY_DRAFT });
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const busy = botTyping || status === "submitting";

  /* ---- First-visit affordance: a quiet pulse until the bot is opened once ---- */
  useEffect(() => {
    try {
      if (!localStorage.getItem("nbil_bot_seen")) setShowPulse(true);
    } catch {
      // Locked-down storage, so just skip the pulse. Nothing depends on it.
    }
  }, []);

  /* ---- Always scroll to the newest message ---- */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, botTyping, reduce]);

  /* ---- Focus the input the moment a step needs free text ---- */
  useEffect(() => {
    if (panelOpen && INPUT_STEPS.includes(step)) inputRef.current?.focus();
  }, [panelOpen, step]);

  /* ---- Message helpers ---- */

  const say = useCallback(
    async (text: string, options?: QuickReply[]) => {
      setBotTyping(true);
      await wait(reduce ? 120 : 480 + Math.random() * 260);
      setBotTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), from: "bot", text, options }]);
    },
    [reduce],
  );

  const addUser = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: nextId(), from: "user", text }]);
  }, []);

  /** Strips the buttons off the most recent bot message once it's been
   *  answered, so a slow double-click can't fire the same choice twice. */
  const consumeOptions = useCallback(() => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.from !== "bot" || !last.options) return prev;
      return [...prev.slice(0, -1), { ...last, options: undefined }];
    });
  }, []);

  /* ---- Conversation branches ---- */

  const showNavMenu = useCallback(async () => {
    setStep("nav");
    await say("Where would you like to go?", [
      ...DESTINATIONS,
      { id: "lead", label: "Talk to our team" },
      { id: "__back", label: "Back" },
    ]);
  }, [say]);

  const startLeadFlow = useCallback(async () => {
    draftRef.current = { ...EMPTY_DRAFT };
    setStep("lead_name");
    await say("Great, let's get you connected. It takes less than a minute.");
    await say("What's your name?");
  }, [say]);

  const submitLead = useCallback(async () => {
    setStep("lead_submitting");
    const d = draftRef.current;
    const ok = await submit(
      [
        { label: "Name", value: d.name, required: true },
        { label: "Email", value: d.email, type: "email", required: true },
        { label: "Phone", value: d.phone, required: true },
        { label: "What they want", value: d.intent, required: true },
        { label: "Message", value: d.message, required: false },
      ],
      "",
    );

    if (ok) {
      await say(
        `Thanks, ${firstName(d.name)}. That's everything I need, and someone from the NBIL team will reach out to ${d.email} within 2 business days.`,
      );
      await say("Anything else I can help with?", MAIN_MENU_OPTIONS);
      setStep("menu");
    } else {
      await say("Hmm, that didn't go through. Want to try again?", [
        { id: "retry", label: "Try again" },
        { id: "nav", label: "Explore the site instead" },
      ]);
      setStep("lead_retry");
    }
  }, [submit, say]);

  const start = useCallback(async () => {
    await say("Hi, I'm the NBIL Assistant.");
    setStep("menu");
    await say(
      "I can help you find your way around, or connect you with our team for a quote or consultation. What would you like to do?",
      MAIN_MENU_OPTIONS,
    );
  }, [say]);

  useEffect(() => {
    if (panelOpen && messages.length === 0) void start();
    // Only re-run when a fresh conversation is needed. `start` itself is
    // stable in practice (its own deps rarely change) and re-including it
    // would refire on every render of `say`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen, messages.length]);

  const handleQuickReply = useCallback(
    async (id: string, label: string) => {
      if (busy) return;
      consumeOptions();
      addUser(label);

      if (step === "menu") {
        if (id === "nav") return void showNavMenu();
        if (id === "lead") return void startLeadFlow();
        return;
      }

      if (step === "nav") {
        if (id === "__back") {
          setStep("menu");
          await say("Sure, what would you like to do?", MAIN_MENU_OPTIONS);
          return;
        }
        if (id === "lead") return void startLeadFlow();

        const dest = DESTINATIONS.find((d) => d.id === id);
        if (dest) {
          await say(`On it, heading to ${dest.label}.`);
          router.push(dest.id);
          await say("Anything else?", [
            { id: "nav", label: "Keep exploring" },
            { id: "lead", label: "Talk to our team" },
          ]);
          setStep("menu");
        }
        return;
      }

      if (step === "lead_intent") {
        const chosen = INTENT_LABELS[id];
        if (chosen) {
          draftRef.current.intent = chosen;
          setStep("lead_message");
          await say("Got it. Anything specific I should pass along, like application, timeline or questions?", [
            { id: "__skip", label: "Skip for now" },
          ]);
        }
        return;
      }

      if (step === "lead_message" && id === "__skip") {
        draftRef.current.message = "";
        await submitLead();
        return;
      }

      if (step === "lead_retry") {
        if (id === "retry") await submitLead();
        if (id === "nav") await showNavMenu();
      }
    },
    [busy, step, consumeOptions, addUser, showNavMenu, startLeadFlow, say, router, submitLead],
  );

  const handleTextSubmit = useCallback(
    async (raw: string) => {
      const value = raw.trim();
      if (busy || !value) return;

      if (step === "lead_name") {
        addUser(value);
        draftRef.current.name = value;
        setStep("lead_email");
        await say(`Nice to meet you, ${firstName(value)}! What's the best email to reach you at?`);
        return;
      }

      if (step === "lead_email") {
        addUser(value);
        const err = validateEmail(value, { required: true });
        if (err) {
          await say(`${err} Mind trying again?`);
          return;
        }
        draftRef.current.email = value;
        setStep("lead_phone");
        await say("And a phone number, in case email's slow to reach you?");
        return;
      }

      if (step === "lead_phone") {
        addUser(value);
        const err = validatePhoneLoose(value);
        if (err) {
          await say(err);
          return;
        }
        draftRef.current.phone = value;
        setStep("lead_intent");
        await say("What can we help you with?", [
          { id: "quote", label: "Request a quote" },
          { id: "consultation", label: "Book a consultation" },
          { id: "question", label: "Ask a question" },
          { id: "other", label: "Something else" },
        ]);
        return;
      }

      if (step === "lead_message") {
        addUser(value);
        draftRef.current.message = value;
        await submitLead();
      }
    },
    [busy, step, addUser, say, submitLead],
  );

  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = inputValue;
    if (!value.trim()) return;
    setInputValue("");
    void handleTextSubmit(value);
  }

  function togglePanel() {
    setPanelOpen((v) => !v);
    if (showPulse) {
      setShowPulse(false);
      try {
        localStorage.setItem("nbil_bot_seen", "1");
      } catch {
        // Nothing depends on this persisting.
      }
    }
  }

  function restart() {
    setMessages([]);
    setStep("idle");
    setInputValue("");
    draftRef.current = { ...EMPTY_DRAFT };
    resetSubmit();
    // messages.length dropping to 0 while the panel is open re-triggers the
    // greeting via the effect above.
  }

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={togglePanel}
        aria-expanded={panelOpen}
        aria-label={panelOpen ? "Close NBIL Assistant" : "Open NBIL Assistant"}
        className="fixed right-5 bottom-[4.75rem] z-[66] flex size-14 items-center justify-center rounded-full bg-[var(--color-brand)] text-white shadow-[0_14px_36px_rgba(2,12,27,0.28)] transition-transform duration-300 hover:scale-105 hover:bg-[var(--color-brand-hover)] active:scale-95 sm:right-6 sm:bottom-6 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        {!reduce && showPulse && !panelOpen ? (
          <span className="absolute inset-0 rounded-full bg-[var(--color-brand)] opacity-60 animate-ping" aria-hidden="true" />
        ) : null}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={panelOpen ? "close" : "open"}
            initial={reduce ? false : { opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {panelOpen ? <X size={24} weight="bold" /> : <ChatCircleDots size={26} weight="fill" />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {panelOpen ? (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="NBIL Assistant chat"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[65] left-4 right-4 bottom-[9rem] flex h-[min(70dvh,560px)] flex-col overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] shadow-[0_24px_64px_rgba(2,12,27,0.24)] sm:left-auto sm:right-6 sm:bottom-[5.75rem] sm:h-[560px] sm:w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--color-hairline)] bg-[var(--color-surface-raised)] px-4 py-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)]">
                <Robot size={19} weight="duotone" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-[13.5px] font-semibold text-[var(--color-ink)]">NBIL Assistant</span>
                <span className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-faint)]">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Usually replies instantly
                </span>
              </div>
              <button
                type="button"
                onClick={restart}
                aria-label="Start over"
                title="Start over"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
              >
                <ArrowClockwise size={16} weight="bold" />
              </button>
              <button
                type="button"
                onClick={togglePanel}
                aria-label="Close chat"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            {/* Transcript */}
            <div ref={scrollRef} aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className="flex flex-col gap-2">
                  <div className={`flex items-end gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                    {m.from === "bot" ? (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)]">
                        <Robot size={13} weight="duotone" />
                      </span>
                    ) : null}
                    <p
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap ${
                        m.from === "user"
                          ? "rounded-br-sm bg-[var(--color-brand)] text-white"
                          : "rounded-bl-sm bg-[var(--color-surface-raised)] text-[var(--color-ink)]"
                      }`}
                    >
                      {m.text}
                    </p>
                  </div>
                  {m.options ? (
                    <div className="flex flex-wrap gap-1.5 pl-8">
                      {m.options.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          disabled={busy}
                          onClick={() => void handleQuickReply(o.id, o.label)}
                          className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand-strong)] disabled:pointer-events-none disabled:opacity-50"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              {botTyping ? (
                <div className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)]">
                    <Robot size={13} weight="duotone" />
                  </span>
                  <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[var(--color-surface-raised)] px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-1.5 rounded-full bg-[var(--color-ink-faint)] animate-bounce motion-reduce:animate-none"
                        style={{ animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Input */}
            {INPUT_STEPS.includes(step) ? (
              <form onSubmit={onFormSubmit} className="flex items-center gap-2 border-t border-[var(--color-hairline)] px-3 py-3">
                <input
                  ref={inputRef}
                  type={INPUT_TYPE[step] ?? "text"}
                  autoComplete={AUTOCOMPLETE[step]}
                  value={inputValue}
                  disabled={busy}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={PLACEHOLDERS[step] ?? "Type a message"}
                  aria-label={PLACEHOLDERS[step] ?? "Type a message"}
                  className="h-10 flex-1 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)] px-3.5 text-[13.5px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none transition-colors focus:border-[var(--color-brand)] focus:ring-3 focus:ring-[var(--color-brand)]/15 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={busy || !inputValue.trim()}
                  aria-label="Send"
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)] text-white transition-colors hover:bg-[var(--color-brand-hover)] disabled:opacity-40"
                >
                  <PaperPlaneTilt size={16} weight="fill" />
                </button>
              </form>
            ) : (
              <div className="h-3" aria-hidden="true" />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
