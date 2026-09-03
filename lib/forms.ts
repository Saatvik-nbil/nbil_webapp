/**
 * Shared contract for every lead-capture form on the site.
 *
 * Forms post to `/api/forms`, which validates the payload and forwards it to a
 * Google Apps Script web app. The script appends a row to a Google Sheet tab
 * (one tab per form) and emails a notification. Adding a new form is a matter
 * of adding an entry to `FORMS` below and rendering the fields, with no server or
 * Apps Script change required.
 */

export const FORM_IDS = ["quote", "consultation", "chatbot"] as const;

export type FormId = (typeof FORM_IDS)[number];

export type FormDefinition = {
  /** Sheet tab name the Apps Script writes into. Keep stable: renaming it
   *  makes the script create a fresh, empty tab. */
  sheet: string;
  /** Used as the notification email subject. */
  subject: string;
};

export const FORMS: Record<FormId, FormDefinition> = {
  quote: {
    sheet: "Quote Requests",
    subject: "New quote / demo request",
  },
  consultation: {
    sheet: "Consultation Requests",
    subject: "New consultation request",
  },
  chatbot: {
    sheet: "Chatbot Leads",
    subject: "New chatbot lead",
  },
};

/** One answer. `label` becomes the sheet column header, so keep labels stable. */
export type FormField = {
  label: string;
  value: string;
  /** Tells the API route how to validate. Untyped fields are free text. */
  type?: "email" | "phone";
  /** ISO country code for `type: "phone"`, so the server can apply the same
   *  per-country rule the client used. */
  country?: string;
  /** Whether an empty value should be rejected. */
  required?: boolean;
};

export type FormSubmission = {
  formId: FormId;
  fields: FormField[];
  /** Honeypot. Bots fill it, humans never see it, and a non-empty value is dropped. */
  company_website?: string;
};

/** Payload the API route forwards to Apps Script. */
export type FormForwardPayload = {
  formId: FormId;
  sheet: string;
  subject: string;
  fields: FormField[];
  /** Mirrors SHARED_SECRET in the Apps Script; omitted when unset. */
  secret?: string;
  meta: {
    submittedAt: string;
    page: string;
    userAgent: string;
  };
};

export function isFormId(value: unknown): value is FormId {
  return typeof value === "string" && (FORM_IDS as readonly string[]).includes(value);
}

/** Field caps, mirrored on the client so long input fails before the network. */
export const LIMITS = {
  maxFields: 40,
  maxLabel: 120,
  maxValue: 5000,
} as const;
