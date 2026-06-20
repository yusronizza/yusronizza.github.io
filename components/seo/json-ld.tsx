type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * Renders a structured-data <script> tag. The data passed in always
 * originates from our own static content (never user input), so
 * JSON-serializing it is safe; we still escape `</script>` defensively.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
