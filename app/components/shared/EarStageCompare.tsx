"use client";

import StageCompare from "@/app/components/shared/StageCompare";

/**
 * The landing hero's wipe: one auricular scaffold carried through CAD,
 * slicing and print. The mechanics live in StageCompare; what is here is the
 * footage and the travel it was framed for.
 */
export default function EarStageCompare() {
  return (
    <StageCompare
      stages={[
        {
          src: "/images/home/ear-cad.webp",
          alt: "CAD mesh of a human ear on a drawing grid",
          label: "CAD model",
        },
        {
          src: "/images/home/ear-gcode.webp",
          alt: "The same ear as sliced toolpaths, every print layer visible",
          label: "Sliced toolpaths",
        },
        {
          src: "/images/home/ear-printed.webp",
          alt: "The ear bioprinted in amber bioink, held on a print disc",
          label: "Bioprinted",
        },
      ]}
      /* The ear sits across roughly the last third of every frame, further
         right and narrower than the consultancy scaffold, so the window runs
         later and further. At rest it splits the ear three ways: mesh on the
         left, toolpaths through the window, print on the right. */
      travel={{ min: 66, max: 93, start: 76 }}
      nudge={8}
      hint="Slide the window through CAD, slicing and print"
      /* Portrait screens crop hard to the middle of the image; pushed right so
         what survives the crop is the ear rather than empty grid. */
      objectPosition="object-[76%_center] lg:object-center"
    />
  );
}
