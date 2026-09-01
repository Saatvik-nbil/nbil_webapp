"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  EnvelopeSimple,
  CalendarCheck,
  Flask,
  Lightbulb,
} from "@phosphor-icons/react";
import { OriginButton } from "@/components/ui/origin-button";
import {
  FIELD,
  FieldError,
  FormError,
  FormSuccess,
  Honeypot,
  LABEL,
  SelectCaret,
  fieldClass,
  textareaClass,
} from "@/app/components/forms/fields";
import PhoneField from "@/app/components/forms/PhoneField";
import { readField, useFormSubmit } from "@/app/components/forms/useFormSubmit";
import { COUNTRY_NAMES, DEFAULT_COUNTRY, findByName, getCountry } from "@/lib/countries";
import { formatPhone, validateEmail, validatePhone } from "@/lib/validation";

const EASE = [0.16, 1, 0.3, 1] as const;


const AREAS = [
  "Bone Tissue Engineering",
  "Cartilage & Osteochondral",
  "Skin & Wound Healing",
  "Vascular & Cardiac",
  "Drug Discovery & Toxicology",
  "Organ-on-a-Chip",
  "Other",
];

const TIMELINES = ["Immediate", "3–6 Months", "6+ Months"] as const;

const EXPECT = [
  {
    icon: EnvelopeSimple,
    title: "Instant Confirmation",
    body: "Receive a confirmation email with our initial technical questionnaire.",
  },
  {
    icon: CalendarCheck,
    title: "Scheduled Call",
    body: "Pick a slot that works for you.",
  },
  {
    icon: Flask,
    title: "Tailored Demo",
    body: "A custom walkthrough of bioprinting solutions for your specific tissue model.",
  },
];

