"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          portalId: string;
          formId: string;
          region?: string;
          target: string;
        }) => void;
      };
    };
  }
}

const HUBSPOT_SRC = "https://js-na2.hsforms.net/forms/embed/v2.js";

type HubSpotFormProps = {
  portalId: string;
  formId: string;
  region?: string;
  /** Unique DOM id the form is mounted into. */
  targetId?: string;
  className?: string;
};

/**
 * Embeds a HubSpot form. Loads the HubSpot embed script once (reusing it if
 * another instance already added it) and renders the form into `targetId`.
 */
export default function HubSpotForm({
  portalId,
  formId,
  region = "na2",
  targetId = "hubspot-form",
  className,
}: HubSpotFormProps) {
  const created = useRef(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const create = () => {
      if (created.current) return;
      if (!window.hbspt || !document.getElementById(targetId)) return;
      created.current = true;
      window.hbspt.forms.create({ portalId, formId, region, target: `#${targetId}` });
    };

    // Script already loaded → create immediately.
    if (window.hbspt) {
      create();
      return;
    }

    const onReady = () => {
      // hbspt may attach a tick after the script's load event fires.
      create();
      if (!created.current) {
        interval = setInterval(() => {
          create();
          if (created.current && interval) clearInterval(interval);
        }, 150);
      }
    };

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${HUBSPOT_SRC}"]`
    );

    if (!script) {
      script = document.createElement("script");
      script.src = HUBSPOT_SRC;
      script.charset = "utf-8";
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    script.addEventListener("load", onReady);
    // In case the script finished loading before this effect ran.
    onReady();

    return () => {
      script?.removeEventListener("load", onReady);
      if (interval) clearInterval(interval);
    };
  }, [portalId, formId, region, targetId]);

  return <div id={targetId} className={className} />;
}
