import TestimonialsCarousel, {
  type Testimonial,
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

export default function ConsultancyTestimonials() {
  return (
    <TestimonialsCarousel
      id="testimonials"
      heading="What our consultancy clients say."
      description="Researchers and scaling teams on the difference a dedicated bioprinting consultancy made to their project."
      testimonials={TESTIMONIALS}
      // These are one-sentence pull quotes, not full reviews — the shared
      // component's 380px default (tuned for Trivima's longer reviews and
      // Dhee's copy column) left a dead gap between the quote and the name.
      minCardHeight={260}
    />
  );
}
