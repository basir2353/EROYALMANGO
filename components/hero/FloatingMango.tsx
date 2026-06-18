"use client";

import { forwardRef, type CSSProperties } from "react";

type FloatingMangoProps = {
  size?: number;
  className?: string;
};

const FloatingMango = forwardRef<HTMLDivElement, FloatingMangoProps>(
  function FloatingMango({ size = 120, className = "" }, ref) {
    const scale = size / 120;

    return (
      <div
        ref={ref}
        className={`mango-scene pointer-events-none select-none ${className}`}
        style={
          {
            "--mango-scale": scale,
            width: size,
            height: size * 1.15,
          } as CSSProperties
        }
      >
        <div className="mango-scene-inner">
          <div className="mango-orb">
            <div className="mango-orb-body">
              <div className="mango-orb-blush" />
              <div className="mango-orb-highlight" />
              <div className="mango-orb-rim" />
            </div>
            <div className="mango-stem" />
            <div className="mango-leaf" />
          </div>
          <div className="mango-shadow" />
        </div>
      </div>
    );
  },
);

export default FloatingMango;
