import type { ReactElement } from "react";

/**
 * Emits a single `application/ld+json` script wrapping the given nodes in a
 * schema.org `@graph`. The `<` escape prevents the JSON from ever closing the
 * script tag early.
 */
export function JsonLd({
  graph,
}: {
  graph: Array<Record<string, unknown>>;
}): ReactElement {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized JSON-LD with angle brackets escaped above
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
