/**
 * Email and phone validation shared by the browser and the API route.
 *
 * Both sides run the same functions: the client for inline feedback, the server
 * because client-side checks are a convenience, not a control. Every function
 * returns an error message or `null`, so callers read as `const err = check(x)`.
 */

import { getCountry } from "./countries";

/* -------------------------------------------------------------------------- */
/* Email                                                                       */
/* -------------------------------------------------------------------------- */

// Deliberately not RFC 5322. That grammar permits addresses no mail provider
// accepts, and the strict regex for it is unreadable. This covers what real
// addresses look like and rejects the mistakes people actually make.
const EMAIL_RE =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,63}$/;

export function validateEmail(raw: string, { required = true } = {}): string | null {
  const value = raw.trim();

  if (!value) return required ? "Email address is required." : null;
  if (value.length > 254) return "That email address is too long.";

  const at = value.indexOf("@");
  if (at === -1) return "Enter a valid email address, including the @.";
  if (value.indexOf("@", at + 1) !== -1) return "An email address can only contain one @.";

  const [local, domain] = [value.slice(0, at), value.slice(at + 1)];

  if (!local) return "Add the part before the @.";
  if (local.length > 64) return "The part before the @ is too long.";
  if (!domain) return "Add the domain after the @.";
  if (!domain.includes(".")) return "The domain needs a dot, like example.com.";
  if (value.includes("..")) return "Remove the double dot.";
  if (local.startsWith(".") || local.endsWith(".")) {
    return "The part before the @ can't start or end with a dot.";
  }
  if (domain.startsWith("-") || domain.endsWith("-") || domain.startsWith(".")) {
    return "That domain doesn't look right.";
  }
  if (!EMAIL_RE.test(value)) return "That doesn't look like a valid email address.";

  return null;
}

/* -------------------------------------------------------------------------- */
/* Phone                                                                       */
/* -------------------------------------------------------------------------- */

/** Everything that isn't a digit. */
function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Reduces whatever the user typed to a bare national number.
 *
 * People paste numbers in every shape: `+91 98765 43210`, `098765-43210`,
 * `(555) 010-9999`. This strips formatting, then the dial code and any trunk
 * `0`, so the length check below sees a comparable number regardless.
 */
export function normalizeNational(countryCode: string, raw: string): string {
  const country = getCountry(countryCode);
  let digits = digitsOnly(raw);
  if (!country) return digits;

  const dial = digitsOnly(country.dial);

  // Typed with the country code in front of the national number.
  if (dial && digits.startsWith(dial) && digits.length > country.max) {
    digits = digits.slice(dial.length);
  }

  // Domestic trunk prefix, e.g. 098765 43210 in India or 07700 900000 in the UK.
  if (digits.startsWith("0") && digits.length > country.max) {
    digits = digits.replace(/^0+/, "");
  }

  return digits;
}

export function validatePhone(
  countryCode: string,
  raw: string,
  { required = false } = {},
): string | null {
  const value = raw.trim();
  if (!value) return required ? "Phone number is required." : null;

  if (/[A-Za-z]/.test(value)) return "A phone number can't contain letters.";

  const country = getCountry(countryCode);
  const national = normalizeNational(countryCode, value);

  if (!national) return "Enter a phone number.";

  // Unknown country: fall back to the ITU E.164 range.
  if (!country) {
    if (national.length < 4 || national.length > 15) {
      return "That phone number doesn't look right.";
    }
    return null;
  }

  if (national.length < country.min || national.length > country.max) {
    const expected =
      country.min === country.max
        ? `${country.min} digits`
        : `${country.min}–${country.max} digits`;
    // Phrased with a plural subject so no country name needs an a/an article.
    return `${country.name} numbers need ${expected}. You entered ${national.length}.`;
  }

  if (country.prefix && !country.prefix.test(national)) {
    return country.prefixHint ?? `That doesn't look like a valid ${country.name} number.`;
  }

  return null;
}

/** Assembles the value stored in the sheet, e.g. `+91 9876543210`. */
export function formatPhone(countryCode: string, raw: string): string {
  const value = raw.trim();
  if (!value) return "";

  const country = getCountry(countryCode);
  const national = normalizeNational(countryCode, value);
  if (!national) return "";

  return country ? `${country.dial} ${national}` : national;
}
