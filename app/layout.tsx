import type { Metadata, Viewport } from "next";
import { Libre_Franklin } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import SmoothScroll from "@/app/components/SmoothScroll";
import ScrollProgress from "@/app/components/ScrollProgress";
import "./globals.css";

// Official NBIL brand typeface, used for both display and body.
const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nextbiginnovationlabs.com"),
  title: {
    default: "Trivima Bioprinters by NBIL | The Full Range, Spec for Spec",
    template: "%s | Trivima by NBIL",
  },
  description:
    "Explore the Trivima bioprinter range by Next Big Innovation Labs: the non-planar NP, the six-extruder Pro and the light-based Aura. Compare extrusion, inkjet, pellet and MSLA systems spec for spec. Bengaluru, India.",
  keywords: [
    "non-planar bioprinter",
    "Trivima NP bioprinter",
    "bioprinting",
    "biofabrication",
    "rotary scaffold bioprinting",
    "tissue engineering",
    "vascular tissue engineering",
    "corneal bioprinting",
    "organoid modeling",
    "pneumatic extrusion",
    "UV crosslinking bioprinter",
    "Dhee software",
    "NBIL bioprinter",
    "Next Big Innovation Labs",
    "bioprinter India",
    "research bioprinter",
  ],
  authors: [{ name: "Next Big Innovation Labs", url: "https://nextbiginnovationlabs.com" }],
  creator: "Next Big Innovation Labs",
  publisher: "Next Big Innovation Labs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nextbiginnovationlabs.com/trivima-bioprinter/",
    siteName: "Next Big Innovation Labs",
    title: "Trivima Bioprinters — The Full Range by NBIL",
    description:
      "Trivima bioprinters spanning extrusion, inkjet, pellet, non-planar rotary and light-based MSLA. Compare every model spec for spec. By NBIL.",
    images: [
      {
        url: "/images/np-side.png",
        width: 1200,
        height: 630,
        alt: "The Trivima bioprinter range by Next Big Innovation Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trivima Bioprinters — The Full Range by NBIL",
    description:
      "The non-planar NP, the six-extruder Pro and the light-based Aura. Compare spec for spec.",
    images: ["/images/np-side.png"],
  },
  alternates: {
    canonical: "https://nextbiginnovationlabs.com/trivima-bioprinter/",
  },
  category: "Scientific Equipment",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1422" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${libreFranklin.variable} ${GeistMono.variable}`}
    >
      <body>
        <SmoothScroll>
          <ScrollProgress />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
