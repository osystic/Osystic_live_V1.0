type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

function safeJsonLd(data: JsonLdValue) {
  // Prevent a literal closing script tag from terminating the JSON-LD element.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function StructuredData({ data, id }: { data: JsonLdValue; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
