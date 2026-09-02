# Website forms → Google Sheets

Every lead-capture form on the site posts to one place and lands in one
spreadsheet, with an email notification per submission. HubSpot is no longer
used anywhere.

## How it works

```
Browser form  →  POST /api/forms  →  Google Apps Script /exec  →  Google Sheet
   (client)        (Next.js server)        (your Google account)      + email
```

The Next.js route in the middle is deliberate: it keeps the script URL out of
the browser, avoids Apps Script's awkward CORS behaviour, and gives one place
for validation, the honeypot check, and rate limiting.

## Files

| File | Role |
| --- | --- |
| `lib/forms.ts` | Form registry (`FORMS`) and shared payload types |
| `lib/countries.ts` | Dial codes and per-country phone length rules |
| `lib/validation.ts` | Email + phone validators, shared by client and server |
| `app/components/forms/PhoneField.tsx` | Phone input with country dial-code select |
| `app/api/forms/route.ts` | Validates and forwards submissions |
| `app/components/forms/useFormSubmit.ts` | Client hook: submit + status |
| `app/components/forms/fields.tsx` | Shared field styles, honeypot, success/error UI |
| `app/components/forms/QuoteForm.tsx` | Quote / demo form (in `ContactSection`) |
| `app/components/consultancy/ProjectForm.tsx` | Consultation form |
| `app/components/chatbot/NBILBot.tsx` | NBIL Assistant chat widget (nav helper + conversational lead form) |
| `google-apps-script/Code.gs` | The script to paste into Apps Script |

## Current forms

| Form id | Sheet tab | Where it appears |
| --- | --- | --- |
| `quote` | `Quote Requests` | Home, `/trivima`, `/machines/[slug]` (via `ContactSection`) |
| `consultation` | `Consultation Requests` | `/consultancy` |
| `chatbot` | `Chatbot Leads` | Every page (via `NBILBot`, the bottom-right chat widget in the root layout) |

---

## One-time setup

### 1. Create the spreadsheet

New Google Sheet, named e.g. **NBIL Website Leads**. You do not need to create
tabs or headers — the script creates them on the first submission of each form.

### 2. Add the script

From that spreadsheet: **Extensions → Apps Script**. Delete the stub
`Code.gs` contents and paste all of `google-apps-script/Code.gs`. Save.

Opening the editor from the spreadsheet is what binds the script to it —
`SpreadsheetApp.getActiveSpreadsheet()` then resolves to your sheet with no ID
to configure.

### 3. Edit `CONFIG` at the top of the script

```js
NOTIFY_EMAIL:   'support@nextbiginnovationlabs.com',  // where alerts go
NOTIFY_CC:      '',                                   // optional
SHARED_SECRET:  '',                                   // see step 6
SEND_AUTOREPLY: false,                                // auto-ack the submitter
```

### 4. Authorise it

In the Apps Script editor, pick the `testSubmission` function and press **Run**.
Google asks for permission the first time:

- **Review permissions → pick your account**
- "Google hasn't verified this app" → **Advanced → Go to (project name)**
- **Allow** (spreadsheet access + send email as you)

A `Quote Requests` tab with one test row should appear, and the notification
email should arrive. Delete the test row afterwards.

### 5. Deploy as a web app

**Deploy → New deployment → gear icon → Web app**

| Setting | Value |
| --- | --- |
| Description | `NBIL forms v1` |
| Execute as | **Me (your account)** |
| Who has access | **Anyone** |

"Anyone" means anyone who knows the URL can POST — it does **not** make the
spreadsheet public. Set `SHARED_SECRET` (step 6) if you want the endpoint
locked down further.

Copy the **Web app URL**, ending in `/exec`.

### 6. Optional: shared secret

In the script, set `SHARED_SECRET: 'some-long-random-string'`, redeploy
(step 8), and put the same value in `GOOGLE_SCRIPT_SECRET`. The script then
rejects any request that doesn't carry it.

