import { createHash } from "node:crypto";

const ALLOWED_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "Lead",
  "Contact",
  "InitiateCheckout",
  "ScrollDepth",
  "FAQOpen",
  "GuaranteeViewed",
]);

type CapiBody = {
  eventName?: unknown;
  eventId?: unknown;
  eventTime?: unknown;
  eventSourceUrl?: unknown;
  params?: unknown;
  consent?: unknown;
  anonymousId?: unknown;
  fbp?: unknown;
  fbc?: unknown;
  attribution?: unknown;
};

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function cleanString(value: unknown, max = 500): string | undefined {
  return typeof value === "string" && value.length > 0 && value.length <= max
    ? value
    : undefined;
}

function cleanParams(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const output: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!/^[a-z0-9_]{1,40}$/i.test(key)) continue;
    if (
      typeof raw === "string" ||
      typeof raw === "number" ||
      typeof raw === "boolean"
    ) {
      output[key] =
        typeof raw === "string" ? raw.slice(0, 500) : raw;
    }
  }
  return output;
}

export async function POST(request: Request) {
  const pixelId =
    process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return new Response(null, { status: 204 });
  }

  let body: CapiBody;
  try {
    body = (await request.json()) as CapiBody;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.consent !== true) {
    return Response.json(
      { ok: false, error: "Consent required" },
      { status: 403 },
    );
  }

  const eventName = cleanString(body.eventName, 40);
  const eventId = cleanString(body.eventId, 100);
  const eventSourceUrl = cleanString(body.eventSourceUrl, 2000);

  if (
    !eventName ||
    !ALLOWED_EVENTS.has(eventName) ||
    !eventId ||
    !eventSourceUrl
  ) {
    return Response.json(
      { ok: false, error: "Invalid event" },
      { status: 400 },
    );
  }

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(eventSourceUrl);
  } catch {
    return Response.json(
      { ok: false, error: "Invalid source URL" },
      { status: 400 },
    );
  }

  if (sourceUrl.protocol !== "https:" && sourceUrl.protocol !== "http:") {
    return Response.json(
      { ok: false, error: "Invalid source URL" },
      { status: 400 },
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const eventTime =
    typeof body.eventTime === "number" &&
    Number.isFinite(body.eventTime) &&
    Math.abs(now - body.eventTime) < 60 * 60 * 24 * 7
      ? Math.floor(body.eventTime)
      : now;

  const forwarded = request.headers.get("x-forwarded-for");
  const clientIp =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    undefined;

  const userAgent = request.headers.get("user-agent") ?? undefined;
  const anonymousId = cleanString(body.anonymousId, 200);
  const fbp = cleanString(body.fbp, 500);
  const fbc = cleanString(body.fbc, 500);

  const userData: Record<string, unknown> = {
    client_user_agent: userAgent,
    client_ip_address: clientIp,
  };

  if (anonymousId) {
    userData.external_id = [sha256(anonymousId)];
  }
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const attribution =
    body.attribution && typeof body.attribution === "object"
      ? cleanParams(body.attribution)
      : {};

  const customData = {
    ...cleanParams(body.params),
    ...(Object.keys(attribution).length > 0 ? { attribution } : {}),
  };

  const graphVersion = process.env.META_GRAPH_VERSION ?? "v23.0";
  const endpoint = `https://graph.facebook.com/${graphVersion}/${pixelId}/events`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(6000),
      body: JSON.stringify({
        data: [
          {
            event_name: eventName,
            event_time: eventTime,
            event_id: eventId,
            event_source_url: sourceUrl.toString(),
            action_source: "website",
            user_data: userData,
            custom_data: customData,
          },
        ],
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      console.error(
        "Meta CAPI request failed",
        response.status,
        eventName,
      );
      return Response.json(
        { ok: false, error: "Upstream error" },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    console.error("Meta CAPI request error", eventName);
    return Response.json(
      { ok: false, error: "Upstream unavailable" },
      { status: 502 },
    );
  }
}
