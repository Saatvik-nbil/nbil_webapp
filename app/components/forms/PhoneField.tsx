"use client";

import { COUNTRIES } from "@/lib/countries";
import { FIELD, FieldError, LABEL, SelectCaret, fieldClass } from "./fields";

/**
 * Phone input with a country dial-code select.
 *
 * The two halves are separate controls rather than one masked input: a masked
 * field fights every paste format people actually use, while a plain number box
 * plus an explicit country is unambiguous to fill and to read back.
 */
export default function PhoneField({
  id,
  label = "Phone",
  country,
  onCountryChange,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  required,
}: {
  id: string;
  label?: string;
  /** ISO country code driving the dial code and the length rule. */
  country: string;
  onCountryChange: (code: string) => void;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL}>
        {label}
        {required ? " *" : ""}
      </label>

      <div className="grid grid-cols-[9.5rem_1fr] gap-2">
        <div className="relative">
          <label htmlFor={`${id}-country`} className="sr-only">
            Country code
          </label>
          <select
            id={`${id}-country`}
            value={country}
            disabled={disabled}
            onChange={(e) => onCountryChange(e.target.value)}
            className={`${FIELD} appearance-none pr-8 truncate`}
          >
            {COUNTRIES.map((c) => (
              // Codes repeat across countries (+1 is US and Canada), so the
              // ISO code is the option value, not the dial code.
              <option key={c.code} value={c.code}>
                {c.name} {c.dial}
              </option>
            ))}
          </select>
          <SelectCaret />
        </div>

        <input
          id={id}
          name={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          disabled={disabled}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder="Phone number"
          className={fieldClass(error)}
        />
      </div>

      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}