### 7. Point the site at it

Local development — create `nbil_webapp/.env.local` (git-ignored):

```
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
GOOGLE_SCRIPT_SECRET=
```

Restart `npm run dev` — env vars are read at boot.

Production (Render) — **Dashboard → your service → Environment → Add
Environment Variable**, same two keys, then **Save changes**. Render redeploys
automatically.

### 8. Redeploying after script edits

Changes to the script are **not** live until you redeploy:

**Deploy → Manage deployments → pencil icon → Version: New version → Deploy**

Use *Manage deployments* rather than *New deployment* — it keeps the same
`/exec` URL, so the env var stays valid.

---

## Validation

`lib/validation.ts` holds the rules, and **both sides run them**: the browser for
inline feedback as you type, and `app/api/forms/route.ts` again on arrival,
because a client-side check is a courtesy to the user, not a control.

Fields opt in by declaring a `type` when the form builds its payload:

```ts
{ label: "Work Email", value: email, type: "email", required: true }
{ label: "Phone", value: formatPhone(iso, phone), type: "phone", country: iso }
```

Untyped fields are free text, checked only for length and — when marked
`required: true` — for being non-empty.

**Every field on both forms is required.** A row in the sheet is therefore
never half-filled. The client blocks submission and focuses the first offending
field; the server rejects with a 400 naming the field.

**Email** is checked for shape, not deliverability — one `@`, a dotted domain, a
2+ character TLD, no doubled or edge dots, sane length. It is deliberately not
RFC 5322: that grammar admits addresses no mail provider accepts, and its regex
is unmaintainable.

**Phone** is checked against the selected country. `normalizeNational()` first
strips formatting, the dial code, and any trunk `0`, so `+91 98765 43210`,
`098765-43210` and `9876543210` all validate identically and store as
`+91 9876543210`. Length ranges live in `lib/countries.ts` and lean generous —
turning away a real customer costs more than accepting an odd number. A few
countries also pin the leading digits (India 6-9, Singapore 6/8/9, NANP area
codes) with a `prefixHint` explaining the rule.

Phone defaults to **India (+91)**. On the consultancy form the Country select
drives the dial code, so changing country updates it; picking "Other" leaves it
untouched, since that entry has no dial code.

To add a country, append to `COUNTRIES` in `lib/countries.ts`. Nothing else
needs to change — both selects and the server rule read from that array.

---

## Adding another form

1. Add an id to `FORM_IDS` and an entry to `FORMS` in `lib/forms.ts`:

   ```ts
   export const FORM_IDS = ["quote", "consultation", "careers"] as const;

   careers: { sheet: "Job Applications", subject: "New job application" },
   ```

2. Build the form component with `useFormSubmit("careers")` and the primitives
   in `app/components/forms/fields.tsx` — copy `QuoteForm.tsx` as the template.

No Apps Script or API-route change is needed. The script creates the tab on
first submission and derives columns from the field labels you send.

**Field labels are the sheet's column headers.** Renaming a label adds a new
column rather than renaming the old one, so treat labels as stable identifiers.

---

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| "Form delivery is not configured." | `GOOGLE_SCRIPT_URL` unset, or the dev server wasn't restarted after adding it |
| "We couldn't record your submission." | Check the server logs. Non-JSON from Apps Script usually means *Who has access* is not **Anyone** (Google returned a login page) |
| Rows appear, no email | Gmail's daily `MailApp` quota (100/day on a free account, 1500 on Workspace). The row is still saved — mail is best-effort by design |
| Script edits have no effect | You deployed a new *deployment* instead of a new *version*, or didn't redeploy at all (step 8) |
| Nothing arrives at all | Open the `/exec` URL in a browser: it should print `{"ok":true,"status":"NBIL form endpoint is running"}` |

Apps Script execution logs: **Apps Script editor → Executions** (left sidebar).
