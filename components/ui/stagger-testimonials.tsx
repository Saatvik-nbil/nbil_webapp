"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

// Bioprinting-lab testimonials for the Trivima range.
const testimonials = [
  {
    tempId: 0,
    testimonial:
      "We printed our first perfusable vascular graft on the NP within a week of install. The rotary spindle just works.",
    by: "Dr. Aisha N., Principal Investigator, Vascular Tissue Lab",
    imgSrc: "https://i.pravatar.cc/150?img=5",
  },
  {
    tempId: 1,
    testimonial:
      "Switching three bioinks mid-print used to mean three machines. The Pro does it in one run.",
    by: "Marco R., Postdoctoral Researcher, Regenerative Medicine",
    imgSrc: "https://i.pravatar.cc/150?img=12",
  },
  {
    tempId: 2,
    testimonial:
      "Dhee's non-planar toolpaths saved my PhD. No more seam artifacts on tubular scaffolds.",
    by: "Lena F., PhD Candidate, Biofabrication Group",
    imgSrc: "https://i.pravatar.cc/150?img=9",
  },
  {
    tempId: 3,
    testimonial:
      "The Mini fit inside our existing biosafety cabinet and our budget. Teaching lab sorted.",
    by: "Dr. Okoro A., Lab Director, Cell Biology",
    imgSrc: "https://i.pravatar.cc/150?img=13",
  },
  {
    tempId: 4,
    testimonial:
      "Sub-10 micron repeatability means our corneal constructs finally match between batches.",
    by: "Hannah S., Research Scientist, Ocular Engineering",
    imgSrc: "https://i.pravatar.cc/150?img=20",
  },
  {
    tempId: 5,
    testimonial:
      "Niyantranam runs our well-plate jobs unattended overnight. Throughput tripled.",
    by: "Sofia M., Lab Manager, Organoid Core Facility",
    imgSrc: "https://i.pravatar.cc/150?img=16",
  },
  {
    tempId: 6,
    testimonial:
      "The Aura's 40 micron resolution let us print organ-on-chip features we couldn't extrude before.",
    by: "Daniel K., Microfluidics Lead, Microphysiology Lab",
    imgSrc: "https://i.pravatar.cc/150?img=3",
  },
  {
    tempId: 7,
    testimonial:
      "With HEPA and germicidal UV in the chamber, we dropped contamination to near zero.",
    by: "Priya V., Senior Technician, Tissue Engineering",
    imgSrc: "https://i.pravatar.cc/150?img=24",
  },
  {
    tempId: 8,
    testimonial:
      "Coaxial printing on the Advanced gave us hollow nerve conduits on the first attempt.",
    by: "Tom B., Neural Tissue Researcher",
    imgSrc: "https://i.pravatar.cc/150?img=15",
  },
  {
    tempId: 9,
    testimonial:
      "Open materials. We run our own GelMA formulations with no vendor lock-in.",
    by: "Elena P., Materials Scientist, Soft Matter Lab",
    imgSrc: "https://i.pravatar.cc/150?img=32",
  },
  {
    tempId: 10,
    testimonial:
      "Installation training was hands-on and thorough. We were printing cell-laden gels by day two.",
    by: "Kenji T., Postdoc, Cardiac Tissue Lab",
    imgSrc: "https://i.pravatar.cc/150?img=11",
  },
  {
    tempId: 11,
    testimonial:
      "Pellet extrusion to 250 C means we print thermoplastics and hydrogels on one platform.",
    by: "Grace L., Biomaterials PI",
    imgSrc: "https://i.pravatar.cc/150?img=45",
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: (typeof testimonials)[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 bg-primary text-primary-foreground border-primary"
          : "z-0 bg-card text-card-foreground border-border hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px var(--border)" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(",")[0]}`}
        className="mb-4 h-14 w-12 bg-muted object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px var(--background)",
        }}
      />
      <h3
        className={cn(
          "text-base sm:text-xl font-medium leading-snug text-balance",
          isCenter ? "text-primary-foreground" : "text-foreground"
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-sm italic leading-snug text-pretty",
          isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-muted/30" style={{ height: 600 }}>
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors cursor-pointer",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors cursor-pointer",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
