"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: "4rem 2rem",
          fontFamily: "system-ui, sans-serif",
          background: "#0d0d0d",
          color: "#eeeeee",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#ff3344",
            margin: 0,
          }}
        >
          Error
        </p>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginTop: "1rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#888888", marginTop: "0.75rem" }}>
          An unexpected error occurred. Try refreshing the page.
        </p>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              background: "#ff3344",
              color: "#fff",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #333",
              borderRadius: "0.375rem",
              color: "#eeeeee",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
