import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookingButton } from "../CalBooking";

export function FinalCTA({
  eyebrow = "START A PROJECT",
  title = "Ready to build what’s next?",
  body = "Tell us what you are building. We will help you define the right technical path, scope, and delivery approach.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="section section-dark final-cta-section">
      <div className="container-shell">
        <div className="final-cta">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
          <div className="final-cta-actions">
            <BookingButton />
            <Link className="button button-secondary-dark" href="/contact">
              Tell Us About Your Project <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
