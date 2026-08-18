"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

// Real customer reviews for the Trivima range. Quotes are verbatim; where no
// institution was stated the entry is name-only rather than guessed.
// `imgSrc` is optional — until headshots are supplied the card falls back to an
// initials monogram, so adding a photo later is a one-line change per person.
type Testimonial = {
  /** Stable across rotations — it is the React key, so it must never change. */
  id: number;
  testimonial: string;
  name: string;
  org?: string;
  imgSrc?: string;
};

const testimonials: Testimonial[] = [
  {
    id: 0,
    testimonial:
      "In our two years with the Trivima 3D bioprinter, it has proven user-friendly and integral to our research. The NBIL team’s consistent support, from technical specifications to troubleshooting, has been commendable. I strongly recommend Trivima for researchers interested in 3D bioprinting.",
    name: "Dr. Janani Radhakrishnan",
    org: "National Institute of Animal Biotechnology (NIAB)",
  },
  {
    id: 1,
    testimonial:
      "The Next Big Innovation Labs® Trivima Bioprinter has proven to be a game-changer for us. From single to dual extruders, it excels in customized bioprinting. Its versatility allows us to optimize parameters for efficient results, making it highly valuable for applications from tissue engineering to tumor modeling.",
    name: "Dr. Falguni Pati",
    org: "Indian Institute of Technology Hyderabad (IITH)",
  },
  {
    id: 2,
    testimonial:
      "Our experience with the TRIVIMA Advanced bioprinter by Next Big Innovation Labs has been enriching. We’ve successfully employed its capabilities in tissue engineering, printing custom biomaterial inks, and exploring microfluidic devices. The NBIL team’s assistance in customizations has been invaluable.",
    name: "Dr. Bhisham Singh",
    org: "Manipal School of Life Sciences (MSLS)",
  },
  {
    id: 3,
    testimonial:
      "The Dhee software is very user-friendly, with an easy and efficient slicing process that makes 3D printing simple to operate. The pause-and-resume printing feature is especially useful and adds great flexibility during printing. Overall, it’s a reliable and well-designed software—great work by the team!",
    name: "Mohan",
    org: "CLRI Chennai",
  },
  {
    id: 4,
    testimonial:
      "We have the NBIL TRIVIMA Advanced and it’s a very good 3D bioprinter as it is highly customisable and can be used for both extrusion & melt based printing. The NBIL team is also very supportive and have always helped us with any queries.",
    name: "Parichita Mishra",
    org: "Manipal Academy of Higher Education (MAHE)",
  },
  {
    id: 5,
    testimonial:
      "NBIL printers are highly customisable, therefore perfect for us to try variety of things. I was personally impressed by their tech team which is very responsive and helped us every step of the way.",
    name: "Prof. Amit Nain",
    org: "Indian Institute of Technology Delhi (IIT Delhi)",
  },
];

/** "Dr. Janani Radhakrishnan" -> "JR". Honorifics are skipped. */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => !/^(dr|prof|mr|mrs|ms)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}


interface TestimonialCardProps {
  position: number;
  testimonial: (typeof testimonials)[0];
  handleMove: (steps: number) => void;
  cardSize: number;
  /**
   * This card just wrapped from one end of the fan to the other. Sliding it
   * across the whole deck would be nonsense, so it is placed instantly and
   * faded in at its new edge instead.
   */
  wrapping: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
  wrapping,
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
        opacity: wrapping ? 0 : 1,
        transition: wrapping ? "none" : undefined,
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
      {/* These are real reviews and run long, so the quote gets the whole card
          and the attribution sits inline at the foot, avatar included. */}
      <h3
        className={cn(
          "pr-6 text-[15px] sm:text-[17px] font-medium leading-[1.45] text-pretty",
          isCenter ? "text-primary-foreground" : "text-foreground"
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <div className="absolute bottom-7 left-8 right-8 flex items-center gap-3">
        {testimonial.imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.imgSrc}
            alt=""
            className="size-9 shrink-0 rounded-full bg-muted object-cover object-top"
          />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold tracking-tight",
              isCenter
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {initialsOf(testimonial.name)}
          </span>
        )}
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-[14px] font-semibold leading-tight",
              isCenter ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {testimonial.name}
          </p>
          {testimonial.org && (
            <p
              className={cn(
                "truncate text-[12.5px] leading-tight",
                isCenter ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {testimonial.org}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(460);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  // Ids that changed ends on the last move. They are rendered once with no
  // transition, then released on the following frame so they fade in.
  const [wrapped, setWrapped] = useState<number[]>([]);

  const handleMove = (steps: number) => {
    if (!steps) return;
    const newList = [...testimonialsList];
    const moved: number[] = [];
    const count = Math.min(Math.abs(steps), newList.length);

    for (let i = 0; i < count; i++) {
      const item = steps > 0 ? newList.shift() : newList.pop();
      if (!item) return;
      if (steps > 0) newList.push(item);
      else newList.unshift(item);
      moved.push(item.id);
    }

    setTestimonialsList(newList);
    setWrapped(moved);
  };

  // Two frames: the first lets the browser paint the wrapped cards at their new
  // edge while transitions are off, the second turns transitions back on so the
  // opacity change animates instead of snapping.
  useEffect(() => {
    if (!wrapped.length) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setWrapped([]));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [wrapped]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      // Roomier than the placeholder copy needed — the real reviews run 150-310
      // characters at 17px and have to clear the attribution row at the foot.
      setCardSize(matches ? 460 : 330);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Swipe navigation for touch devices.
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only treat as a swipe when it's mostly horizontal and past a threshold.
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      handleMove(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-muted/30 touch-pan-y select-none"
      style={{ height: 600 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {testimonialsList.map((testimonial, index) => {
        // Centre the fan on the middle card. An odd count has a true middle at
        // floor(n/2); an even one leans a card to the left, as it must.
        const position = index - Math.floor(testimonialsList.length / 2);
        return (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
            wrapping={wrapped.includes(testimonial.id)}
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
