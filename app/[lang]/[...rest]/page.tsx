import { notFound } from "next/navigation";

// Any path that matches no page: render the [lang] not-found page inside the
// site layout (instead of Next's bare default 404).
export default function CatchAll() {
  notFound();
}
