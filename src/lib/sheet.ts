/**
 * Reads what the Apps Script web app answered and names the cause in plain
 * words. Google returns HTML, not JSON, for every misconfiguration, and the
 * HTML says which one it is. Pure, so it can be tested without a network.
 */

export type SheetDiagnosis = {
  /** Machine-readable cause. */
  code:
    | "ok"
    | "old-script"
    | "bad-secret"
    | "not-public"
    | "not-authorized"
    | "not-deployed"
    | "not-found"
    | "html"
    | "unknown";
  /** One sentence for the person fixing it. */
  fix: string;
  /** The parsed JSON when Google returned some. */
  json?: { ok?: boolean; error?: string; orderNumber?: string; version?: number };
};

export function diagnoseSheetResponse(status: number, text: string): SheetDiagnosis {
  let json: SheetDiagnosis["json"];
  try {
    const parsed = JSON.parse(text) as unknown;
    if (parsed && typeof parsed === "object") json = parsed as SheetDiagnosis["json"];
  } catch {
    /* not JSON */
  }

  if (json) {
    if (json.ok === false && /unauthorized/i.test(json.error ?? "")) {
      return {
        code: "bad-secret",
        fix: "The script's SECRET property doesn't match ORDERS_WEBHOOK_SECRET in Vercel.",
        json,
      };
    }
    if (json.ok === false) {
      return { code: "unknown", fix: `The script threw: ${json.error ?? "unknown error"}.`, json };
    }
    if (json.ok === true && json.version == null && json.orderNumber == null) {
      return {
        code: "old-script",
        fix: "The deployed script is an old version. Paste the current google/Code.gs and deploy a new version.",
        json,
      };
    }
    return { code: "ok", fix: "", json };
  }

  const t = text.slice(0, 4000);
  if (/accounts\.google\.com|ServiceLogin|Sign in/i.test(t)) {
    return {
      code: "not-public",
      fix: 'The web app deployment isn\'t public. Deploy → Manage deployments → edit → "Who has access: Anyone" (not "Anyone with Google account").',
    };
  }
  if (/Authorization is required|authorization|has not been authorized/i.test(t)) {
    return {
      code: "not-authorized",
      fix: "The script hasn't been authorized. Run doGet once from the editor and allow the Sheets and Drive permissions (Advanced → Go to project).",
    };
  }
  if (/Script function not found|doPost|doGet/i.test(t)) {
    return {
      code: "not-deployed",
      fix: "The URL points at a version without doPost/doGet. Deploy → New deployment (or bump the version) and use the /exec URL, not /dev.",
    };
  }
  if (status === 404 || /Page Not Found|Sorry, unable to open the file/i.test(t)) {
    return {
      code: "not-found",
      fix: "ORDERS_WEBHOOK_URL doesn't point at a live web app. Copy the /exec URL from Deploy → Manage deployments.",
    };
  }
  if (/<html|<!doctype/i.test(t)) {
    return { code: "html", fix: "Google returned a page instead of JSON. Open ORDERS_WEBHOOK_URL in a browser to see it." };
  }
  return { code: "unknown", fix: `Unexpected reply (HTTP ${status}).` };
}

/** Only the text of an HTML reply, for logs and the health check. */
export function snippet(text: string, max = 200): string {
  return text.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}
