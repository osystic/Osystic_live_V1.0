import { TechnicalVisual } from "./TechnicalVisual";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ShieldCheck,
} from "lucide-react";
import { BookingButton } from "../CalBooking";
import { FinalCTA } from "./FinalCTA";
import { SectionHeading } from "./SectionHeading";

export type ServiceDetailItem = {
  title: string;
  desc: string;
  points?: readonly string[];
};

export type ServiceDetailStep = {
  title: string;
  tag?: string;
  desc: string;
  checks?: readonly string[];
};

export type ServiceDetailTech = {
  category: string;
  items: readonly string[];
};

export type ServiceDetailIndustry = {
  name: string;
  detail: string;
};

export type ServiceDetailFaq = {
  q: string;
  a: string;
};

export type ServiceDetailData = {
  name: string;
  category: string;
  heroH1: string;
  heroSub: string;
  services: readonly ServiceDetailItem[];
  steps?: readonly ServiceDetailStep[];
  techStack?: readonly ServiceDetailTech[];
  industries?: readonly ServiceDetailIndustry[];
  faqs?: readonly ServiceDetailFaq[];
  ctaH2?: string;
  ctaDesc?: string;
};

export function ServiceDetailPage({ data }: { data: ServiceDetailData }) {
  const visibleServices = data.services.slice(0, 6);
  const visibleSteps = data.steps?.slice(0, 5) ?? [];
  const visibleTech = data.techStack?.slice(0, 6) ?? [];
  const visibleIndustries = data.industries?.slice(0, 4) ?? [];
  const visibleFaqs = data.faqs?.slice(0, 6) ?? [];

  return (
    <main id="main-content">
      <section className="service-hero">
        <div className="container-shell service-hero-grid">
          <div className="service-hero-copy">
            <div className="eyebrow">{data.category}</div>
            <h1>{data.heroH1}</h1>
            <p>{data.heroSub}</p>
            <div className="page-hero-actions">
              <BookingButton className="button button-primary">
                Book a Technical Call <ArrowRight size={16} aria-hidden="true" />
              </BookingButton>
              <Link className="button button-secondary-dark" href="/case-studies">
                Explore Our Work
              </Link>
            </div>
            <div className="service-hero-note">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>Ownership and handover terms defined per engagement. Deployment options scoped to the system. Defined delivery phases.</span>
            </div>
          </div>

          <div className="service-hero-visual" aria-hidden="true">
            <TechnicalVisual name={data.name} variant={data.category.toLowerCase().includes("data") || data.category.toLowerCase().includes("cloud") ? "data" : data.category.toLowerCase().includes("engineering") || data.category.toLowerCase().includes("product") ? "product" : "ai"} />
          </div>
        </div>
      </section>

      <section className="section service-capabilities-section">
        <div className="container-shell">
          <SectionHeading
            eyebrow="What we build"
            title={`${data.name}, engineered for production.`}
            body="We scope around the system you actually need to operate, maintain, and operate — not a fixed vendor product or a one-size-fits-all implementation."
          />
          <div className="service-list-grid">
            {visibleServices.map((service, index) => (
              <article className="service-list-card" key={service.title}>
                <div className="service-list-number">{String(index + 1).padStart(2, "0")}</div>
                <h2>{service.title}</h2>
                <p>{service.desc}</p>
                {service.points?.length ? (
                  <ul>
                    {service.points.slice(0, 3).map((point) => (
                      <li key={point}><Check size={14} aria-hidden="true" />{point}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {visibleSteps.length ? (
        <section className="section section-dark">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Delivery"
              title="A clear path from problem to production."
              body="Each engagement is broken into defined phases with reviewable outputs. Scope can adapt, but accountability stays visible."
            />
            <div className="service-process-grid">
              {visibleSteps.map((step, index) => (
                <article className="service-process-step" key={`${step.tag ?? index}-${step.title}`}>
                  <span className="service-process-number">{step.tag ?? String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {visibleTech.length ? (
        <section className="section section-light service-stack-section">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Technology"
              title="Tools selected for the system, not for the trend."
              body="Technology choices follow your environment, operating constraints, team capability, and long-term ownership requirements."
            />
            <div className="service-tech-grid">
              {visibleTech.map((group) => (
                <div className="service-tech-group" key={group.category}>
                  <h3>{group.category}</h3>
                  <div>
                    {group.items.slice(0, 7).map((item) => <span key={item}>{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {visibleIndustries.length ? (
        <section className="section">
          <div className="container-shell">
            <div className="section-topline">
              <SectionHeading
                eyebrow="Where it fits"
                title="Built around domain constraints."
                body="The same technical capability can require very different controls, integrations, and operating models across industries."
              />
              <Link href="/industries" className="text-link">Explore industries <ArrowRight size={15} /></Link>
            </div>
            <div className="service-industry-grid">
              {visibleIndustries.map((industry) => (
                <article key={industry.name}>
                  <h3>{industry.name}</h3>
                  <p>{industry.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {visibleFaqs.length ? (
        <section className="section section-light">
          <div className="container-shell service-faq-layout">
            <SectionHeading
              eyebrow="FAQ"
              title="Technical questions, clear answers."
              body="The exact architecture and delivery plan depend on your environment. These answers describe how OSYSTIC approaches the work."
            />
            <div className="service-faq-list">
              {visibleFaqs.map((faq) => (
                <details key={faq.q}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FinalCTA
        eyebrow="Start a project"
        title={data.ctaH2 ?? "Have a system worth building?"}
        body={data.ctaDesc ?? "Tell us what you are trying to achieve. We will help turn the problem into a clear technical plan."}
      />
    </main>
  );
}
