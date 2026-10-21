"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  slug: string;
  title: string;
  height: number;
  hover?: boolean;
  live?: boolean;
  virtualWidth?: number;
  maxScale?: number;
  hovering?: boolean;
};

const FRAME_WIDTH = 340;

export function DemoFrame({ slug, title, height, hover, live, virtualWidth = FRAME_WIDTH, maxScale = 1, hovering }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [width, setWidth] = useState(0);
  const [near, setNear] = useState(!!live);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e!.contentRect.width));
    ro.observe(el);
    const near = new IntersectionObserver(([e]) => setNear(!!live || e!.isIntersecting), { rootMargin: "900px 0px" });
    const seen = new IntersectionObserver(([e]) => setVisible(e!.isIntersecting), { threshold: 0.4 });
    near.observe(el);
    seen.observe(el);
    return () => {
      ro.disconnect();
      near.disconnect();
      seen.disconnect();
    };
  }, [live]);

  // Hover demos: forward the card hover into the frame, and on touch screens pulse it while visible.
  useEffect(() => {
    if (!hover) return;
    const set = (on: boolean) => frame.current?.contentDocument?.documentElement.classList.toggle("hover", on);
    if (hovering !== undefined && hovering) {
      set(true);
      return () => set(false);
    }
    const coarse = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!coarse || !visible || reduce || live) return;
    let on = false;
    const t = setInterval(() => set((on = !on)), 1800);
    return () => {
      clearInterval(t);
      set(false);
    };
  }, [hover, hovering, visible, live]);

  const scale = width ? Math.min(width / virtualWidth, maxScale) : 0;
  const frameHeight = (height * virtualWidth) / FRAME_WIDTH;
  const shown = Math.round(frameHeight * (scale || 1));

  return (
    <div ref={box} className={`frame${live ? " live" : ""}`} style={{ height: width ? shown : undefined, aspectRatio: width ? undefined : `${virtualWidth} / ${frameHeight}` }}>
      {near && scale > 0 && (
        <iframe
          ref={frame}
          title={`Demonstração: ${title}`}
          src={`/demo/${slug}${live ? "?live" : ""}`}
          loading={live ? "eager" : "lazy"}
          sandbox="allow-same-origin"
          tabIndex={live ? 0 : -1}
          aria-hidden={live ? undefined : true}
          width={virtualWidth}
          height={frameHeight}
          style={{ width: virtualWidth, height: frameHeight, transform: `scale(${scale})`, left: scale < width / virtualWidth ? (width - virtualWidth * scale) / 2 : 0 }}
        />
      )}
    </div>
  );
}
