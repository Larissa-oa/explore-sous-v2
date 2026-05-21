"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const LINE_CLAMP: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

function clampClass(lines: number): string {
  return LINE_CLAMP[lines] ?? LINE_CLAMP[3]!;
}

export interface ClampedExpandableTextProps {
  /** Plain text (measurement assumes no rich markup). */
  text: string;
  readMoreLabel: string;
  readLessLabel: string;
  /**
   * Lines shown when collapsed. Read more / less only appears when the text
   * overflows this clamp (i.e. needs more than this many lines).
   * @default 3
   */
  collapsedLines?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Classes on the text block (e.g. `type-body-md text-foreground`). */
  textClassName?: string;
  /** Classes on the read more / less control. */
  toggleClassName?: string;
  /** Root wrapper for layout spacing. */
  className?: string;
}

/**
 * Collapses long text with a line clamp and shows **read more / read less** only when
 * the content actually overflows the collapsed height (so short copy has no toggle).
 */
export function ClampedExpandableText({
  text,
  readMoreLabel,
  readLessLabel,
  collapsedLines = 3,
  textClassName,
  toggleClassName,
  className,
}: ClampedExpandableTextProps) {
  const bodyId = useId();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isTruncatable, setIsTruncatable] = useState(false);

  const lines = collapsedLines;
  const clamp = clampClass(lines);

  useEffect(() => {
    setExpanded(false);
  }, [text, lines]);

  const measure = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    if (expanded) return;
    const truncated = el.scrollHeight > el.clientHeight + 1;
    setIsTruncatable(truncated);
  }, [expanded]);

  useLayoutEffect(() => {
    measure();
    const el = textRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [measure, text, lines]);

  const toggle = useCallback(() => {
    setExpanded((v) => !v);
  }, []);

  return (
    <div className={cn("min-w-0", className)}>
      <p
        ref={textRef}
        id={bodyId}
        className={cn(
          textClassName,
          !expanded && clamp,
          !expanded && "overflow-hidden",
        )}
      >
        {text}
      </p>
      {isTruncatable ? (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={bodyId}
          className={cn(
            "mt-2 inline-flex font-semibold text-foreground underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
            toggleClassName,
          )}
        >
          {expanded ? readLessLabel : readMoreLabel}
        </button>
      ) : null}
    </div>
  );
}
