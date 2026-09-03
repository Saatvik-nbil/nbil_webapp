import TestimonialsCarousel, {
  type Testimonial,
  type TrustedLogo,
} from "@/app/components/shared/TestimonialsCarousel";

const TESTIMONIALS: Testimonial[] = [
  {
    id: 0,
    quote:
      "The technical oversight provided by NBIL during our heart-on-a-chip project was instrumental. Their bioink mastery is unparalleled.",
    name: "Dr. Elena Rostova",
    role: "Lead Researcher",
    org: "BioSystems Lab",
  },
  {
    id: 1,
    quote:
      "Transitioning from academic research to industrial scaling was seamless thanks to NBIL's regulatory strategy consultancy.",
    name: "Dr. Aditya Menon",
    role: "Principal Scientist",
    org: "Regenova",
  },
];

/**
 * Same interaction as the bioprinter and Dhee pages: each client in the row
 * pins its own quote in the card on hover, focus or tap.
 */
const CLIENTS: TrustedLogo[] = [
  {
    name: "BioSystems Lab",
    logo: "/placeholders/biosystem-diagnostics-logo2.webp",
    testimonial: TESTIMONIALS[0],
  },
  { name: "Regenova", logo: "/placeholders/regenova.svg", testimonial: TESTIMONIALS[1] },
];

export default function ConsultancyTestimonials() {
  return (
    <TestimonialsCarousel
      id="testimonials"
      heading="What our consultancy clients say."
      description="Researchers and scaling teams on the difference a dedicated bioprinting consultancy made to their project. Pick a client to read its own words."
      testimonials={TESTIMONIALS}
      trustedByLabel="Projects we have run"
      trustedLogos={CLIENTS}
    />
  );
}
