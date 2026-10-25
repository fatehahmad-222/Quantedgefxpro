# Tracking contract

This site uses Meta Pixel in the browser and the Meta Conversions API (CAPI) on the server. Both are consent-gated and deduplicated by a shared event ID.

## Consent

- Consent is stored in `localStorage` under `qefp-consent-v1` with the value `granted` or `denied`.
- Changes are broadcast on the `qefp:consent` window event.
- `hasMarketingConsent()` is the single gate for Pixel loading, event dispatch, and CAPI delivery.
- The consent bar appears after a short delay only when no decision is stored.
- The footer cookie-settings control clears the decision and reopens the bar.
- No tracking request or Meta script is loaded before `granted`.
- Clear the consent key and reload to test the first-visit flow.

## Browser Pixel

- The Pixel script is injected only after consent and only when `NEXT_PUBLIC_META_PIXEL_ID` is set.
- Standard events use `fbq("track", ...)`; custom events use `fbq("trackCustom", ...)`.
- Every dispatched event receives an `eventID`, also sent to CAPI for deduplication.
- `PageView` is tracked once per consented pathname change.
- `ViewContent` is tracked once for the homepage immediately after `PageView`.

## CAPI route

`POST /api/meta-capi`

- Returns `204` when `META_PIXEL_ID`/`NEXT_PUBLIC_META_PIXEL_ID` or `META_CAPI_ACCESS_TOKEN` is missing.
- Rejects requests without `consent: true` with `403`.
- Accepts only: `PageView`, `ViewContent`, `Lead`, `Contact`, `InitiateCheckout`, `ScrollDepth`, `FAQOpen`, `GuaranteeViewed`.
- Sends `event_id` to match the browser event.
- Adds `client_ip_address`, `client_user_agent`, `fbp`, `fbc`, and a hashed `external_id`.
- Forwards sanitized event params and first-touch attribution.
- Uses `META_GRAPH_VERSION` (default `v23.0`) and a six-second upstream timeout.
- `ScrollDepth`, `FAQOpen`, and `GuaranteeViewed` are sent only to the browser Pixel; they are not forwarded to CAPI by the client.
- The endpoint has no rate limiting. Add edge or platform-level rate limiting before large paid traffic.

## Event matrix

| Event | Trigger | Placement | Params |
| --- | --- | --- | --- |
| `PageView` | Consented page load or pathname change | `MetaPixel` | `page_path`, `page_title` |
| `ViewContent` | Homepage page view | `MetaPixel` | `content_name`, `content_category`, `content_type` |
| `Lead` | Header CTA, mobile CTA, hero primary CTA | `Header`, `Hero` | `source: header` / `mobile-menu` / `hero` |
| `Contact` | Footer email, phone, WhatsApp | `Footer` | `method`, `team` |
| `InitiateCheckout` | Pricing plan WhatsApp CTA | `Pricing` | `value`, `currency: USD`, `content_name`, `content_ids`, `content_type: product` |
| `ScrollDepth` | 25, 50, 75, 90 percent scroll | `ScrollDepth` | `percent`, `page_path` |
| `FAQOpen` | First open of a question | `FAQ` | `question` |
| `GuaranteeViewed` | Guarantee section enters viewport | `SectionViewTracker` | `section: guarantee` |

`ScrollDepth`, `FAQOpen`, and `GuaranteeViewed` use the browser Pixel only (`sendToServer: false` or a non-CAPI event name).

## Attribution and WhatsApp

- `captureAttribution()` stores first-touch `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, landing path, and capture time in `sessionStorage` under `qefp-attribution-v1`.
- Later visits in the same session reuse the stored attribution.
- CAPI custom data includes the attribution object when present.
- `buildWhatsAppUrl()` appends ` [ref: source/campaign]` to the WhatsApp message, but only when the base URL already contains a `text` parameter.
- The footer WhatsApp link has no message, so it never receives the suffix.
- The access CTA keeps the original message and therefore receives the suffix once attribution exists.

## Anonymous identity and cookies

- `qefp-anonymous-id-v1` is a random ID in `localStorage`, hashed with SHA-256 before being sent as `external_id`.
- `_fbp` and `_fbc` are read from cookies and forwarded to CAPI when present.
- No email, phone, or name is collected by the site.

## Testing

1. Use a clean browser profile and confirm no Pixel request appears before consent.
2. Accept all, then confirm `PageView` and `ViewContent` in Meta Events Manager with distinct event IDs.
3. Confirm CAPI and browser events deduplicate under Test Events.
4. Click each CTA source and verify `Lead`, `Contact`, and `InitiateCheckout` params.
5. Load with `?utm_source=test&utm_campaign=qa`, click a WhatsApp CTA, and verify the `[ref: test/qa]` suffix.
6. Decline consent and confirm no further Pixel or CAPI requests occur.
7. Clear the consent key and verify the bar reappears.
