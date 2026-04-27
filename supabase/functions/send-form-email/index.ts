// Resend email handler for Contact + Groepsverblijf formulieren
// Deno Edge Function — public (verify_jwt=false)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// Verzendadres MOET op het geverifieerde subdomein staan (mail.hoogmolen.be)
// Antwoorden gaan via reply_to naar de normale mailbox info@hoogmolen.be
const FROM = "Landgoed De Hoogmolen <info@mail.hoogmolen.be>";
const TO_INTERNAL = "info@hoogmolen.be";

interface FormPayload {
  formType: "contact" | "groepsverblijf" | "vergader";
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  // groepsverblijf-specific
  org?: string;
  guests?: string | number;
  arrival?: string;
  departure?: string;
  occasion?: string;
  // vergader-specific
  firstName?: string;
  lastName?: string;
  address?: string;
  formule?: string;
}

// ----- Validation -----
function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function clean(v: unknown, max = 2000): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ----- Luxe HTML template (beige + Cormorant) -----
function buildEmailHtml(opts: {
  title: string;
  intro: string;
  rows: Array<[string, string]>;
  message?: string;
}): string {
  const rowsHtml = opts.rows
    .filter(([, v]) => v && v.trim() !== "")
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #E4E8BA;font-family:Georgia,serif;color:#4B4C1B;font-size:13px;width:38%;background:#F5F6EA;">${escapeHtml(k)}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #E4E8BA;font-family:Arial,sans-serif;color:#1f2010;font-size:14px;">${escapeHtml(v)}</td>
        </tr>`,
    )
    .join("");

  const msgBlock = opts.message
    ? `
    <tr>
      <td colspan="2" style="padding:18px 16px;background:#FFFFFF;">
        <div style="font-family:Georgia,serif;color:#4B4C1B;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Bericht</div>
        <div style="font-family:Arial,sans-serif;color:#1f2010;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(opts.message)}</div>
      </td>
    </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(opts.title)}</title></head>
