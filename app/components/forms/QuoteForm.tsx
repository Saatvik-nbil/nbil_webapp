"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { OriginButton } from "@/components/ui/origin-button";
import { machines } from "@/lib/machines";
import { DEFAULT_COUNTRY } from "@/lib/countries";
import { formatPhone, validateEmail, validatePhone } from "@/lib/validation";
import {
  FieldError,
  FormError,
  FormSuccess,
  Honeypot,
  LABEL,
  SelectCaret,
  fieldClass,
  textareaClass,
} from "./fields";
import PhoneField from "./PhoneField";
import BrandDots from "@/app/components/shared/BrandDots";
import { readField, useFormSubmit } from "./useFormSubmit";

const INTERESTS = ["Request a quote", "Book a live demo", "Custom configuration", "General enquiry"];

const DEMO = "Book a live demo";
const CONFIGURE = "Custom configuration";

/** Only the models offered build-to-spec. Aura is not one of them, so it is
 *  absent from the model list whenever the enquiry is a configuration. */
const CONFIGURABLE = machines.filter((m) => m.customisation);

const NOT_SURE = "Not sure yet";

type Errors = Record<string, string>;

/**
 * Quote / demo request form used by `ContactSection`. Replaces the former
 * HubSpot embed: submissions go to `/api/forms` → Google Sheets.
 *
 * Every field is required, so a row in the sheet is never half-filled.
 *
 * `defaultModel` preselects a bioprinter, so the form on a machine page arrives
 * already scoped to that model.
 */