export default function ProjectForm() {
  const reduce = useReducedMotion();
  const [timeline, setTimeline] = useState<(typeof TIMELINES)[number]>("Immediate");
  const { status, error, submit, reset } = useFormSubmit("consultation");
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_COUNTRY);
  const [country, setCountry] = useState(
    getCountry(DEFAULT_COUNTRY)?.name ?? "India",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** Drops one field's error the moment the visitor starts correcting it. */
  function clearError(key: string) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  const busy = status === "submitting";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const firstName = readField(data, "firstName");
    const lastName = readField(data, "lastName");
    const organization = readField(data, "organization");
    const jobTitle = readField(data, "jobTitle");
    const message = readField(data, "message");

    const found: Record<string, string> = {};
    if (!firstName) found.firstName = "First name is required.";
    if (!lastName) found.lastName = "Last name is required.";

    const emailError = validateEmail(email, { required: true });
    if (emailError) found.email = emailError;

    const phoneError = validatePhone(phoneCountry, phone, { required: true });
    if (phoneError) found.phone = phoneError;

    if (!organization) found.organization = "Organization is required.";
    if (!jobTitle) found.jobTitle = "Job title is required.";
    if (!message) found.message = "Please describe your project.";

    if (Object.keys(found).length) {
      setErrors(found);
      // Focus the first problem so the fix is one keystroke away.
      const order = ["firstName", "lastName", "email", "organization", "jobTitle", "phone", "message"];
      const first = order.find((k) => found[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }

    setErrors({});

    const ok = await submit(
      [
        { label: "First Name", value: firstName, required: true },
        { label: "Last Name", value: lastName, required: true },
        { label: "Email", value: email, type: "email", required: true },
        {
          label: "Phone",
          value: formatPhone(phoneCountry, phone),
          type: "phone",
          country: phoneCountry,
          required: true,
        },
        { label: "Organization", value: organization, required: true },
        { label: "Job Title", value: jobTitle, required: true },
        { label: "Country", value: country, required: true },
        { label: "Area of Interest", value: readField(data, "areaOfInterest"), required: true },
        { label: "Project Timeline", value: timeline, required: true },
        { label: "Message", value: message, required: true },
      ],
      readField(data, "company_website"),
    );

    if (ok) {
      formRef.current?.reset();
      setTimeline("Immediate");
      setEmail("");
      setPhone("");
      setPhoneCountry(DEFAULT_COUNTRY);
      setCountry(getCountry(DEFAULT_COUNTRY)?.name ?? "India");
      setErrors({});
    }
  }

  return (
    <section
      id="project-form"
      aria-labelledby="project-form-heading"
      className="scroll-mt-24 bg-[var(--color-canvas)] border-t border-[var(--color-hairline)] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Form card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="rounded-3xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-7 sm:p-10 shadow-[0_18px_50px_rgba(2,12,27,0.08)]"
          >
            <h2
              id="project-form-heading"
              className="font-display text-[1.75rem] lg:text-[2.1rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)]"
            >
              Tell Us About Your Project
            </h2>
            <p className="mt-2 text-[13.5px] text-[var(--color-brand-strong)]">
              All fields are required so we can prepare a useful analysis before we speak.
            </p>

            {status === "success" ? (
              <FormSuccess
                title="Thanks for the details"
                body="We're reviewing your project now and will reach out within 2 business days to schedule your consultation."
                onReset={reset}
                resetLabel="Submit another project"
              />
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                className="relative mt-8 flex flex-col gap-5"
              >
                <Honeypot />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className={LABEL}>First name *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      required
                      disabled={busy}
                      placeholder="First name"
                      onInput={() => clearError("firstName")}
                      aria-invalid={errors.firstName ? true : undefined}
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                      className={fieldClass(errors.firstName)}
                    />
                    {errors.firstName ? <FieldError id="firstName-error" message={errors.firstName} /> : null}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className={LABEL}>Last name *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      required
                      disabled={busy}
                      placeholder="Last name"
                      onInput={() => clearError("lastName")}
                      aria-invalid={errors.lastName ? true : undefined}
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                      className={fieldClass(errors.lastName)}
                    />
                    {errors.lastName ? <FieldError id="lastName-error" message={errors.lastName} /> : null}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className={LABEL}>Email address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      disabled={busy}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                      onBlur={() => {
                        const err = validateEmail(email, { required: true });
                        if (err) setErrors((prev) => ({ ...prev, email: err }));
                      }}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      placeholder="name@organization.com"
                      className={fieldClass(errors.email)}
                    />
                    {errors.email ? <FieldError id="email-error" message={errors.email} /> : null}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="organization" className={LABEL}>Organization / Company *</label>
                    <input
                      id="organization"
                      name="organization"
                      required
                      disabled={busy}
                      placeholder="Your organization or institute"
                      onInput={() => clearError("organization")}
                      aria-invalid={errors.organization ? true : undefined}
                      aria-describedby={errors.organization ? "organization-error" : undefined}
                      className={fieldClass(errors.organization)}
                    />
                    {errors.organization ? <FieldError id="organization-error" message={errors.organization} /> : null}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="jobTitle" className={LABEL}>Job title *</label>
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      required
                      disabled={busy}
                      placeholder="Your role"
                      onInput={() => clearError("jobTitle")}
                      aria-invalid={errors.jobTitle ? true : undefined}
                      aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
                      className={fieldClass(errors.jobTitle)}
                    />
                    {errors.jobTitle ? <FieldError id="jobTitle-error" message={errors.jobTitle} /> : null}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="country" className={LABEL}>Country *</label>
                    <div className="relative">
                      <select
                        id="country"
                        name="country"
                        required
                        disabled={busy}
                        value={country}
                        onChange={(e) => {
                          const name = e.target.value;
                          setCountry(name);
                          // Keep the dial code in step with the country. "Other"
                          // has no dial code, so that selection leaves it alone.
                          const match = findByName(name);
                          if (match) {
                            setPhoneCountry(match.code);
                            clearError("phone");
                          }
                        }}
                        className={`${FIELD} appearance-none pr-9`}
                      >
                        {COUNTRY_NAMES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <SelectCaret />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="areaOfInterest" className={LABEL}>Area of interest *</label>
                    <div className="relative">
                      <select id="areaOfInterest" name="areaOfInterest" defaultValue="Bone Tissue Engineering" disabled={busy} className={`${FIELD} appearance-none pr-9`}>
                        {AREAS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                      <SelectCaret />
                    </div>
                  </div>
                </div>

                <PhoneField
                  id="phone"
                  label="Phone number"
                  country={phoneCountry}
                  required
                  onCountryChange={(code) => {
                    setPhoneCountry(code);
                    clearError("phone");
                  }}
                  value={phone}
                  onChange={(next) => {
                    setPhone(next);
                    clearError("phone");
                  }}
                  onBlur={() => {
                    const err = validatePhone(phoneCountry, phone, { required: true });
                    if (err) setErrors((prev) => ({ ...prev, phone: err }));
                  }}
                  error={errors.phone}
                  disabled={busy}
                />

                {/* Timeline segmented control */}
                <div className="flex flex-col gap-2">
                  <span className={LABEL}>Expected project timeline *</span>
                  <div className="inline-flex flex-wrap gap-1.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] p-1.5">
                    {TIMELINES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        disabled={busy}
                        onClick={() => setTimeline(t)}
                        aria-pressed={timeline === t}
                        className={[
                          "h-9 rounded-lg px-4 text-[13.5px] font-medium transition-colors disabled:opacity-60",
                          timeline === t
                            ? "bg-[var(--color-brand)] text-white"
                            : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                        ].join(" ")}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className={LABEL}>Detailed message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    disabled={busy}
                    placeholder="Briefly describe your research objectives and current challenges"
                    onInput={() => clearError("message")}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={textareaClass(errors.message)}
                  />
                  {errors.message ? <FieldError id="message-error" message={errors.message} /> : null}
                </div>

                {status === "error" && error ? <FormError message={error} /> : null}

                <OriginButton
                  type="submit"
                  loading={busy}
                  disabled={busy}
                  className="mt-2 h-13 px-6 py-3.5 font-semibold"
                >
                  {busy ? "Sending…" : "Send Consultation Request"}
                </OriginButton>
              </form>
            )}
          </motion.div>

          {/* What to Expect */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="lg:sticky lg:top-28 flex flex-col gap-8"
          >
            <h3 className="font-display text-[1.4rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              What to expect?
            </h3>

            <ol className="relative flex flex-col gap-7 border-l border-[var(--color-hairline)] pl-7">
              {EXPECT.map(({ icon: Icon, title, body }) => (
                <li key={title} className="relative">
                  <span className="absolute -left-[calc(1.75rem+1px)] flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-brand-surface)]">
                    <Icon size={16} weight="duotone" className="text-[var(--color-brand-strong)]" />
                  </span>
                  <p className="text-[14.5px] font-semibold text-[var(--color-ink)]">{title}</p>
                  <p className="mt-1 text-[13.5px] text-[var(--color-ink-muted)] leading-relaxed">
                    {body}
                  </p>
                </li>
              ))}
            </ol>

            {/* Did you know */}
            <div className="flex gap-4 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-brand-subtle)] p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                <Lightbulb size={20} weight="duotone" className="text-[var(--color-brand-strong)]" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[13.5px] font-semibold text-[var(--color-ink)]">Did you know?</p>
                <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
                  Implementing the right scaffold architecture can reduce
                  experimental variability by up to 45% in complex cell cultures.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