<body style="margin:0;padding:0;background:#EDEEE4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDEEE4;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E4E8BA;border-radius:4px;overflow:hidden;">
        <tr>
          <td style="background:#4B4C1B;padding:28px 24px;text-align:center;">
            <div style="font-family:Georgia,serif;color:#F5F6EA;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Landgoed</div>
            <div style="font-family:Georgia,serif;color:#FFFFFF;font-size:28px;font-weight:400;letter-spacing:1px;">De Hoogmolen</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 28px 8px;">
            <h1 style="margin:0 0 12px;font-family:Georgia,serif;color:#4B4C1B;font-size:22px;font-weight:400;">${escapeHtml(opts.title)}</h1>
            <p style="margin:0 0 20px;font-family:Arial,sans-serif;color:#5a5a4a;font-size:14px;line-height:1.6;">${escapeHtml(opts.intro)}</p>
          </td>
        </tr>
        <tr><td style="padding:0 28px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E4E8BA;border-radius:4px;overflow:hidden;">
            ${rowsHtml}
            ${msgBlock}
          </table>
        </td></tr>
        <tr><td style="padding:24px 28px 32px;text-align:center;">
          <p style="margin:0;font-family:Arial,sans-serif;color:#7d7d6a;font-size:12px;line-height:1.6;">
            Hoogmolenweg 15 · 3670 Oudsbergen (Ellikom) · België<br>
            +32 (0)11 90 11 00 · <a href="mailto:info@hoogmolen.be" style="color:#7D8334;text-decoration:none;">info@hoogmolen.be</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function sendResend(payload: {
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      reply_to: payload.reply_to,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${text}`);
  }
  return text;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY ontbreekt");
    }

    const raw = (await req.json()) as FormPayload;
    const formType =
      raw.formType === "groepsverblijf"
        ? "groepsverblijf"
        : raw.formType === "vergader"
        ? "vergader"
        : "contact";

    const name = clean(raw.name, 120);
    const email = clean(raw.email, 200);
    const phone = clean(raw.phone, 60);
    if (!name || !email || !isEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Naam en geldig e-mailadres zijn verplicht." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let internalSubject = "";
    let internalHtml = "";
    let confirmSubject = "";
    let confirmHtml = "";

    if (formType === "groepsverblijf") {
      const org = clean(raw.org, 160);
      const guests = clean(String(raw.guests ?? ""), 10);
      const arrival = clean(raw.arrival, 30);
      const departure = clean(raw.departure, 30);
      const occasion = clean(raw.occasion, 200);
      const message = clean(raw.message, 4000);

      internalSubject = `Nieuwe groepsaanvraag — ${name}${guests ? ` (${guests} pers.)` : ""}`;
      internalHtml = buildEmailHtml({
        title: "Nieuwe groepsaanvraag",
        intro: "Er is een nieuwe aanvraag binnengekomen via het groepsverblijf-formulier.",
        rows: [
          ["Naam", name],
          ["Organisatie", org],
          ["E-mail", email],
          ["Telefoon", phone],
          ["Aantal personen", guests],
          ["Aankomst", arrival],
          ["Vertrek", departure],
          ["Aanleiding", occasion],
        ],
        message,
      });

      confirmSubject = "Bedankt voor uw groepsaanvraag — Landgoed De Hoogmolen";
      confirmHtml = buildEmailHtml({
        title: `Beste ${name}, bedankt voor uw aanvraag`,
        intro:
          "We hebben uw groepsaanvraag goed ontvangen. Binnen 24 uur ontvangt u van ons een persoonlijk voorstel op maat. Hieronder een overzicht van uw aanvraag.",
        rows: [
          ["Aantal personen", guests],
          ["Aankomst", arrival],
          ["Vertrek", departure],
          ["Aanleiding", occasion],
        ],
        message,
      });
    } else if (formType === "vergader") {
      const org = clean(raw.org, 160);
      const guests = clean(String(raw.guests ?? ""), 10);
      const arrival = clean(raw.arrival, 30);
      const departure = clean(raw.departure, 30);
      const address = clean(raw.address, 250);
      const formule = clean(raw.formule, 200);
      const message = clean(raw.message, 4000);

      internalSubject = `Nieuwe vergaderaanvraag — ${name}${guests ? ` (${guests} pers.)` : ""}`;
      internalHtml = buildEmailHtml({
        title: "Nieuwe vergaderaanvraag",
        intro: "Er is een nieuwe offerte-aanvraag binnengekomen via het vergaderformulier.",
        rows: [
          ["Naam", name],
          ["Bedrijf", org],
          ["E-mail", email],
          ["Telefoon", phone],
          ["Adres", address],
          ["Aantal personen", guests],
          ["Datum van", arrival],
          ["Datum tot", departure],
          ["Formule", formule],
        ],
        message,
      });

      confirmSubject = "Bedankt voor uw vergaderaanvraag — Landgoed De Hoogmolen";
      confirmHtml = buildEmailHtml({
        title: `Beste ${name}, bedankt voor uw aanvraag`,
        intro:
          "We hebben uw vergaderaanvraag goed ontvangen. Binnen 24 uur ontvangt u van ons een persoonlijk voorstel op maat. Hieronder een overzicht van uw aanvraag.",
        rows: [
          ["Bedrijf", org],
          ["Aantal personen", guests],
          ["Datum van", arrival],
          ["Datum tot", departure],
          ["Formule", formule],
        ],
        message,
      });
    } else {
      const subject = clean(raw.subject, 200);
      const message = clean(raw.message, 4000);
      if (!message) {
        return new Response(
          JSON.stringify({ error: "Een bericht is verplicht." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      internalSubject = `Nieuw contactbericht — ${name}${subject ? ` · ${subject}` : ""}`;
      internalHtml = buildEmailHtml({
        title: "Nieuw contactbericht",
        intro: "Er is een nieuw bericht binnengekomen via het contactformulier.",
        rows: [
          ["Naam", name],
          ["E-mail", email],
          ["Telefoon", phone],
          ["Onderwerp", subject],
        ],
        message,
      });

      confirmSubject = "Bedankt voor uw bericht — Landgoed De Hoogmolen";
      confirmHtml = buildEmailHtml({
        title: `Beste ${name}, bedankt voor uw bericht`,
        intro:
          "We hebben uw bericht goed ontvangen en nemen binnen 24 uur contact met u op. Hieronder vindt u een kopie van uw aanvraag.",
        rows: [["Onderwerp", subject]],
        message,
      });
    }

    // Internal notification → info@hoogmolen.be, reply-to klant
    await sendResend({
      to: [TO_INTERNAL],
      subject: internalSubject,
      html: internalHtml,
      reply_to: email,
    });

    // Confirmation → klant, reply-to info@hoogmolen.be
    await sendResend({
      to: [email],
      subject: confirmSubject,
      html: confirmHtml,
      reply_to: TO_INTERNAL,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-form-email error:", err);
    const msg = err instanceof Error ? err.message : "Onbekende fout";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