export default function QuoteForm({ defaultModel }: { defaultModel?: string }) {
  const { status, error, submit, reset } = useFormSubmit("quote");
  const formRef = useRef<HTMLFormElement>(null);
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [model, setModel] = useState(defaultModel ?? NOT_SURE);
  const [wanted, setWanted] = useState<string[]>([]);
  /* Set after hydration: a build-time "today" baked into the static HTML
     would be stale by the time anyone loads the page. */
  const [today, setToday] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<Errors>({});

  const busy = status === "submitting";

  const booking = interest === DEMO;
  const configuring = interest === CONFIGURE;
  const modelOptions = configuring ? CONFIGURABLE : machines;
  const selected = machines.find((m) => m.name === model);
  const configOptions = selected?.customisation?.options ?? [];
  const showOptions = (booking || configuring) && configOptions.length > 0;

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  /** Switching enquiry type can strand a model or an option that no longer
   *  applies, so both are cleared rather than submitted silently. */
  function chooseInterest(next: string) {
    setInterest(next);
    setWanted([]);
    if (next === CONFIGURE && !CONFIGURABLE.some((m) => m.name === model)) {
      setModel(NOT_SURE);
    }
  }

  /** Drops one field's error the moment the visitor starts correcting it. */
  function clearError(key: string) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const name = readField(data, "name");
    const organization = readField(data, "organization");
    const message = readField(data, "message");

    const found: Errors = {};
    if (!name) found.name = "Your name is required.";

    const emailError = validateEmail(email, { required: true });
    if (emailError) found.email = emailError;

    const phoneError = validatePhone(phoneCountry, phone, { required: true });
    if (phoneError) found.phone = phoneError;

    if (!organization) found.organization = "Your organization is required.";
    if (!message) found.message = "Please tell us what you need.";
    if (booking && !readField(data, "demoDate")) {
      found.demoDate = "Pick a date that suits you.";
    }

    if (Object.keys(found).length) {
      setErrors(found);
      // Send focus to the first problem so the fix is one keystroke away, even
      // when the offending field has scrolled out of view.
      const first = ["name", "email", "phone", "organization", "demoDate", "message"].find((k) => found[k]);
      if (first) {
        formRef.current
          ?.querySelector<HTMLElement>(`#quote-${first}`)
          ?.focus({ preventScroll: false });
      }
      return;
    }

    setErrors({});

    const ok = await submit(
      [
        { label: "Name", value: name, required: true },
        { label: "Work Email", value: email, type: "email", required: true },
        {
          label: "Phone",
          value: formatPhone(phoneCountry, phone),
          type: "phone",
          country: phoneCountry,
          required: true,
        },
        { label: "Organization", value: organization, required: true },
        { label: "Model of Interest", value: model, required: true },
        { label: "Enquiry Type", value: interest, required: true },
        ...(booking
          ? [{ label: "Preferred Demo Date", value: readField(data, "demoDate"), required: true }]
          : []),
        ...(wanted.length
          ? [{ label: configuring ? "Options to Configure" : "Wants to See", value: wanted.join(", ") }]
          : []),
        { label: "Message", value: message, required: true },
      ],
      readField(data, "company_website"),
    );

    if (ok) {
      formRef.current?.reset();
      setEmail("");
      setPhone("");
      setPhoneCountry(DEFAULT_COUNTRY);
      setInterest(INTERESTS[0]);
      setModel(defaultModel ?? NOT_SURE);
      setWanted([]);
      setErrors({});
    }
  }

  if (status === "success") {
    return (
      <FormSuccess
        title="Thanks, request received"
        body="Someone from the NBIL team will follow up within 2 business days with pricing and next steps for your lab."
        onReset={reset}
        resetLabel="Send another request"
      />
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-4">
      <BrandDots className="mb-1" />
      <Honeypot />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quote-name" className={LABEL}>
          Full name *
        </label>
        <input
          id="quote-name"
          name="name"
          required
          autoComplete="name"
          disabled={busy}
          onInput={() => clearError("name")}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "quote-name-error" : undefined}
          placeholder="Your full name"
          className={fieldClass(errors.name)}
        />
        {errors.name ? <FieldError id="quote-name-error" message={errors.name} /> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quote-email" className={LABEL}>
          Work email *
        </label>
        <input
          id="quote-email"
          name="email"
          type="email"
          required
          autoComplete="email"
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
          aria-describedby={errors.email ? "quote-email-error" : undefined}
          placeholder="name@organization.com"
          className={fieldClass(errors.email)}
        />
        {errors.email ? <FieldError id="quote-email-error" message={errors.email} /> : null}
      </div>

      <PhoneField
        id="quote-phone"
        required
        country={phoneCountry}
        onCountryChange={(code) => {
          setPhoneCountry(code);
          // The length rule just changed, so any existing verdict is stale.
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quote-organization" className={LABEL}>
          Organization *
        </label>
        <input
          id="quote-organization"
          name="organization"
          required
          autoComplete="organization"
          disabled={busy}
          onInput={() => clearError("organization")}
          aria-invalid={errors.organization ? true : undefined}
          aria-describedby={errors.organization ? "quote-organization-error" : undefined}
          placeholder="Your organization or institute"
          className={fieldClass(errors.organization)}
        />
        {errors.organization ? (
          <FieldError id="quote-organization-error" message={errors.organization} />
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quote-model" className={LABEL}>
          Model of interest *
        </label>
        <div className="relative">
          <select
            id="quote-model"
            name="model"
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={busy}
            className={`${fieldClass()} appearance-none pr-9`}
          >
            {/* A deliberate answer, not a blank: "not sure" is useful to know. */}
            <option value={NOT_SURE}>{NOT_SURE}</option>
            {modelOptions.map((m) => (
              <option key={m.slug} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <SelectCaret />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className={LABEL}>What do you need? *</span>
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] p-1.5">
          {INTERESTS.map((option) => (
            <button
              key={option}
              type="button"
              disabled={busy}
              onClick={() => chooseInterest(option)}
              aria-pressed={interest === option}
              className={[
                "h-9 rounded-lg px-3.5 text-[13px] font-medium transition-colors disabled:opacity-60",
                interest === option
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
              ].join(" ")}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Only a demo needs a date, and only a configurable model has options
          worth ticking, so both appear once the enquiry type asks for them. */}
      {booking ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quote-demoDate" className={LABEL}>
            Preferred date *
          </label>
          <input
            id="quote-demoDate"
            name="demoDate"
            type="date"
            min={today || undefined}
            disabled={busy}
            onChange={() => clearError("demoDate")}
            aria-invalid={errors.demoDate ? true : undefined}
            aria-describedby={errors.demoDate ? "quote-demoDate-error" : undefined}
            className={fieldClass(errors.demoDate)}
          />
          {errors.demoDate ? (
            <FieldError id="quote-demoDate-error" message={errors.demoDate} />
          ) : null}
        </div>
      ) : null}

      {showOptions ? (
        <div className="flex flex-col gap-2">
          <span className={LABEL}>
            {configuring
              ? `What would you like to configure on the ${selected?.name}?`
              : `Anything in particular you would like to see on the ${selected?.name}?`}
          </span>
          <div className="flex flex-col gap-2">
            {configOptions.map((option) => {
              const picked = wanted.includes(option);
              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] p-3 text-[13.5px] text-[var(--color-ink-muted)] leading-relaxed has-[:checked]:border-[var(--color-brand)] has-[:checked]:bg-[var(--color-brand-subtle)]"
                >
                  <input
                    type="checkbox"
                    checked={picked}
                    disabled={busy}
                    onChange={() =>
                      setWanted((prev) =>
                        picked ? prev.filter((o) => o !== option) : [...prev, option],
                      )
                    }
                    className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand)]"
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quote-message" className={LABEL}>
          Message *
        </label>
        <textarea
          id="quote-message"
          name="message"
          rows={3}
          required
          disabled={busy}
          onInput={() => clearError("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "quote-message-error" : undefined}
          placeholder="Tell us about your application, throughput and timeline"
          className={textareaClass(errors.message)}
        />
        {errors.message ? <FieldError id="quote-message-error" message={errors.message} /> : null}
      </div>

      {status === "error" && error ? <FormError message={error} /> : null}

      <OriginButton type="submit" loading={busy} disabled={busy} className="mt-1 h-12 px-6 font-semibold">
        {busy ? "Sending…" : "Send request"}
      </OriginButton>
    </form>
  );
}
