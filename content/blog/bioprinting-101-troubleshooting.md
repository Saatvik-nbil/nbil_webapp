# Bioprinting 101: Troubleshooting common challenges and solutions

**Overcoming Typical Challenges in Bioprinting**

Welcome to our comprehensive guide on "**Troubleshooting Common Bioprinting Challenges and Solutions.**" This blog is tailored for bioprinting professionals and enthusiasts who face practical issues in their projects.

We understand that bioprinting requires high level skills as well as an intense attention to a number of factors that can influence the result of one's prints. From the baffling experience of a needle tip crashing into the print bed, to experiencing air bubbles in bioink or issues with scaffold integrity, each challenge significantly affects the outcome.

In this blog, we take a look at the common issues one faces during bioprinting and provide precise, actionable steps to rectify these issues. Whether one is dealing with mechanical issues like needle or nozzle clogs, software issues like G Code optimization, or biological challenges such as cell viability.

## 1. My needle tip is colliding with the print bed on movement.

- A common issue faced during printing is the needle tip colliding with the print bed. This usually occurs when the extruder is moving towards the print area for printing from the home position. To avoid this, the first step to do is to locate the centre point coordinates of the print area. Ensure that the XYZ coordinates of this point are accurately set in Gcode. For Trivima printers (Basic, Advanced and Pro), use the G1 Z5 F200 command before the extruder head movement, which moves the print bed downwards by 5mm and can help avoid collision between the needle tip and print bed. The same command for Trivima Mini moves the print head upwards.

## 2. I am noticing air bubbles in my bioink while loading it on the syringe.

- Air bubbles in the bioink need to be avoided as they can lead to inhomogeneity and uneven printing due to the presence of voids. Air bubbles can be eliminated by centrifuging the bioink at a low rpm for 30 seconds. Be cautious to not use a high rpm while centrifuging as it could cause the cells to cluster. Another way is to triturate your bioink slowly when mixing with cells. A helpful tip is to use the walls of the falcon tube in this process. That is, while triturating bioink, dispense it gently along the walls of the falcon tube to reduce the chances of bubble formation. Triturating along the walls of the falcon tube instead of inside the bioink solution decreases the chances of air bubble formation.

## 3. My polymer is not extruding in the pellet extrusion nozzle

- If the polymer is not extruding during melt extrusion, the primary reason could be that the melting temperature of the biomaterial is not being reached. This would mean the polymer is still solid as opposed to being in a molten state for pellet extrusion printing. Determine the melting temperature of the polymer being used and set the extruder temperature accurately.
- Another reason could be a clogged nozzle. For clogged nozzles, you can consider keeping the nozzle in a solvent that can dissolve the polymer. For instance, dichloromethane is a solvent that can dissolve polylactic-co-glycolic acid (PLGA). This would ensure any residual polymers in the nozzle would dissolve and clear the nozzle for printing.

## 4. Problems in Gcode optimisation

### a. During bioprinting, I observe a gap between the print bed and the needle tip leading to the material printing in the air and not adhering to the print bed while printing

- The possibility of this could be that the z-height may be high for printing. Optimize z-height coordinates for better alignment and printing.

### b. I can visually observe that the strut diameter is more/less than the needle gauge diameter.

- It might be a case of over/under extrusion. Reduce and increase the pressure for the pneumatic microextrusion system and extrusion rate for pellet extrusion. This will alter the extrusion rate to avoid over and under-extrusion respectively

### c. My Needle/melt nozzle is dragging the material during printing

- In such cases, it is best to lower the print speed to ensure the deposited bioink adheres to the print bed and avoids dragging

### d. While printing multi-layers, my needle seems to be embedding itself in each layer of printing

- The z-height may be low which could be the possibility of the needle being embedded in the previous layer. Optimize z-height based on the height of each layer in the Gcode.

### e. My scaffold print does not seem to be in the centre of the print area

- Recheck if the coordinates in the centre of the print area have been optimised and accurately entered in the GCode

### f. The movement in my Trivima components such as the extruder head seems very high during printing leading to unnatural sounds.

- Reduce travel speed in XYZ directions, print speed, and retraction speed as per the printer model. Adjusting these may help alleviate the issue and ensure a smooth operation.

## 5. I find my cells getting contaminated and losing viability during incubation

- The primary reason for this could be not maintaining a sterile environment. While using cells for printing, utmost care must be taken in terms of maintaining a sterile environment for the cells to survive and grow. Trivima printers have inbuilt Germicidal UV and HEPA filters to solve this issue. Before you start printing, switch on the UV for 30 minutes. Following this, switch the UV lamp off and turn on the HEPA filter. All this can be done by setting the commands in Niyantranam software. Furthermore, it would be best to sterilise the print area using 70% ethanol before printing.
- Ensure all the media and biomaterials have been sterilised (autoclave, UV, gamma irradiation etc) before being mixed with cells to prepare the bioink. Furthermore, ensure safe and hygienic handling conditions in the biosafety cabinet while preparing the bioink to avoid contamination

## 6. While bioprinting multiple layers, I noticed that the layers are not stacking one above the other, instead are merging or collapsing on the bottom layer leading to it looking like a 2D structure.

- The possible reasons could be insufficient bioink viscosity and crosslinking time. If the bioink viscosity is not appropriate for bioprinting, it will fail to give a 3D structure to the extruded layers. It would be necessary to perform rheological tests to understand the thixotropic nature of the bioink before printing. Furthermore, optimising the crosslinking time would ensure the bottom layer maintains sufficient structural integrity to act as a foundation for the following layer. Addressing these issues and optimizing your process can improve the stacking of layers during bioprinting.

## 7. There is a lack of structural integrity in my scaffolds post-printing.

- Your bioink maintains structural integrity into those perfect 3D structures via crosslinking. Crosslinking significantly influences the mechanical and physiochemical properties of the bioprinted constructs and also the cellular behaviour of the cells in the ink. Hence choosing the right crosslinking method is important for better structural integrity. For instance, if you are choosing a photocrosslinker, figure out the appropriate wavelength needed for crosslinking. For thermal Crosslinking, optimise the bed temperature needed for crosslinking in contact with the print bed. For Ionic, characterise which concentration of crosslinker would work best with the bioink used. For self-crosslinkable polymers, you print at ultra-low speeds to give time for the struts to crosslink by themselves

## 8. I am experiencing needle clogging during bioprinting.

- The first step is to ensure homogeneity in the bioink. If the bioink appears homogeneous without any phase separation, increase pressure to extrude the clogged bioink. If extrusion doesn't occur up to 5.5 bar, change the needle gauge. When working with cells limit pressure to 2 bar and change the needle gauge if clogging persists.
- While using nanoparticles in your bioink, make sure the particle size is lesser than the needle gauge diameter to prevent clogging. Pre-characterise particle size using SEM for better results before printing. Ensure a homogeneous bioink is prepared after characterisation to prevent the nanoparticles from agglomerating
