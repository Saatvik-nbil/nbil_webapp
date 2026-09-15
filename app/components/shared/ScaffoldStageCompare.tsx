"use client";

import StageCompare from "@/app/components/shared/StageCompare";

/**
 * One bifurcated vascular scaffold carried through CAD, slicing and print.
 * The mechanics live in StageCompare; what is here is the footage and the
 * travel it was framed for.
 */
export default function ScaffoldStageCompare() {
  return (
    <StageCompare
      stages={[
        {
          src: "/images/consultancy/cad-model.webp",
          alt: "CAD model of a bifurcated vascular scaffold on a drawing grid",
          label: "CAD model",
        },
        {
          src: "/images/consultancy/gcode-model.webp",
          alt: "The same scaffold as sliced G-code toolpaths, layer lines visible",
          label: "Sliced G-code",
        },
        {
          src: "/images/consultancy/printed-model.webp",
          alt: "The scaffold bioprinted, held in solution",
          label: "Bioprinted",
        },
      ]}
      /* Clamped to the right of the frame: the scaffold sits there in all
         three shots, and the copy panel owns everything to its left. */
      travel={{ min: 52, max: 92, start: 68 }}
      hint="Slide the window through CAD, G-code and print"
    />
  );
}
