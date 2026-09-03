import TestimonialsCarousel, {
  type Testimonial,
  type TrustedLogo,
} from "@/app/components/shared/TestimonialsCarousel";

// Real customer reviews for the Trivima range. Quotes are verbatim; where no
// institution was stated the entry is name-only rather than guessed.
const TESTIMONIALS: Testimonial[] = [
  {
    id: 0,
    quote:
      "In our two years with the Trivima 3D bioprinter, it has proven user-friendly and integral to our research. The NBIL team’s consistent support, from technical specifications to troubleshooting, has been commendable. I strongly recommend Trivima for researchers interested in 3D bioprinting.",
    name: "Dr. Janani Radhakrishnan",
    org: "National Institute of Animal Biotechnology (NIAB)",
  },
  {
    id: 1,
    quote:
      "The Next Big Innovation Labs® Trivima Bioprinter has proven to be a game-changer for us. From single to dual extruders, it excels in customized bioprinting. Its versatility allows us to optimize parameters for efficient results, making it highly valuable for applications from tissue engineering to tumor modeling.",
    name: "Dr. Falguni Pati",
    org: "Indian Institute of Technology Hyderabad (IITH)",
  },
  {
    id: 2,
    quote:
      "Our experience with the TRIVIMA Advanced bioprinter by Next Big Innovation Labs has been enriching. We’ve successfully employed its capabilities in tissue engineering, printing custom biomaterial inks, and exploring microfluidic devices. The NBIL team’s assistance in customizations has been invaluable.",
    name: "Dr. Bhisham Singh",
    org: "Manipal School of Life Sciences (MSLS)",
  },
  {
    id: 3,
    quote:
      "The Dhee software is very user-friendly, with an easy and efficient slicing process that makes 3D printing simple to operate. The pause-and-resume printing feature is especially useful and adds great flexibility during printing. Overall, it’s a reliable and well-designed software. Great work by the team!",
    name: "Mohan",
    org: "CLRI Chennai",
  },
  {
    id: 4,
    quote:
      "We have the NBIL TRIVIMA Advanced and it’s a very good 3D bioprinter as it is highly customisable and can be used for both extrusion & melt based printing. The NBIL team is also very supportive and have always helped us with any queries.",
    name: "Parichita Mishra",
    org: "Manipal Academy of Higher Education (MAHE)",
  },
  {
    id: 5,
    quote:
      "NBIL printers are highly customisable, therefore perfect for us to try variety of things. I was personally impressed by their tech team which is very responsive and helped us every step of the way.",
    name: "Prof. Amit Nain",
    org: "Indian Institute of Technology Delhi (IIT Delhi)",
  },
];

/**
 * The trusted-by row, wired the way the Dhee Slicer page does it: hovering,
 * focusing or tapping an institution pins that lab's own review in the card.
 * Each entry points at a real quote above, so nothing here is invented.
 *
 * Manipal appears once, under MAHE: MSLS is part of the same university and
 * shares its mark, so a second identical logo would read as a bug. Dr. Bhisham
 * Singh's MSLS review still comes round in the rotation.
 */
const TRUSTED_LABS: TrustedLogo[] = [
  { name: "IIT Hyderabad", logo: "/institute/iithyd.webp", testimonial: TESTIMONIALS[1] },
  { name: "CSIR CLRI Chennai", logo: "/institute/csir-clri-logo.webp", testimonial: TESTIMONIALS[3] },
  { name: "NIAB Hyderabad", logo: "/placeholders/niab_logo.png", testimonial: TESTIMONIALS[0] },
  {
    name: "Manipal Academy of Higher Education",
    logo: "/placeholders/Manipal_University_logo.png",
    testimonial: TESTIMONIALS[4],
  },
  {
    name: "IIT Delhi",
    logo: "/placeholders/Indian_Institute_of_Technology_Delhi_Logo.svg",
    testimonial: TESTIMONIALS[5],
  },
];

export default function TestimonialsSection() {
  return (
    <TestimonialsCarousel
      id="testimonials"
      heading="Trusted in labs that bioprint living tissue."
      description="Principal investigators, postdocs and core-facility managers on what changed after a Trivima bioprinter joined the bench. Pick a lab to read its review."
      testimonials={TESTIMONIALS}
      trustedByLabel="Bioprinting with Trivima"
      trustedLogos={TRUSTED_LABS}
    />
  );
}
