/**
 * uploadValidation — client-side checks vóór Cloudflare upload.
 *
 * - Bestandsgrootte (warn > 10 MB, hard limit info)
 * - Naamconventie hoogmolen-verblijf-<naam>-<detail>-<index>.<ext>
 * - HTTP-error → human-readable tip
 */

export const MAX_RECOMMENDED_BYTES = 10 * 1024 * 1024; // 10 MB
export const NAME_CONVENTION_REGEX =
  /^hoogmolen-verblijf-[a-z0-9]+(?:-[a-z0-9]+)*-\d{2}\.(jpe?g|png|webp)$/i;

export interface PreflightResult {
  ok: boolean;
  warning?: string;
  error?: string;
}

/** Snel preflight-onderzoek vóór de daadwerkelijke upload. */
export const preflightFile = (file: File): PreflightResult => {
  if (file.size > MAX_RECOMMENDED_BYTES) {
    return {
      ok: false,
      error: `Bestand is ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum is 10 MB — verklein eerst (ideaal < 2 MB).`,
    };
  }

  if (!NAME_CONVENTION_REGEX.test(file.name)) {
    return {
      ok: true,
      warning: `Naam "${file.name}" volgt niet de conventie hoogmolen-verblijf-<naam>-<detail>-<NN>.jpg. Upload kan slagen, maar sortering in de Storyteller kan afwijken.`,
    };
  }

  return { ok: true };
};

/** Map een HTTP-status naar een gerichte gebruikerstip. */
export const tipForStatus = (status: number): string => {
  if (status === 413)
    return "Bestand te groot. Verklein de afbeelding naar < 2 MB voor optimale prestaties.";
  if (status === 400)
    return "Naamfout of ID al in gebruik. Controleer of de bestandsnaam uniek is.";
  if (status === 401 || status === 403)
    return "Authenticatiefout. Log opnieuw in of controleer de Cloudflare Worker configuratie.";
  if (status >= 500)
    return "Serverfout. Controleer de Cloudflare Worker configuratie of probeer opnieuw.";
  return "Onbekende fout. Controleer de console voor details.";
};
