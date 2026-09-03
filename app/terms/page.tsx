import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Next Big Innovation Labs website and Services: acceptable use, intellectual property, liability and governing law.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/terms",
    title: "Terms of Service | Next Big Innovation Labs",
    description:
      "The terms that govern your use of the Next Big Innovation Labs website and Services: acceptable use, intellectual property, liability and governing law.",
    images: [
      {
        url: "/images/np-side.webp",
        width: 1200,
        height: 630,
        alt: "Next Big Innovation Labs bioprinter",
      },
    ],
  },
};

const EFFECTIVE_DATE = "September 2, 2026";

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main className="bg-[var(--color-bg)]">
        <article className="max-w-3xl mx-auto px-6 pt-32 pb-24">
          {/* Header */}
          <header className="mb-12 border-b border-[var(--color-hairline)] pb-10">
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-[var(--color-ink)] leading-[1.05]">
              Terms of Service
            </h1>
            <p className="mt-5 text-[14px] text-[var(--color-ink-muted)]">
              Updated at {EFFECTIVE_DATE}
            </p>
          </header>

          {/* Body */}
          <div className="flex flex-col gap-10 text-[15px] leading-[1.75] text-[var(--color-ink-muted)]">
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
              and use of the website, subdomains, and application operated by
              Next Big Innovation Labs&reg; (&ldquo;we,&rdquo;
              &ldquo;our,&rdquo; or &ldquo;us&rdquo;) (collectively, the
              &ldquo;Service&rdquo;). By accessing or using the Service, you
              agree to be bound by these Terms and by our{" "}
              <a
                href="/privacy-policy"
                className="text-[var(--color-brand-strong)] underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Privacy Policy
              </a>
              . If you do not agree, please do not use the Service.
            </p>

            <Section title="Who we are">
              <p>
                Next Big Innovation Labs&reg; is a bioprinting hardware and
                software company headquartered at No.22, 16th Cross, 5th Phase,
                J.P. Nagar, Bengaluru - 560078, Karnataka, India.
              </p>
            </Section>

            <Section title="Eligibility">
              <p>
                You must be at least 18 years old, or the age of legal majority
                in your jurisdiction, and capable of forming a binding contract,
                to use the Service on your own behalf. If you use the Service on
                behalf of an organization, you represent that you are authorized
                to bind that organization to these Terms.
              </p>
            </Section>

            <Section title="Acceptable use">
              <p>You agree not to use the Service to:</p>
              <ul className={listClass}>
                <li>
                  Violate any applicable law, regulation, or the rights of any
                  third party;
                </li>
                <li>
                  Submit false, misleading, or fraudulent information through
                  any form, including consultation, newsletter, or careers
                  submissions;
                </li>
                <li>
                  Probe, scan, or attempt to breach the security or integrity of
                  the Service or any connected system;
                </li>
                <li>
                  Scrape, harvest, or reproduce Service content at scale without
                  our prior written consent; or
                </li>
                <li>
                  Interfere with or disrupt the Service, its servers, or
                  networks connected to it.
                </li>
              </ul>
            </Section>

            <Section title="Intellectual property">
              <p>
                The Service and its entire contents, features, and functionality,
                including all text, graphics, logos, product names
                (Trivima, Dhee, and related marks), images, and software,
                are owned by Next Big Innovation Labs, its licensors, or other
                providers of such material, and are protected by Indian and
                international copyright, trademark, patent, and other
                intellectual property laws. Nothing in these Terms grants you
                any right to use our name, logos, or trademarks without our
                prior written consent.
              </p>
            </Section>

            <Section title="Forms and submissions">
              <p>
                Where you submit information through a consultation request,
                project form, newsletter signup, or careers application, you
                grant us permission to use that information to respond to you,
                evaluate your request, and communicate with you as described in
                our Privacy Policy. You are responsible for the accuracy of any
                information you submit.
              </p>
            </Section>

            <Section title="Third-party links and services">
              <p>
                The Service may contain links to third-party websites or
                services, including our newsletter on Substack and social
                platforms, that are not owned or controlled by Next Big
                Innovation Labs. We have no control over, and assume no
                responsibility for, the content, privacy policies, or practices
                of any third-party websites or services. Your use of those
                websites and services is entirely at your own risk and subject
                to their own terms.
              </p>
            </Section>

            <Section title="Disclaimer of warranties">
              <p>
                The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis, without warranties of any kind, whether
                express or implied, including but not limited to implied
                warranties of merchantability, fitness for a particular purpose,
                non-infringement, or that the Service will be uninterrupted,
                secure, or error-free. Product specifications and imagery are
                provided for informational purposes and are subject to change
                without notice.
              </p>
            </Section>

            <Section title="Limitation of liability">
              <p>
                To the fullest extent permitted by applicable law, Next Big
                Innovation Labs and its officers, employees, and affiliates will
                not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or
                revenues, arising out of or in connection with your access to
                or use of, or inability to access or use, the Service.
              </p>
            </Section>

            <Section title="Indemnification">
              <p>
                You agree to indemnify and hold harmless Next Big Innovation
                Labs and its officers, employees, and affiliates from any claim
                or demand, including reasonable legal fees, made by any third
                party arising out of your breach of these Terms or your misuse
                of the Service.
              </p>
            </Section>

            <Section title="Termination">
              <p>
                We may suspend or terminate your access to the Service at any
                time, without notice, for conduct that we believe violates these
                Terms or is harmful to other users of the Service, us, or third
                parties, or for any other reason at our discretion.
              </p>
            </Section>

            <Section title="Governing law">
              <p>
                These Terms are governed by the laws of India, without regard to
                its conflict of laws provisions. You consent to the exclusive
                jurisdiction of the courts located in Bengaluru, Karnataka, for
                any dispute arising out of or relating to these Terms or the
                Service.
              </p>
            </Section>

            <Section title="Changes to these Terms">
              <p>
                We may revise these Terms from time to time. The updated version
                will be indicated by an updated &ldquo;Updated at&rdquo; date at
                the top of this page and is effective as soon as it is
                accessible. Your continued use of the Service after any revision
                becomes effective constitutes your acceptance of the revised
                Terms.
              </p>
            </Section>

            <Section title="Contact us">
              <p>Questions about these Terms can be sent to:</p>
              <ul className={listClass}>
                <li>
                  Via Email:{" "}
                  <a
                    href="mailto:support@nextbiginnovationlabs.com"
                    className="text-[var(--color-brand-strong)] underline underline-offset-4 hover:opacity-80 transition-opacity"
                  >
                    support@nextbiginnovationlabs.com
                  </a>
                </li>
                <li>
                  By mail: No.22, 16th Cross, 5th Phase, J.P. Nagar, Bengaluru
                  560078, Karnataka, India
                </li>
              </ul>
            </Section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

const listClass =
  "mt-3 flex flex-col gap-2 list-disc pl-5 marker:text-[var(--color-ink-faint)]";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[20px] font-semibold tracking-tight text-[var(--color-ink)] mb-3">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
