"use client";

import { motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

const FILL_DURATION = 0.5;
const FILL_EASE = [0.16, 1, 0.3, 1] as const;

/* Rendering as a real anchor (rather than a button inside a link) keeps the
   markup valid and the destination crawlable, which the marketing pages rely on. */
const MotionLink = motion.create(Link);

type ButtonHTMLAttributesForMotion = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

function getCoverDiameter(width: number, height: number, x: number, y: number) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y)
      )
  );
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function hasTextContent(node: React.ReactNode): boolean {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim().length > 0;
  }

  if (Array.isArray(node)) {
    return node.some(hasTextContent);
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return hasTextContent(node.props.children);
  }

  return false;
}

type OriginButtonProps = ButtonHTMLAttributesForMotion & {
  children?: React.ReactNode;
  loading?: boolean;
  /** Filled brand treatment; otherwise the outlined surface variant. */
  variant?: "solid" | "outline";
  /** Renders the control as a link to this destination instead of a button. */
  href?: string;
  target?: string;
  rel?: string;
};

const OriginButton = React.forwardRef<HTMLButtonElement, OriginButtonProps>(
  (
    {
      children,
      className,
      disabled = false,
      href,
      loading = false,
      type = "button",
      variant = "solid",
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      onKeyUp,
      onPointerCancel,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onPointerUp,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLElement | null>(null);
    const isDisabled = Boolean(disabled || loading);
    const [hovered, setHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
    const [coverSize, setCoverSize] = React.useState(0);

    const ariaLabel = props["aria-label"];
    const ariaLabelledBy = props["aria-labelledby"];

    React.useEffect(() => {
      if (process.env.NODE_ENV === "production") {
        return;
      }

      if (
        hasTextContent(children) ||
        ariaLabel?.trim() ||
        ariaLabelledBy?.trim()
      ) {
        return;
      }

      console.warn(
        "OriginButton: provide visible label text or aria-label / aria-labelledby so the control has an accessible name."
      );
    }, [ariaLabel, ariaLabelledBy, children]);

    const updateOrigin = React.useCallback((x: number, y: number) => {
      const node = buttonRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      setOrigin({ x, y });
      setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
    }, []);

    const updateOriginFromPointer = React.useCallback(
      (event: React.PointerEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        updateOrigin(event.clientX - rect.left, event.clientY - rect.top);
      },
      [updateOrigin]
    );

    const updateOriginFromCenter = React.useCallback(() => {
      const node = buttonRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      updateOrigin(rect.width / 2, rect.height / 2);
    }, [updateOrigin]);

    const showFill = !isDisabled && (hovered || isPressed);

    React.useLayoutEffect(() => {
      const node = buttonRef.current;
      if (!(node && showFill)) return;

      const measure = () => {
        const rect = node.getBoundingClientRect();
        setCoverSize(
          getCoverDiameter(rect.width, rect.height, origin.x, origin.y)
        );
      };

      measure();

      const observer = new ResizeObserver(measure);
      observer.observe(node);

      const fonts = document.fonts;
      if (fonts?.ready) {
        fonts.ready.then(measure).catch(() => undefined);
      }

      return () => observer.disconnect();
    }, [showFill, origin.x, origin.y]);

    const fillTransition = { duration: FILL_DURATION, ease: FILL_EASE };

    const setMergedRef = React.useCallback(
      (node: HTMLElement | null) => {
        buttonRef.current = node;
        assignRef(ref, node as HTMLButtonElement | null);
      },
      [ref]
    );

    const sharedProps = {
      ...props,
      "aria-busy": loading || undefined,
      className: cn(
          "relative inline-flex h-12 cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden rounded-xl px-6 font-medium text-[15px] tracking-[-0.01em]",
          "transition-[color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "solid"
            ? "border border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
            : "border border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink)]",
          // Solid keeps white text throughout (the ink wipe stays high-contrast);
          // outline flips to white once the brand fill lands under it.
          showFill &&
            (variant === "solid"
              ? "border-[var(--color-ink)]"
              : "border-[var(--color-brand)] text-white"),
        className
      ),
      "data-pressed": isPressed ? "true" : "false",
      onBlur: (event: React.FocusEvent<HTMLButtonElement>) => {
          onBlur?.(event);
          setIsPressed(false);
          if (!event.defaultPrevented) {
            setHovered(false);
          }
      },
      onClick,
      onFocus: (event: React.FocusEvent<HTMLButtonElement>) => {
          onFocus?.(event);
          if (isDisabled || event.defaultPrevented) return;
          if (event.currentTarget.matches(":focus-visible")) {
            updateOriginFromCenter();
            setHovered(true);
          }
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(event);

          if (
            event.defaultPrevented ||
            isDisabled ||
            event.repeat ||
            (event.key !== " " && event.key !== "Enter")
          ) {
            return;
          }

          if (event.key === " ") {
            event.preventDefault();
          }

          updateOriginFromCenter();
          setIsPressed(true);
          setHovered(true);
      },
      onKeyUp: (event: React.KeyboardEvent<HTMLButtonElement>) => {
          onKeyUp?.(event);

          if (event.key === " " || event.key === "Enter") {
            setIsPressed(false);
            if (!event.currentTarget.matches(":focus-visible")) {
              setHovered(false);
            }
          }
      },
      onPointerCancel: (event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerCancel?.(event);
          setIsPressed(false);
      },
      onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerDown?.(event);

          if (event.defaultPrevented || isDisabled || event.button !== 0) {
            return;
          }

          updateOriginFromPointer(event);
          setIsPressed(true);
          setHovered(true);
      },
      onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerEnter?.(event);
          if (isDisabled || event.defaultPrevented) return;
          updateOriginFromPointer(event);
          setHovered(true);
      },
      onPointerLeave: (event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerLeave?.(event);
          setHovered(false);
          setIsPressed(false);
      },
      onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerUp?.(event);
          setIsPressed(false);
      },
      whileTap: isDisabled ? undefined : { scale: 0.985 },
    };

    const inner = (
      <>
        <motion.span
          animate={{ scale: showFill && coverSize > 0 ? 1 : 0 }}
          aria-hidden
          className={cn(
            "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
            variant === "solid"
              ? "bg-[var(--color-ink)]"
              : "bg-[var(--color-brand)]"
          )}
          initial={false}
          style={{
            height: coverSize,
            left: origin.x,
            top: origin.y,
            width: coverSize,
          }}
          transition={fillTransition}
        />
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </>
    );

    if (href) {
      // mailto:/tel:/absolute URLs aren't client-routable, so they get a plain
      // anchor; in-app paths keep next/link's prefetch and soft navigation.
      const isInternal = href.startsWith("/") || href.startsWith("#");

      if (!isInternal) {
        return (
          <motion.a
            {...(sharedProps as unknown as React.ComponentProps<typeof motion.a>)}
            href={href}
            ref={setMergedRef as React.Ref<HTMLAnchorElement>}
          >
            {inner}
          </motion.a>
        );
      }

      return (
        <MotionLink
          {...(sharedProps as unknown as React.ComponentProps<typeof MotionLink>)}
          href={href}
          ref={setMergedRef as React.Ref<HTMLAnchorElement>}
        >
          {inner}
        </MotionLink>
      );
    }

    return (
      <motion.button
        {...(sharedProps as React.ComponentProps<typeof motion.button>)}
        disabled={isDisabled}
        ref={setMergedRef}
        type={type}
      >
        {inner}
      </motion.button>
    );
  }
);
OriginButton.displayName = "OriginButton";

export { OriginButton };
export type { OriginButtonProps };
